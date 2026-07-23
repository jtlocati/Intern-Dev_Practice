import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getProjectsForUser } from "@/data/projects";
import { createProject } from "@/actions/project-actions";
import type { ProjectInput } from "@/schemas/project-schema";

// GET /api/projects — list projects the current user can access.
export async function GET() {
  try {
    const projects = await getProjectsForUser();
    return NextResponse.json(projects);
  } catch (err) {
    console.error("GET /api/projects failed:", err);
    return NextResponse.json(
      { error: "Could not load projects." },
      { status: 500 }
    );
  }
}

// POST /api/projects — create a project (admin only, enforced in the action).
export async function POST(request: NextRequest) {
  const body = (await request.json()) as ProjectInput;
  const result = await createProject(body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, fieldErrors: result.fieldErrors },
      { status: result.fieldErrors ? 400 : 403 }
    );
  }

  return NextResponse.json(result.data, { status: 201 });
}
