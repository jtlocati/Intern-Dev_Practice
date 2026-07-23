'use client';

import IssueForm from "@/components/issues/issue-form";
import { updateIssueAction } from "@/actions/issue-actions";
import type { IssueWithRelations } from "@/types/issue";
import type { ProjectSummary } from "@/types/project";
import type { UserSummary } from "@/types/user";

export default function EditIssueForm({
  issue,
  projects,
  users,
}: {
  issue: IssueWithRelations;
  projects: ProjectSummary[];
  users: UserSummary[];
}) {
  return (
    <IssueForm
      action={updateIssueAction}
      projects={projects}
      users={users}
      issue={issue}
      submitLabel="Save changes"
    />
  );
}
