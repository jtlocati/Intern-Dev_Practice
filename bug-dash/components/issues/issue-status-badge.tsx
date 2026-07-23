import { Badge } from "@/components/ui/badge";
import { formatLabel } from "@/lib/utils";
import type { IssueStatus } from "@prisma/client";

// Each status maps to the CSS color variable defined in globals.css.
const STATUS_COLORS: Record<IssueStatus, string> = {
  BACKLOG: "var(--status-backlog)",
  TODO: "var(--status-todo)",
  IN_PROGRESS: "var(--status-inprogress)",
  IN_REVIEW: "var(--status-inreview)",
  DONE: "var(--status-done)",
};

export default function IssueStatusBadge({ status }: { status: IssueStatus }) {
  return (
    <Badge dot color={STATUS_COLORS[status]}>
      {formatLabel(status)}
    </Badge>
  );
}
