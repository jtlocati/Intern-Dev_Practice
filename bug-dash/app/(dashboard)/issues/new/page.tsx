import { requireUser } from "@/lib/session";
import { getProjects } from "@/data/projects";
import { getUsers } from "@/data/users";
import NewIssueForm from "./new-issue-form";
import PageHeader from "@/components/layout/page-header";

export default async function NewIssuePage() {
  const user = await requireUser();
  const [projects, users] = await Promise.all([getProjects(user), getUsers()]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <PageHeader title="New issue" backHref="/issues" backLabel="Back to issues" />
      <NewIssueForm projects={projects} users={users} />
    </div>
  );
}
