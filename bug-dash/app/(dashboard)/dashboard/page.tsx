import Link from "next/link";
import { requireUser } from "@/lib/session";
import { getDashboardStats } from "@/data/dashboard";
import DashboardCards from "./dashboard-cards";
import IssueTable from "../issues/issue-table";
import PageHeader from "@/components/layout/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ISSUE_STATUSES, ISSUE_PRIORITIES } from "@/lib/constants";
import { formatLabel } from "@/lib/utils";
import type { IssueStatus, IssuePriority } from "@prisma/client";

// Map each enum value to the CSS color variable defined in globals.css.
const STATUS_COLORS: Record<IssueStatus, string> = {
  BACKLOG: "var(--status-backlog)",
  TODO: "var(--status-todo)",
  IN_PROGRESS: "var(--status-inprogress)",
  IN_REVIEW: "var(--status-inreview)",
  DONE: "var(--status-done)",
};

const PRIORITY_COLORS: Record<IssuePriority, string> = {
  LOW: "var(--priority-low)",
  MEDIUM: "var(--priority-medium)",
  HIGH: "var(--priority-high)",
  CRITICAL: "var(--priority-critical)",
};

export default async function Dashboard() {
  const user = await requireUser();
  const data = await getDashboardStats(user);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Here's what's happening across your projects."
      />

      <DashboardCards
        openIssues={data.openIssues}
        completedThisWeek={data.completedThisWeek}
        highUrgencyCount={data.highUrgencyCount}
        projectCount={data.projectCount}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Issues by Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {ISSUE_STATUSES.map((status) => (
              <div key={status} className="flex items-center justify-between">
                <Badge dot color={STATUS_COLORS[status]}>
                  {formatLabel(status)}
                </Badge>
                <span className="text-sm font-medium text-[var(--fg-muted)]">
                  {data.statusCounts[status]}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issues by Priority</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {ISSUE_PRIORITIES.map((priority) => (
              <div key={priority} className="flex items-center justify-between">
                <Badge dot color={PRIORITY_COLORS[priority]}>
                  {formatLabel(priority)}
                </Badge>
                <span className="text-sm font-medium text-[var(--fg-muted)]">
                  {data.priorityCounts[priority]}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--fg)]">
            Recent Issues
          </h2>
          <Link href="/issues">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        </div>
        <IssueTable issues={data.recentIssues} />
      </div>
    </div>
  );
}
