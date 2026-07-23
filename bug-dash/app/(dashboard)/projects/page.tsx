import Link from "next/link";
import { getProjectsForUser } from "@/data/projects";
import { getCurrentUser } from "@/lib/session";
import { canManageProjects } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { ProjectList } from "./project-list";

export default async function ProjectsPage() {
  const [projects, user] = await Promise.all([getProjectsForUser(), getCurrentUser()]);

  const canManage = !!user && canManageProjects(user);

  const newProjectAction = canManage ? (
    <Link href="/projects/new">
      <Button>New Project</Button>
    </Link>
  ) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description={
          canManage
            ? "Manage every project across the team."
            : "Projects you own or are a member of."
        }
        action={newProjectAction}
      />

      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description={
            canManage
              ? "Get started by creating your first project."
              : "You don't have access to any projects yet. Ask an admin to add you as a member."
          }
          action={newProjectAction}
        />
      ) : (
        <ProjectList projects={projects} />
      )}
    </div>
  );
}
