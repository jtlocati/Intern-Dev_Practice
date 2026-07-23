'use client';

import { useState, useTransition } from "react";
import { deleteIssueAction } from "@/actions/issue-actions";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/confirm-dialog";

export default function IssueDeleteButton({ issueId }: { issueId: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await deleteIssueAction(issueId);
    });
  }

  return (
    <>
      <Button variant="danger" size="sm" onClick={() => setOpen(true)}>
        Delete
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title="Delete issue?"
        description="This permanently removes the issue and its comments. This can't be undone."
        confirmLabel="Delete"
        loading={pending}
      />
    </>
  );
}
