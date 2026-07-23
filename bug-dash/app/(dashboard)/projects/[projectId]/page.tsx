import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { isAdmin } from "@/lib/permissions";
import { getProjectById } from "@/data/projects";
import { getIssues } from "@/data/issues";
import ProjectHeader from "./project-header";
import ProjectMembers from "./project-members";
import ProjectIssues from "./project-issues";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireUser();
  const { projectId } = await params;

  const project = await getProjectById(projectId, user);
  if (!project) {
    notFound();
  }

  const issues = await getIssues({ projectId }, user);

  return (
    <div className="flex flex-col gap-6">
      <ProjectHeader project={project} canManage={isAdmin(user)} />
      <ProjectMembers project={project} />
      <ProjectIssues issues={issues} />
    </div>
  );
}
