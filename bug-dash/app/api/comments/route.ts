import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCommentsForIssue } from "@/data/comments";
import { addComment } from "@/actions/comment-actions";

// GET /api/comments?issueId=... — list comments for an issue, scoped by project access.
export async function GET(request: NextRequest) {
  const issueId = request.nextUrl.searchParams.get("issueId");

  if (!issueId) {
    return NextResponse.json(
      { error: "issueId is required." },
      { status: 400 }
    );
  }

  try {
    const comments = await getCommentsForIssue(issueId);
    return NextResponse.json(comments);
  } catch (err) {
    console.error("GET /api/comments failed:", err);
    return NextResponse.json(
      { error: "Could not load comments." },
      { status: 500 }
    );
  }
}

// POST /api/comments — add a comment to an issue (project access enforced in the action).
export async function POST(request: NextRequest) {
  const { issueId, body } = (await request.json()) as {
    issueId: string;
    body: string;
  };
  const result = await addComment(issueId, { body });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, fieldErrors: result.fieldErrors },
      { status: result.fieldErrors ? 400 : 403 }
    );
  }

  return NextResponse.json(result.data, { status: 201 });
}
