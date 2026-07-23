import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { IssueWithRelations } from "@/types/issue";

// A single label/value row in the meta grid.
function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--fg-subtle)]">
        {label}
      </dt>
      <dd className="text-sm text-[var(--fg)]">{value}</dd>
    </div>
  );
}

export default function IssueDetails({
  issue,
}: {
  issue: IssueWithRelations;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--fg)]">
          {issue.description}
        </p>

        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Meta label="Project" value={issue.project.name} />
          <Meta label="Reporter" value={issue.reporter.name} />
          <Meta
            label="Assignee"
            value={
              issue.assignee ? (
                issue.assignee.name
              ) : (
                <span className="italic text-[var(--fg-muted)]">Unassigned</span>
              )
            }
          />
          <Meta label="Created" value={formatDate(issue.createdAt)} />
          <Meta
            label="Due"
            value={
              issue.dueDate ? (
                formatDate(issue.dueDate)
              ) : (
                <span className="italic text-[var(--fg-muted)]">None</span>
              )
            }
          />
        </dl>
      </CardContent>
    </Card>
  );
}
