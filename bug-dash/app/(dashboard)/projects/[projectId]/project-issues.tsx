import Link from "next/link";
import IssueTable from "../../issues/issue-table";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import type { IssueWithRelations } from "@/types/issue";

export default function ProjectIssues({
  issues,
}: {
  issues: IssueWithRelations[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--fg)]">
          Issues ({issues.length})
        </h2>
        <Link href="/issues/new">
          <Button size="sm">New issue</Button>
        </Link>
      </div>
      {issues.length === 0 ? (
        <EmptyState
          title="No issues"
          description="This project has no issues yet."
        />
      ) : (
        <IssueTable issues={issues} />
      )}
    </div>
  );
}
