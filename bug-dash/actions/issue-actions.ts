"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser, requireAdmin } from "@/lib/session";
import { canEditIssue } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { issueSchema } from "@/schemas/issue-schema";
import { zodFieldErrors } from "@/lib/validations";
import type { ActionResult } from "@/types";

// Pull the issue fields out of a form and validate them. Empty assignee/due
// values become null so the optional/nullable schema fields accept them.
function parseIssueForm(formData: FormData) {
  return issueSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status") || undefined,
    priority: formData.get("priority") || undefined,
    projectId: formData.get("projectId"),
    assigneeId: formData.get("assigneeId") || null,
    dueDate: formData.get("dueDate") || null,
  });
}

export async function createIssueAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = parseIssueForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the errors below.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  const issue = await prisma.issue.create({
    data: { ...parsed.data, reporterId: user.id },
  });

  revalidatePath("/issues");
  redirect(`/issues/${issue.id}`);
}

export async function updateIssueAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();

  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { ok: false, error: "Missing issue reference." };
  }

  // Only an admin or the issue's assignee may edit it.
  const existing = await prisma.issue.findUnique({
    where: { id },
    select: { assigneeId: true },
  });
  if (!existing) {
    return { ok: false, error: "Issue not found." };
  }
  if (!canEditIssue(user, { assignid: existing.assigneeId })) {
    return { ok: false, error: "You can only edit issues assigned to you." };
  }

  const parsed = parseIssueForm(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the errors below.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  await prisma.issue.update({ where: { id }, data: parsed.data });

  revalidatePath(`/issues/${id}`);
  revalidatePath("/issues");
  redirect(`/issues/${id}`);
}

export async function deleteIssueAction(issueId: string): Promise<void> {
  await requireAdmin();

  // Comments reference the issue, so remove them first (no cascade in schema).
  await prisma.comment.deleteMany({ where: { issueId } });
  await prisma.issue.delete({ where: { id: issueId } });

  revalidatePath("/issues");
  redirect("/issues");
}
