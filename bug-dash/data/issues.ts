import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { isAdmin, canAccessProject } from "@/lib/permissions";
import type { IssueFilters, IssueWithRelations } from "@/types";
import type { Prisma } from "@prisma/client";

// The exact shape we need on every issue object.
// Defined once and reused so both functions return the same thing.
const issueInclude = {
  project: {
    select: { id: true, name: true },
  },
  reporter: {
    select: { id: true, name: true, email: true, role: true },
  },
  assignee: {
    select: { id: true, name: true, email: true, role: true },
  },
  _count: {
    select: { comments: true },
  },
} as const;

const PAGE_SIZE = 10;

export async function getIssuesForUser(
  filters: IssueFilters
): Promise<{ issues: IssueWithRelations[]; total: number }> {
  const user = await requireUser();

  // Admins see every issue. Developers only see issues that live in
  // projects they own or are a member of — same access rule as
  // canAccessProject, but expressed as a query filter since we're scoping
  // a list rather than checking one already-fetched object.
  const accessWhere: Prisma.IssueWhereInput = isAdmin(user)
    ? {}
    : {
        project: {
          OR: [
            { ownerId: user.id },
            { members: { some: { userId: user.id } } },
          ],
        },
      };

  // Exact-match filters, only applied when present. `search` is a
  // case-insensitive contains across title/description — MySQL's default
  // collation is already case-insensitive, so we don't (and can't) pass
  // `mode: "insensitive"` like the Postgres provider would use.
  const where: Prisma.IssueWhereInput = {
    ...accessWhere,
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.priority ? { priority: filters.priority } : {}),
    ...(filters.assigneeId ? { assigneeId: filters.assigneeId } : {}),
    ...(filters.projectId ? { projectId: filters.projectId } : {}),
    ...(filters.search
      ? {
          OR: [
            { title: { contains: filters.search } },
            { description: { contains: filters.search } },
          ],
        }
      : {}),
  };

  const page = filters.page && filters.page > 0 ? Math.floor(filters.page) : 1;

  const [issues, total] = await Promise.all([
    prisma.issue.findMany({
      where,
      include: issueInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.issue.count({ where }),
  ]);

  return { issues, total };
}

export async function getIssueById(
  issueId: string
): Promise<IssueWithRelations | null> {
  const user = await requireUser();

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      ...issueInclude,
      // Extend the project select with what canAccessProject needs to make
      // its call. The extra ownerId/members fields don't violate the
      // IssueWithRelations return type — that type only requires project to
      // have id/name, not that it be exactly that shape.
      project: {
        select: {
          id: true,
          name: true,
          ownerId: true,
          members: { select: { userId: true } },
        },
      },
    },
  });

  if (!issue) {
    return null;
  }

  if (!canAccessProject(user, issue.project)) {
    return null;
  }

  return issue;
}
