"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { projectSchema } from "@/schemas/project-schema";
import { zodFieldErrors } from "@/lib/validations";
import type { ActionResult } from "@/types";

function parseProjectForm(formData: FormData) {
  return projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    memberids: formData.getAll("memberids").map(String),
  });
}

export async function createProjectAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireAdmin();

  const parsed = parseProjectForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the errors below.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const { name, description, memberids } = parsed.data;
  const project = await prisma.project.create({
    data: {
      name,
      description,
      ownerId: user.id,
      members: { create: memberids.map((userId) => ({ userId })) },
    },
  });

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

export async function updateProjectAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, error: "Missing project reference." };
  }

  const parsed = parseProjectForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the errors below.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const { name, description, memberids } = parsed.data;
  await prisma.project.update({
    where: { id },
    data: {
      name,
      description,
      // Replace the membership set with the submitted one.
      members: {
        deleteMany: {},
        create: memberids.map((userId) => ({ userId })),
      },
    },
  });

  revalidatePath(`/projects/${id}`);
  revalidatePath("/projects");
  redirect(`/projects/${id}`);
}

export async function deleteProjectAction(projectId: string): Promise<void> {
  await requireAdmin();

  // Remove dependent rows first (schema has no cascade): comments on the
  // project's issues, then the issues, then memberships, then the project.
  const issues = await prisma.issue.findMany({
    where: { projectId },
    select: { id: true },
  });
  const issueIds = issues.map((i) => i.id);

  await prisma.$transaction([
    prisma.comment.deleteMany({ where: { issueId: { in: issueIds } } }),
    prisma.issue.deleteMany({ where: { projectId } }),
    prisma.projectMember.deleteMany({ where: { projectId } }),
    prisma.project.delete({ where: { id: projectId } }),
  ]);

  revalidatePath("/projects");
  redirect("/projects");
}
