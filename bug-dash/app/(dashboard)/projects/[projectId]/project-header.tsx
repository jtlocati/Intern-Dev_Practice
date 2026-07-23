import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProjectDeleteButton from "@/components/projects/project-delete-button";
import type { ProjectWithRelations } from "@/types/project";

export default function ProjectHeader({
  project,
  canManage = false,
}: {
  project: ProjectWithRelations;
  canManage?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/projects"
        className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]"
      >
        ← Back to projects
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--fg)]">
            {project.name}
          </h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            {project.description}
          </p>
        </div>
        {canManage && (
          <div className="flex shrink-0 items-center gap-2">
            <Link href={`/projects/${project.id}/edit`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
            <ProjectDeleteButton projectId={project.id} />
          </div>
        )}
      </div>
    </div>
  );
}
