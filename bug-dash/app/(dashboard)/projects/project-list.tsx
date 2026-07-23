import Link from "next/link";
import ProjectCard from "./project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { ProjectWithRelations } from "@/types/project";

export default function ProjectList({
  projects,
  canManage = false,
}: {
  projects: ProjectWithRelations[];
  canManage?: boolean;
}) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="No projects yet"
        description={
          canManage
            ? "Create your first project to start tracking issues."
            : "You're not a member of any projects yet."
        }
        action={
          canManage ? (
            <Link href="/projects/new">
              <Button>New project</Button>
            </Link>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
