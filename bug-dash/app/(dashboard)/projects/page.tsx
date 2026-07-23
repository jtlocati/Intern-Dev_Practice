import Link from "next/link";
import { requireUser } from "@/lib/session";
import { isAdmin } from "@/lib/permissions";
import { getProjectsWithStats } from "@/data/projects";
import ProjectList from "./project-list";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export default async function Projects() {
  const user = await requireUser();
  const projects = await getProjectsWithStats(user);
  const canManage = isAdmin(user);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Projects"
        description={`${projects.length} project${projects.length === 1 ? "" : "s"}`}
        action={
          canManage ? (
            <Link href="/projects/new">
              <Button>New project</Button>
            </Link>
          ) : undefined
        }
      />
      <ProjectList projects={projects} canManage={canManage} />
    </div>
  );
}
