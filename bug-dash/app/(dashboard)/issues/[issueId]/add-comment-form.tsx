'use client';

import { useActionState, useEffect, useRef } from "react";
import { createCommentAction } from "@/actions/comment-actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function AddCommentForm({ issueId }: { issueId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    createCommentAction,
    null,
  );

  // Clear the textarea after a successful post.
  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  const fieldError = state && !state.ok ? state.fieldErrors?.body?.[0] : undefined;
  const formError =
    state && !state.ok && !state.fieldErrors ? state.error : undefined;

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="issueId" value={issueId} />
      <Textarea
        name="body"
        rows={3}
        placeholder="Add a comment..."
        invalid={!!fieldError}
      />
      {fieldError && <p className="text-sm text-[var(--danger)]">{fieldError}</p>}
      {formError && <p className="text-sm text-[var(--danger)]">{formError}</p>}
      <div className="flex justify-end">
        <Button type="submit" size="sm" loading={pending}>
          {pending ? "Posting..." : "Comment"}
        </Button>
      </div>
    </form>
  );
}
