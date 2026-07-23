import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import ProjectMembersList from "@/components/projects/project-members-list";
import type { ProjectWithRelations } from "@/types/project";

export default function ProjectMembers({
  project,
}: {
  project: ProjectWithRelations;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team</CardTitle>
      </CardHeader>
      <CardContent>
        <ProjectMembersList
          owner={project.owner}
          members={project.members.map((m) => m.user)}
        />
      </CardContent>
    </Card>
  );
}
