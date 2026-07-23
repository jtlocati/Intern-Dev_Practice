import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/session";
import type { SafeUser, UserSummary } from "@/types";

// Admin-only: full user records (minus password) for the user management page.
export async function getAllUsers(): Promise<SafeUser[]> {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  // Never return the password hash to any caller.
  return users.map(({ password, ...safeUser }) => safeUser);
}

// Lighter-weight, no admin gating — used for things like assignee-select
// dropdowns where any signed-in user needs the list of users.
export async function getUserSummaries(): Promise<UserSummary[]> {
  await requireUser();

  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
    orderBy: { name: "asc" },
  });
}
