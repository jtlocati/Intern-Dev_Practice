// TODO: Implement project-actions.ts
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