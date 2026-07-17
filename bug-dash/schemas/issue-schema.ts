import { z } from "zod";
import { ISSUE_PRIORITIES, ISSUE_STATUSES } from "@/lib/constants";

export const issueSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  description: z.string().min(1, "Description is required.").max(5000),
  status: z.enum(ISSUE_STATUSES).default("BACKLOG"),
  priority: z.enum(ISSUE_PRIORITIES).default("MEDIUM"),
  projectId: z.string().min(1, "Project is required."),
  assigneeId: z.string().nullable().optional(),
  dueDate: z.coerce.date().nullable().optional(),
});

export type IssueInput = z.infer<typeof issueSchema>
