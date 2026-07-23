import { Badge } from "@/components/ui/badge";
import { formatLabel } from "@/lib/utils";
import type { IssuePriority } from "@prisma/client";

// Each priority maps to the CSS color variable defined in globals.css.
const PRIORITY_COLORS: Record<IssuePriority, string> = {
  LOW: "var(--priority-low)",
  MEDIUM: "var(--priority-medium)",
  HIGH: "var(--priority-high)",
  CRITICAL: "var(--priority-critical)",
};

export default function IssuePriorityBadge({
  priority,
}: {
  priority: IssuePriority;
}) {
  return (
    <Badge dot color={PRIORITY_COLORS[priority]}>
      {formatLabel(priority)}
    </Badge>
  );
}
