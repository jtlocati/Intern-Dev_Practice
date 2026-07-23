import Link from "next/link";
import { getIssues } from "@/data/issues";
import { requireUser } from "@/lib/session";
import IssueTable from "./issue-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import PageHeader from "@/components/layout/page-header";

export default async function Issues() {
  const user = await requireUser();
  const issues = await getIssues({}, user);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Issues"
        description={`${issues.length} issue${issues.length === 1 ? "" : "s"} across all projects`}
        action={
          <Link href="/issues/new">
            <Button>New issue</Button>
          </Link>
        }
      />

      {issues.length === 0 ? (
        <EmptyState
          title="No issues yet"
          description="Create your first issue to start tracking bugs."
          action={
            <Link href="/issues/new">
              <Button>New issue</Button>
            </Link>
          }
        />
      ) : (
        <IssueTable issues={issues} />
      )}
    </div>
  );
}
