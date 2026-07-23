"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { canAccessProject, canEditIssue, canDeleteIssue } from "@/lib/permissions";
import { issueSchema } from "@/schemas/issue-schema";
import { zodFieldErrors } from "@/lib/validations";
import { ISSUE_STATUSES, ISSUE_PRIORITIES } from "@/lib/constants";
import type { ActionResult, IssueWithRelations, IssueStatus, IssuePriority } from "@/types";
import type { IssueInput } from "@/schemas/issue-schema";

// Same shape used in data/issues.ts.
// Kept in sync manually — both files need to return the same IssueWithRelations.
const issueInclude = {
  project: {
    select: { id: true, name: true },
  },
  reporter: {
    select: { id: true, name: true, email: true, role: true },
  },
  assignee: {
    select: { id: true, name: true, email: true, role: true },
  },
  _count: {
    select: { comments: true },
  },
} as const;

export async function createIssue(
  input: IssueInput
): Promise<ActionResult<IssueWithRelations>> {
  // 1. Auth check
  const user = await requireUser();

  // 2. Validate input
  const parsed = issueSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const { projectId, title, description, status, priority, assigneeId, dueDate } =
    parsed.data;

  // 3. Permission check — must be able to see the target project at all.
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true, members: { select: { userId: true } } },
  });

  if (!project || !canAccessProject(user, project)) {
    return { ok: false, error: "You do not have access to this project." };
  }

  // 4. Create the issue
  try {
    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        status,
        priority,
        projectId,
        assigneeId: assigneeId ?? null,
        dueDate: dueDate ?? null,
        reporterId: user.id,
      },
      include: issueInclude,
    });

    // 5. Revalidate the pages that list issues
    revalidatePath("/issues");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/dashboard");

    return { ok: true, data: issue };
  } catch (err) {
    console.error("createIssue failed:", err);
    return { ok: false, error: "Could not create issue. Please try again." };
  }
}

export async function updateIssue(
  id: string,
  input: IssueInput
): Promise<ActionResult<IssueWithRelations>> {
  const user = await requireUser();

  const existing = await prisma.issue.findUnique({
    where: { id },
    select: { assigneeId: true },
  });

  if (!existing) {
    return { ok: false, error: "Issue not found." };
  }

  if (!canEditIssue(user, existing)) {
    return { ok: false, error: "You can only edit issues assigned to you." };
  }

  const parsed = issueSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const { title, description, status, priority, projectId, assigneeId, dueDate } =
    parsed.data;

  try {
    const issue = await prisma.issue.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        projectId,
        assigneeId: assigneeId ?? null,
        dueDate: dueDate ?? null,
      },
      include: issueInclude,
    });

    revalidatePath("/issues");
    revalidatePath(`/issues/${id}`);
    revalidatePath("/dashboard");

    return { ok: true, data: issue };
  } catch (err: unknown) {
    // P2025 = record to update does not exist — issue got deleted underneath us.
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2025"
    ) {
      return { ok: false, error: "Issue not found." };
    }

    console.error("updateIssue failed:", err);
    return { ok: false, error: "Could not update issue. Please try again." };
  }
}

export async function assignIssue(
  id: string,
  assigneeId: string | null
): Promise<ActionResult<IssueWithRelations>> {
  const user = await requireUser();

  const existing = await prisma.issue.findUnique({
    where: { id },
    select: { assigneeId: true },
  });

  if (!existing) {
    return { ok: false, error: "Issue not found." };
  }

  if (!canEditIssue(user, existing)) {
    return { ok: false, error: "You can only edit issues assigned to you." };
  }

  try {
    const issue = await prisma.issue.update({
      where: { id },
      data: { assigneeId },
      include: issueInclude,
    });

    revalidatePath("/issues");
    revalidatePath(`/issues/${id}`);

    return { ok: true, data: issue };
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2025"
    ) {
      return { ok: false, error: "Issue not found." };
    }

    console.error("assignIssue failed:", err);
    return { ok: false, error: "Could not assign issue. Please try again." };
  }
}

export async function changeIssueStatus(
  id: string,
  status: IssueStatus
): Promise<ActionResult<IssueWithRelations>> {
  const user = await requireUser();

  if (!ISSUE_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  const existing = await prisma.issue.findUnique({
    where: { id },
    select: { assigneeId: true },
  });

  if (!existing) {
    return { ok: false, error: "Issue not found." };
  }

  if (!canEditIssue(user, existing)) {
    return { ok: false, error: "You can only edit issues assigned to you." };
  }

  try {
    const issue = await prisma.issue.update({
      where: { id },
      data: { status },
      include: issueInclude,
    });

    revalidatePath("/issues");
    revalidatePath(`/issues/${id}`);
    revalidatePath("/dashboard");

    return { ok: true, data: issue };
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2025"
    ) {
      return { ok: false, error: "Issue not found." };
    }

    console.error("changeIssueStatus failed:", err);
    return { ok: false, error: "Could not update issue status. Please try again." };
  }
}

export async function changeIssuePriority(
  id: string,
  priority: IssuePriority
): Promise<ActionResult<IssueWithRelations>> {
  const user = await requireUser();

  if (!ISSUE_PRIORITIES.includes(priority)) {
    return { ok: false, error: "Invalid priority." };
  }

  const existing = await prisma.issue.findUnique({
    where: { id },
    select: { assigneeId: true },
  });

  if (!existing) {
    return { ok: false, error: "Issue not found." };
  }

  if (!canEditIssue(user, existing)) {
    return { ok: false, error: "You can only edit issues assigned to you." };
  }

  try {
    const issue = await prisma.issue.update({
      where: { id },
      data: { priority },
      include: issueInclude,
    });

    revalidatePath("/issues");
    revalidatePath(`/issues/${id}`);
    revalidatePath("/dashboard");

    return { ok: true, data: issue };
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2025"
    ) {
      return { ok: false, error: "Issue not found." };
    }

    console.error("changeIssuePriority failed:", err);
    return { ok: false, error: "Could not update issue priority. Please try again." };
  }
}

export async function deleteIssue(id: string): Promise<ActionResult<void>> {
  const user = await requireUser();

  if (!canDeleteIssue(user)) {
    return { ok: false, error: "Only admins can delete issues." };
  }

  try {
    // Schema has no onDelete: Cascade, so comments must go first.
    await prisma.$transaction(async (tx) => {
      await tx.comment.deleteMany({ where: { issueId: id } });
      await tx.issue.delete({ where: { id } });
    });

    revalidatePath("/issues");
    revalidatePath("/dashboard");

    return { ok: true, data: undefined };
  } catch (err: unknown) {
    // P2025 = "record to delete does not exist" — issue already gone.
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2025"
    ) {
      return { ok: false, error: "Issue not found." };
    }

    console.error("deleteIssue failed:", err);
    return { ok: false, error: "Could not delete issue. Please try again." };
  }
}
