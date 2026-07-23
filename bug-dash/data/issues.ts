import { prisma } from "@/lib/prisma";
import { issueAccessOr } from "@/lib/access";
import type { IssueFilters, IssueWithRelations } from "@/types/issue";
import type { SessionUser } from "@/types";

// Shared "include" so every issue query returns the same shaped relations.
const issueInclude = {
  project: { select: { id: true, name: true } },
  reporter: { select: { id: true, name: true, email: true, role: true } },
  assignee: { select: { id: true, name: true, email: true, role: true } },
  _count: { select: { comments: true } },
} as const;

/**
 * Fetch issues the user can access, newest first, with relations.
 * Optional filters narrow by status, priority, project, assignee, or search.
 */
export async function getIssues(
  filters: IssueFilters = {},
  user: SessionUser,
): Promise<IssueWithRelations[]> {
  const { status, priority, assigneeId, projectId, search } = filters;
  const scope = issueAccessOr(user);

  const issues = await prisma.issue.findMany({
    where: {
      status,
      priority,
      assigneeId,
      projectId,
      AND: [
        ...(search
          ? [
              {
                OR: [
                  { title: { contains: search } },
                  { description: { contains: search } },
                ],
              },
            ]
          : []),
        ...(scope ? [scope] : []),
      ],
    },
    include: issueInclude,
    orderBy: { createdAt: "desc" },
  });

  return issues as IssueWithRelations[];
}

/** Fetch a single accessible issue with relations, or null. */
export async function getIssueById(
  id: string,
  user: SessionUser,
): Promise<IssueWithRelations | null> {
  const scope = issueAccessOr(user);
  const issue = await prisma.issue.findFirst({
    where: scope ? { id, AND: [scope] } : { id },
    include: issueInclude,
  });

  return issue as IssueWithRelations | null;
}
