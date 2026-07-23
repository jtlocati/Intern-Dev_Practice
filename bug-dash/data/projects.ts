import { prisma } from "@/lib/prisma";
import { projectAccessWhere } from "@/lib/access";
import type { ProjectSummary, ProjectWithRelations } from "@/types/project";
import type { SessionUser } from "@/types";

const projectInclude = {
  owner: { select: { id: true, name: true, email: true, role: true } },
  members: {
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  },
  _count: { select: { issues: true } },
} as const;

/** Lightweight project list (id + name) the user can access. */
export async function getProjects(user: SessionUser): Promise<ProjectSummary[]> {
  return prisma.project.findMany({
    where: projectAccessWhere(user),
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

/** Accessible projects with owner, members, and issue count. */
export async function getProjectsWithStats(
  user: SessionUser,
): Promise<ProjectWithRelations[]> {
  const projects = await prisma.project.findMany({
    where: projectAccessWhere(user),
    include: projectInclude,
    orderBy: { name: "asc" },
  });
  return projects as ProjectWithRelations[];
}

/** A single project with relations, or null if not found or not accessible. */
export async function getProjectById(
  id: string,
  user: SessionUser,
): Promise<ProjectWithRelations | null> {
  const project = await prisma.project.findFirst({
    where: { id, ...projectAccessWhere(user) },
    include: projectInclude,
  });
  return project as ProjectWithRelations | null;
}
