'use client';

import ProjectForm from "@/components/projects/project-form";
import { createProjectAction } from "@/actions/project-actions";
import type { UserSummary } from "@/types/user";

export default function NewProjectForm({ users }: { users: UserSummary[] }) {
  return (
    <ProjectForm
      action={createProjectAction}
      users={users}
      submitLabel="Create project"
    />
  );
}
