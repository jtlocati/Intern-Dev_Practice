import { isAdmin } from "@/lib/permissions";
import type { SessionUser } from "@/types";

/**
 * Prisma `where` fragment limiting projects to those a user may see.
 * Admins see everything ({}); developers see projects they own or belong to.
 */
export function projectAccessWhere(user: SessionUser) {
  if (isAdmin(user)) return {};
  return {
    OR: [
      { ownerId: user.id },
      { members: { some: { userId: user.id } } },
    ],
  };
}

/**
 * An OR clause limiting issues to those a user may see (or null for admins,
 * who see all). A developer sees issues in their projects, plus any issue they
 * reported or are assigned to. Spread into an `AND` array or object as needed.
 */
export function issueAccessOr(user: SessionUser) {
  if (isAdmin(user)) return null;
  return {
    OR: [
      {
        project: {
          OR: [
            { ownerId: user.id },
            { members: { some: { userId: user.id } } },
          ],
        },
      },
      { assigneeId: user.id },
      { reporterId: user.id },
    ],
  };
}
