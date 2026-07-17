//re-export all so imports stay short

export { Role, IssueStatus, IssuePriority } from "@prisma/client";

export * from "./user";
export * from "./project";
export * from "./issue";
export * from "./comment";
export * from "./auth";

export type ActionResult <T = void> = | {ok: true; data: T} | {ok: false; error: string; fieldErrors?: Record<string, string[]> };

export type DashStats  = {openIssues: number; completedperweek: number; ProjectCount: number; highUrgencyCount: number;};