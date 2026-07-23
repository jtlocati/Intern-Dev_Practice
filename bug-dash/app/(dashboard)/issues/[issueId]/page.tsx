import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { isAdmin, canEditIssue } from "@/lib/permissions";
import { getIssueById } from "@/data/issues";
import { getIssueComments } from "@/data/comments";
import IssueHeader from "./issue-header";
import IssueDetails from "./issue-details";
import IssueComments from "./issue-comments";
import AddCommentForm from "./add-comment-form";

export default async function IssuePage({
  params,
}: {
  params: Promise<{ issueId: string }>;
}) {
  const user = await requireUser();
  const { issueId } = await params;

  const issue = await getIssueById(issueId, user);
  if (!issue) {
    notFound();
  }

  const comments = await getIssueComments(issueId);

  const canEdit = canEditIssue(user, { assignid: issue.assigneeId });
  const canDelete = isAdmin(user);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <IssueHeader issue={issue} canEdit={canEdit} canDelete={canDelete} />
      <IssueDetails issue={issue} />
      <IssueComments comments={comments} />
      <AddCommentForm issueId={issue.id} />
    </div>
  );
}
