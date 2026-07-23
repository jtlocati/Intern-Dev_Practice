import { Card, CardHeader, CardDescription } from "@/components/ui/card";

export default function DashboardCards({
  openIssues,
  completedThisWeek,
  highUrgencyCount,
  projectCount,
}: {
  openIssues: number;
  completedThisWeek: number;
  highUrgencyCount: number;
  projectCount: number;
}) {
  const stats = [
    { label: "Open Issues", value: openIssues },
    { label: "Completed This Week", value: completedThisWeek },
    { label: "High Urgency", value: highUrgencyCount },
    { label: "Projects", value: projectCount },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader>
            <CardDescription>{stat.label}</CardDescription>
            <p className="text-3xl font-semibold text-[var(--fg)]">
              {stat.value}
            </p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
