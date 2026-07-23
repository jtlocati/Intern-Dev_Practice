import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { canAccessProject } from "@/lib/permissions";
import type { CommentWithInfo } from "@/types";

// The exact shape we need on every comment object.
const commentInclude = {
  author: {
    select: { id: true, name: true, email: true, role: true },
  },
} as const;

export async function getCommentsForIssue(
  issueId: string
): Promise<CommentWithInfo[]> {
  const user = await requireUser();

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    select: {
      project: {
        select: { ownerId: true, members: { select: { userId: true } } },
      },
    },
  });

  // Deliberate: return an empty list instead of throwing when the issue
  // doesn't exist or the user can't see its project. This is a read used to
  // hydrate a comments panel under an issue page — the issue-access check
  // already happened (or will happen) at the issue level, so there's no
  // separate error state worth surfacing here.
  if (!issue || !canAccessProject(user, issue.project)) {
    return [];
  }

  return prisma.comment.findMany({
    where: { issueId },
    orderBy: { createdAt: "asc" },
    include: commentInclude,
  });
}
