import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { deleteComment } from "@/actions/comment-actions";

type RouteParams = { params: Promise<{ commentId: string }> };

// DELETE /api/comments/[commentId] — delete a comment (admin or author, enforced in the action).
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { commentId } = await params;
  const result = await deleteComment(commentId);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
