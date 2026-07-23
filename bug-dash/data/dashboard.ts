import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { isAdmin } from "@/lib/permissions";
import type { DashStats } from "@/types";

export async function getDashboardStats(): Promise<DashStats> {
  const user = await requireUser();
  const admin = isAdmin(user);

  // Developers only see stats for projects they own or are a member of.
  // Resolve the accessible project ids up front (same OR filter as
  // getProjectsForUser in data/projects.ts) and reuse it for every issue query.
  let projectIdFilter: { in: string[] } | undefined;
  if (!admin) {
    const accessibleProjects = await prisma.project.findMany({
      where: {
        OR: [{ ownerId: user.id }, { members: { some: { userId: user.id } } }],
      },
      select: { id: true },
    });
    projectIdFilter = { in: accessibleProjects.map((p) => p.id) };
  }

  // "Completed this week" is a rolling 7-day window (now - 7 days) rather than
  // a calendar week (e.g. Monday 00:00) — simpler to reason about, avoids
  // timezone edge cases, and stays consistent no matter what day it is "today."
  const startOfWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [openIssues, completedperweek, ProjectCount, highUrgencyCount] =
    await Promise.all([
      prisma.issue.count({
        where: {
          status: { not: "DONE" },
          ...(projectIdFilter ? { projectId: projectIdFilter } : {}),
        },
      }),
      prisma.issue.count({
        where: {
          status: "DONE",
          updatedAt: { gte: startOfWeek },
          ...(projectIdFilter ? { projectId: projectIdFilter } : {}),
        },
      }),
      admin
        ? prisma.project.count()
        : prisma.project.count({
            where: {
              OR: [
                { ownerId: user.id },
                { members: { some: { userId: user.id } } },
              ],
            },
          }),
      prisma.issue.count({
        where: {
          priority: "CRITICAL",
          status: { not: "DONE" },
          ...(projectIdFilter ? { projectId: projectIdFilter } : {}),
        },
      }),
    ]);

  return { openIssues, completedperweek, ProjectCount, highUrgencyCount };
}
