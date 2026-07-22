"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { canManageProjects } from "@/lib/permissions";
import { projectSchema } from "@/schemas/project-schema";
import { zodFieldErrors } from "@/lib/validations";
import type { ActionResult, ProjectWithRelations } from "@/types";
import type { ProjectInput } from "@/schemas/project-schema";

// Same shape used in data/projects.ts.
// Kept in sync manually — both files need to return the same ProjectWithRelations.
const projectInclude = {
  owner: {
    select: { id: true, name: true, email: true, role: true },
  },
  members: {
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  },
  _count: {
    select: { issues: true },
  },
} as const;

export async function createProject(
  input: ProjectInput
): Promise<ActionResult<ProjectWithRelations>> {
  // 1. Auth check
  const user = await requireUser();

  // 2. Permission check
  if (!canManageProjects(user)) {
    return {
      ok: false,
      error: "Only admins can create projects.",
    };
  }

  // 3. Validate input
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const { name, description, memberIds } = parsed.data;

  // 4. Create the project (plus initial members) in a single transaction
  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: user.id,
        members: {
          create: memberIds.map((userId) => ({ userId })),
        },
      },
      include: projectInclude,
    });

    // 5. Revalidate the list page so the new project shows up
    revalidatePath("/projects");

    // 6. Return success with the created project
    return { ok: true, data: project };
  } catch (err) {
    console.error("createProject failed:", err);
    return { ok: false, error: "Could not create project. Please try again." };
  }
}

export async function updateProject(
  id: string,
  input: ProjectInput
): Promise<ActionResult<ProjectWithRelations>> {
  const user = await requireUser();

  if (!canManageProjects(user)) {
    return { ok: false, error: "Only admins can update projects." };
  }

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const { name, description, memberIds } = parsed.data;

  try {
    const project = await prisma.$transaction(async (tx) => {
      await tx.projectMember.deleteMany({ where: { projectId: id } });

      return tx.project.update({
        where: { id },
        data: {
          name,
          description,
          members: {
            create: memberIds.map((userId) => ({ userId })),
          },
        },
        include: projectInclude,
      });
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${id}`);

    return { ok: true, data: project };
  } catch (err) {
    console.error("updateProject failed:", err);
    return { ok: false, error: "Could not update project. Please try again." };
  }
}

export async function deleteProject(
  id: string
): Promise<ActionResult<void>> {
  const user = await requireUser();

  if (!canManageProjects(user)) {
    return { ok: false, error: "Only admins can delete projects." };
  }

  try {
    // Schema has no onDelete: Cascade, so we clean up related rows manually.
    // Wrapped in a transaction so partial failures don't leave orphans.
    await prisma.$transaction(async (tx) => {
      // 1. Comments live under Issues, so wipe them first.
      await tx.comment.deleteMany({
        where: { issue: { projectId: id } },
      });

      // 2. Then issues (comments are gone, so no FK conflict).
      await tx.issue.deleteMany({ where: { projectId: id } });

      // 3. Then members.
      await tx.projectMember.deleteMany({ where: { projectId: id } });

      // 4. Finally the project itself.
      await tx.project.delete({ where: { id } });
    });

    revalidatePath("/projects");

    return { ok: true, data: undefined };
  } catch (err: unknown) {
    // P2025 = "record to delete does not exist" — project already gone.
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2025"
    ) {
      return { ok: false, error: "Project not found." };
    }

    console.error("deleteProject failed:", err);
    return { ok: false, error: "Could not delete project. Please try again." };
  }
}

export async function addProjectMember(
  projectId: string,
  userId: string
): Promise<ActionResult<void>> {
  const user = await requireUser();

  if (!canManageProjects(user)) {
    return { ok: false, error: "Only admins can manage project members." };
  }

  try {
    await prisma.projectMember.create({
      data: { projectId, userId },
    });

    revalidatePath(`/projects/${projectId}`);

    return { ok: true, data: undefined };
  } catch (err: unknown) {
    // P2002 = unique constraint (userId, projectId) — user is already a member.
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return { ok: false, error: "That user is already a member of this project." };
    }

    console.error("addProjectMember failed:", err);
    return { ok: false, error: "Could not add member. Please try again." };
  }
}

export async function removeProjectMember(
  projectId: string,
  userId: string
): Promise<ActionResult<void>> {
  const user = await requireUser();

  if (!canManageProjects(user)) {
    return { ok: false, error: "Only admins can manage project members." };
  }

  try {
    await prisma.projectMember.delete({
      where: {
        userId_projectId: { userId, projectId },
      },
    });

    revalidatePath(`/projects/${projectId}`);

    return { ok: true, data: undefined };
  } catch (err: unknown) {
    // P2025 = record not found. User already isn't a member — treat as success.
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2025"
    ) {
      return { ok: true, data: undefined };
    }

    console.error("removeProjectMember failed:", err);
    return { ok: false, error: "Could not remove member. Please try again." };
  }
}