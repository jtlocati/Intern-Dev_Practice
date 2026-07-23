import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { ProjectWithRelations } from "@/types/project";

export default function ProjectCard({
  project,
}: {
  project: ProjectWithRelations;
}) {
  return (
    <Link href={`/projects/${project.id}`} className="block">
      <Card className="h-full transition-colors hover:border-[var(--border-strong)]">
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          <CardDescription className="line-clamp-2">
            {project.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4 text-sm text-[var(--fg-muted)]">
          <span>
            {project._count.issues} issue
            {project._count.issues === 1 ? "" : "s"}
          </span>
          <span>
            {project.members.length} member
            {project.members.length === 1 ? "" : "s"}
          </span>
          <span className="ml-auto truncate">Owner: {project.owner.name}</span>
        </CardContent>
      </Card>
    </Link>
  );
}
