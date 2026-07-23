import { prisma } from "@/lib/prisma";
import { projectAccessWhere, issueAccessOr } from "@/lib/access";
import type { IssueWithRelations } from "@/types/issue";
import type { IssueStatus, IssuePriority } from "@prisma/client";
import type { SessionUser } from "@/types";

export type DashboardData = {
  openIssues: number;
  completedThisWeek: number;
  projectCount: number;
  highUrgencyCount: number;
  statusCounts: Record<IssueStatus, number>;
  priorityCounts: Record<IssuePriority, number>;
  recentIssues: IssueWithRelations[];
};

const issueInclude = {
  project: { select: { id: true, name: true } },
  reporter: { select: { id: true, name: true, email: true, role: true } },
  assignee: { select: { id: true, name: true, email: true, role: true } },
  _count: { select: { comments: true } },
} as const;

export async function getDashboardStats(
  user: SessionUser,
): Promise<DashboardData> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  // Everything below is scoped to what this user is allowed to see.
  const scope = issueAccessOr(user) ?? {};
  const projectWhere = projectAccessWhere(user);

  const [
    openIssues,
    completedThisWeek,
    projectCount,
    highUrgencyCount,
    statusGroups,
    priorityGroups,
    recentIssues,
  ] = await Promise.all([
    prisma.issue.count({ where: { status: { not: "DONE" }, ...scope } }),
    prisma.issue.count({
      where: { status: "DONE", updatedAt: { gte: weekAgo }, ...scope },
    }),
    prisma.project.count({ where: projectWhere }),
    prisma.issue.count({
      where: {
        status: { not: "DONE" },
        priority: { in: ["HIGH", "CRITICAL"] },
        ...scope,
      },
    }),
    prisma.issue.groupBy({
      by: ["status"],
      _count: { _all: true },
      where: scope,
    }),
    prisma.issue.groupBy({
      by: ["priority"],
      _count: { _all: true },
      where: scope,
    }),
    prisma.issue.findMany({
      where: scope,
      include: issueInclude,
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const statusCounts: Record<IssueStatus, number> = {
    BACKLOG: 0,
    TODO: 0,
    IN_PROGRESS: 0,
    IN_REVIEW: 0,
    DONE: 0,
  };
  for (const g of statusGroups) statusCounts[g.status] = g._count._all;

  const priorityCounts: Record<IssuePriority, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
  };
  for (const g of priorityGroups) priorityCounts[g.priority] = g._count._all;

  return {
    openIssues,
    completedThisWeek,
    projectCount,
    highUrgencyCount,
    statusCounts,
    priorityCounts,
    recentIssues: recentIssues as IssueWithRelations[],
  };
}
