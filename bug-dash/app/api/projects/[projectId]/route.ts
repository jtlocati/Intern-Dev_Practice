import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getProjectById } from "@/data/projects";
import { updateProject, deleteProject } from "@/actions/project-actions";
import type { ProjectInput } from "@/schemas/project-schema";

type RouteParams = { params: Promise<{ projectId: string }> };

// GET /api/projects/[projectId] — a single project, scoped to what the user can see.
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { projectId } = await params;
  const project = await getProjectById(projectId);

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  return NextResponse.json(project);
}

// PATCH /api/projects/[projectId] — update a project (admin only, enforced in the action).
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { projectId } = await params;
  const body = (await request.json()) as ProjectInput;
  const result = await updateProject(projectId, body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, fieldErrors: result.fieldErrors },
      { status: result.fieldErrors ? 400 : 403 }
    );
  }

  return NextResponse.json(result.data);
}

// DELETE /api/projects/[projectId] — delete a project (admin only, enforced in the action).
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { projectId } = await params;
  const result = await deleteProject(projectId);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
