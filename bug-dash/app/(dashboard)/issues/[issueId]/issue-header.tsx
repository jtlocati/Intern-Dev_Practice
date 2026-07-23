import Link from "next/link";
import IssueStatusBadge from "@/components/issues/issue-status-badge";
import IssuePriorityBadge from "@/components/issues/issue-priority-badge";
import IssueDeleteButton from "@/components/issues/issue-delete-button";
import { Button } from "@/components/ui/button";
import type { IssueWithRelations } from "@/types/issue";

export default function IssueHeader({
  issue,
  canEdit = false,
  canDelete = false,
}: {
  issue: IssueWithRelations;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/issues"
        className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]"
      >
        ← Back to issues
      </Link>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[var(--fg)]">
          {issue.title}
        </h1>
        <div className="flex shrink-0 items-center gap-2">
          {canEdit && (
            <Link href={`/issues/${issue.id}/edit`}>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </Link>
          )}
          {canDelete && <IssueDeleteButton issueId={issue.id} />}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <IssueStatusBadge status={issue.status} />
        <IssuePriorityBadge priority={issue.priority} />
      </div>
    </div>
  );
}
