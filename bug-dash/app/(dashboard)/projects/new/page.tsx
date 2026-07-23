import { requireAdmin } from "@/lib/session";
import { getUserSummaries } from "@/data/users";
import { PageHeader } from "@/components/layout/page-header";
import { NewProjectForm } from "./new-project-form";

export default async function NewProjectPage() {
  await requireAdmin();
  const users = await getUserSummaries();

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Project"
        description="Create a new project and choose its initial members."
      />
      <NewProjectForm users={users} />
    </div>
  );
}
