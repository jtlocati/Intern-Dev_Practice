import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import type { CommentWithInfo } from "@/types/comment";

export default function IssueComments({
  comments,
}: {
  comments: CommentWithInfo[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments ({comments.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {comments.length === 0 ? (
          <p className="text-sm text-[var(--fg-muted)]">No comments yet.</p>
        ) : (
          <ul className="flex flex-col gap-5">
            {comments.map((comment) => (
              <li key={comment.id} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--surface-2)] text-xs font-semibold text-[var(--fg-muted)]">
                  {getInitials(comment.author.name)}
                </span>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--fg)]">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-[var(--fg-subtle)]">
                      {formatRelativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-[var(--fg)]">
                    {comment.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
