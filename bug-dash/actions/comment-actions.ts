"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { canAccessProject, canDeleteComment } from "@/lib/permissions";
import { commentSchema } from "@/schemas/comment-schema";
import { zodFieldErrors } from "@/lib/validations";
import type { ActionResult, CommentWithInfo } from "@/types";
import type { CommentInput } from "@/schemas/comment-schema";

// Same shape used in data/comments.ts.
// Kept in sync manually — both files need to return the same CommentWithInfo.
const commentInclude = {
  author: {
    select: { id: true, name: true, email: true, role: true },
  },
} as const;

export async function addComment(
  issueId: string,
  input: CommentInput
): Promise<ActionResult<CommentWithInfo>> {
  const user = await requireUser();

  // Permission check — must be able to see the issue's project.
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    select: {
      project: {
        select: { ownerId: true, members: { select: { userId: true } } },
      },
    },
  });

  if (!issue || !canAccessProject(user, issue.project)) {
    return { ok: false, error: "You do not have access to this issue." };
  }

  const parsed = commentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        body: parsed.data.body,
        issueId,
        authorId: user.id,
      },
      include: commentInclude,
    });

    revalidatePath(`/issues/${issueId}`);

    return { ok: true, data: comment };
  } catch (err) {
    console.error("addComment failed:", err);
    return { ok: false, error: "Could not add comment. Please try again." };
  }
}

export async function deleteComment(
  commentId: string
): Promise<ActionResult<void>> {
  const user = await requireUser();

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    select: { authorId: true, issueId: true },
  });

  if (!comment) {
    return { ok: false, error: "Comment not found." };
  }

  if (!canDeleteComment(user, comment)) {
    return { ok: false, error: "You can only delete your own comments." };
  }

  try {
    await prisma.comment.delete({ where: { id: commentId } });

    revalidatePath(`/issues/${comment.issueId}`);

    return { ok: true, data: undefined };
  } catch (err: unknown) {
    // P2025 = record to delete does not exist — comment already gone.
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2025"
    ) {
      return { ok: false, error: "Comment not found." };
    }

    console.error("deleteComment failed:", err);
    return { ok: false, error: "Could not delete comment. Please try again." };
  }
}
