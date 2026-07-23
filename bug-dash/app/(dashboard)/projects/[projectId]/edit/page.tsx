import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getProjectById } from "@/data/projects";
import { getUserSummaries } from "@/data/users";
import { PageHeader } from "@/components/layout/page-header";
import { EditProjectForm } from "./edit-project-form";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  await requireAdmin();
  const { projectId } = await params;

  const [project, users] = await Promise.all([getProjectById(projectId), getUserSummaries()]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Project" description="Update project details and membership." />
      <EditProjectForm project={project} users={users} />
    </div>
  );
}
