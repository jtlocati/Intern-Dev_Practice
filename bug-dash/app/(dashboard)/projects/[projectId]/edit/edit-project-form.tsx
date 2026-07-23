'use client';

import ProjectForm from "@/components/projects/project-form";
import { updateProjectAction } from "@/actions/project-actions";
import type { ProjectWithRelations } from "@/types/project";
import type { UserSummary } from "@/types/user";

export default function EditProjectForm({
  project,
  users,
}: {
  project: ProjectWithRelations;
  users: UserSummary[];
}) {
  return (
    <ProjectForm
      action={updateProjectAction}
      users={users}
      project={project}
      submitLabel="Save changes"
    />
  );
}
