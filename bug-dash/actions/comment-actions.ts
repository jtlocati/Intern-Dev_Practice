"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { commentSchema } from "@/schemas/comment-schema";
import { zodFieldErrors } from "@/lib/validations";
import type { ActionResult } from "@/types";

export async function createCommentAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();

  const issueId = String(formData.get("issueId") ?? "");
  if (!issueId) {
    return { ok: false, error: "Missing issue reference." };
  }

  const parsed = commentSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the errors below.",
      fieldErrors: zodFieldErrors(parsed.error),
    };
  }

  await prisma.comment.create({
    data: { body: parsed.data.body, issueId, authorId: user.id },
  });

  // Refresh the issue page so the new comment appears.
  revalidatePath(`/issues/${issueId}`);
  return { ok: true, data: undefined };
}
