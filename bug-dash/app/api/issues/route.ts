import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIssuesForUser } from "@/data/issues";
import { createIssue } from "@/actions/issue-actions";
import type { IssueInput } from "@/schemas/issue-schema";
import type { IssueFilters } from "@/types";
import type { IssueStatus, IssuePriority } from "@prisma/client";

// GET /api/issues — list issues the current user can access, filtered + paginated.
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const assigneeId = searchParams.get("assigneeId");
    const projectId = searchParams.get("projectId");
    const search = searchParams.get("search");
    const page = searchParams.get("page");

    const filters: IssueFilters = {
      status: status ? (status as IssueStatus) : undefined,
      priority: priority ? (priority as IssuePriority) : undefined,
      assigneeId: assigneeId ?? undefined,
      projectId: projectId ?? undefined,
      search: search ?? undefined,
      page: page ? Number(page) : undefined,
    };

    const result = await getIssuesForUser(filters);
    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /api/issues failed:", err);
    return NextResponse.json(
      { error: "Could not load issues." },
      { status: 500 }
    );
  }
}

// POST /api/issues — create an issue (project access enforced in the action).
export async function POST(request: NextRequest) {
  const body = (await request.json()) as IssueInput;
  const result = await createIssue(body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, fieldErrors: result.fieldErrors },
      { status: result.fieldErrors ? 400 : 403 }
    );
  }

  return NextResponse.json(result.data, { status: 201 });
}
