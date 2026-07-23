import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIssueById } from "@/data/issues";
import { updateIssue, deleteIssue } from "@/actions/issue-actions";
import type { IssueInput } from "@/schemas/issue-schema";

type RouteParams = { params: Promise<{ issueId: string }> };

// GET /api/issues/[issueId] — a single issue, scoped to what the user can see.
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { issueId } = await params;
  const issue = await getIssueById(issueId);

  if (!issue) {
    return NextResponse.json({ error: "Issue not found." }, { status: 404 });
  }

  return NextResponse.json(issue);
}

// PATCH /api/issues/[issueId] — update an issue (gated by canEditIssue in the action).
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { issueId } = await params;
  const body = (await request.json()) as IssueInput;
  const result = await updateIssue(issueId, body);

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, fieldErrors: result.fieldErrors },
      { status: result.fieldErrors ? 400 : 403 }
    );
  }

  return NextResponse.json(result.data);
}

// DELETE /api/issues/[issueId] — delete an issue (admin only, enforced in the action).
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { issueId } = await params;
  const result = await deleteIssue(issueId);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
