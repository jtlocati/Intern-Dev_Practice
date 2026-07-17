// TODO: Implement issue.ts

//make issue-related info easy to reach

import type { Issue, IssueStatus, IssuePriority } from "@prisma/client";
import type { UserSummary } from "./user";
import type { ProjectSummary } from "./project";

export type { Issue };

export type IssueWithRelations = Issue & {project: ProjectSummary; reporter: UserSummary; assignee: UserSummary | null; _count: { comments: number };};

export type IssueFilters = {
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: string;
  projectId?: string;
  search?: string;
  page?: number;
    
}