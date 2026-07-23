import { prisma } from "@/lib/prisma";
import type { CommentWithInfo } from "@/types/comment";

/** Fetch all comments for an issue, oldest first, with their author. */
export async function getIssueComments(
  issueId: string,
): Promise<CommentWithInfo[]> {
  const comments = await prisma.comment.findMany({
    where: { issueId },
    include: {
      author: { select: { id: true, name: true, email: true, role: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return comments as CommentWithInfo[];
}
