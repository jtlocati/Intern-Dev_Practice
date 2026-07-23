'use client';

import { useState, useTransition } from "react";
import { deleteProjectAction } from "@/actions/project-actions";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/shared/confirm-dialog";

export default function ProjectDeleteButton({
  projectId,
}: {
  projectId: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await deleteProjectAction(projectId);
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
        title="Delete project?"
        description="This permanently removes the project and all of its issues and comments. This can't be undone."
        confirmLabel="Delete"
        loading={pending}
      />
    </>
  );
}
