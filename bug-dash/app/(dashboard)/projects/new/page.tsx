import { requireAdmin } from "@/lib/session";
import { getUsers } from "@/data/users";
import NewProjectForm from "./new-project-form";
import PageHeader from "@/components/layout/page-header";

export default async function NewProjectPage() {
  await requireAdmin();
  const users = await getUsers();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <PageHeader
        title="New project"
        backHref="/projects"
        backLabel="Back to projects"
      />
      <NewProjectForm users={users} />
    </div>
  );
}
