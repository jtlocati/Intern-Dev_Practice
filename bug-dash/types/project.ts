// TODO: Implement project.ts


import type { Project, ProjectMember } from "@prisma/client";
import type { UserSummary } from "./user";

//ensures that the project-related info passed to frontend is easaly acessable

export type { Project }

export type ProjectWithRelations = Project & {owner: UserSummary, members: (ProjectMember & {user: UserSummary})[]; _count: {issues: number}}

export type ProjectSummary = Pick<Project, "id"|"name">;

