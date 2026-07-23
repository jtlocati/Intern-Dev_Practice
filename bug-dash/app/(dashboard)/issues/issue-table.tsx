import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import IssueStatusBadge from "@/components/issues/issue-status-badge";
import IssuePriorityBadge from "@/components/issues/issue-priority-badge";
import type { IssueWithRelations } from "@/types/issue";

export default function IssueTable({
  issues,
}: {
  issues: IssueWithRelations[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Project</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead className="text-right">Comments</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id}>
            <TableCell>
              <Link
                href={`/issues/${issue.id}`}
                className="font-medium text-[var(--fg)] hover:text-[var(--primary)]"
              >
                {issue.title}
              </Link>
            </TableCell>
            <TableCell>
              <IssueStatusBadge status={issue.status} />
            </TableCell>
            <TableCell>
              <IssuePriorityBadge priority={issue.priority} />
            </TableCell>
            <TableCell className="text-[var(--fg-muted)]">
              {issue.project.name}
            </TableCell>
            <TableCell className="text-[var(--fg-muted)]">
              {issue.assignee ? (
                issue.assignee.name
              ) : (
                <span className="italic text-[var(--fg-subtle)]">Unassigned</span>
              )}
            </TableCell>
            <TableCell className="text-right text-[var(--fg-muted)]">
              {issue._count.comments}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
