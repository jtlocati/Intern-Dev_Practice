import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { canEditIssue } from "@/lib/permissions";
import { getIssueById } from "@/data/issues";
import { getProjects } from "@/data/projects";
import { getUsers } from "@/data/users";
import EditIssueForm from "./edit-issue-form";
import PageHeader from "@/components/layout/page-header";

export default async function EditIssuePage({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  const user = await requireUser();
  const { issueId } = await params;

  const [issue, projects, users] = await Promise.all([
    getIssueById(issueId, user),
    getProjects(user),
    getUsers(),
  ]);

  if (!issue) {
    notFound();
  }

  // Developers may only edit issues assigned to them.
  if (!canEditIssue(user, { assignid: issue.assigneeId })) {
    redirect(`/issues/${issue.id}`);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <PageHeader
        title="Edit issue"
        backHref={`/issues/${issue.id}`}
        backLabel="Back to issue"
      />
      <EditIssueForm issue={issue} projects={projects} users={users} />
    </div>
  );
}
