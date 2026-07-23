'use client';

import IssueForm from "@/components/issues/issue-form";
import { createIssueAction } from "@/actions/issue-actions";
import type { ProjectSummary } from "@/types/project";
import type { UserSummary } from "@/types/user";

export default function NewIssueForm({
  projects,
  users,
}: {
  projects: ProjectSummary[];
  users: UserSummary[];
}) {
  return (
    <IssueForm
      action={createIssueAction}
      projects={projects}
      users={users}
      submitLabel="Create issue"
    />
  );
}
