import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { getProjectById } from "@/data/projects";
import { getUsers } from "@/data/users";
import EditProjectForm from "./edit-project-form";
import PageHeader from "@/components/layout/page-header";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireAdmin();
  const { projectId } = await params;

  const [project, users] = await Promise.all([
    getProjectById(projectId, user),
    getUsers(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <PageHeader
        title="Edit project"
        backHref={`/projects/${project.id}`}
        backLabel="Back to project"
      />
      <EditProjectForm project={project} users={users} />
    </div>
  );
}
