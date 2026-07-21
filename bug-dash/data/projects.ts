// TODO: Implement projects.ts
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { isAdmin } from "@/lib/permissions";
import type { ProjectWithRelations } from "@/types";

// The exact shape we need on every project object.
// Defined once and reused so both functions return the same thing.
const projectInclude = {
  owner: {
    select: { id: true, name: true, email: true, role: true },
  },
  members: {
    include: {
      user: {
        select: { id: true, name: true, email: true, role: true },
      },
    },
  },
  _count: {
    select: { issues: true },
  },
} as const;

export async function getProjectsForUser(): Promise<ProjectWithRelations[]> {
  const user = await requireUser();

  // Admins see everything.
  if (isAdmin(user)) {
    return prisma.project.findMany({
      include: projectInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  // Developers see only projects they own or are a member of.
  return prisma.project.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id } } },
      ],
    },
    include: projectInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getProjectById(
  projectId: string
): Promise<ProjectWithRelations | null> {
  const user = await requireUser();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: projectInclude,
  });

  if (!project) {
    return null;
  }

  const canSee =
    isAdmin(user) ||
    project.ownerId === user.id ||
    project.members.some((m) => m.userId === user.id);

  if (canSee) {
    return project;
  }

  return null;
}