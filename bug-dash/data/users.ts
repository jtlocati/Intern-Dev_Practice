import { prisma } from "@/lib/prisma";
import type { UserSummary } from "@/types/user";

export type UserWithCounts = UserSummary & {
  _count: { assignedIssues: number; ownedProjects: number };
};

/** Lightweight user list (no password) for assignee pickers and lists. */
export async function getUsers(): Promise<UserSummary[]> {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });
}

/** Users with assigned-issue and owned-project counts — for the users table. */
export async function getUsersWithCounts(): Promise<UserWithCounts[]> {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      _count: { select: { assignedIssues: true, ownedProjects: true } },
    },
    orderBy: { name: "asc" },
  });
}
