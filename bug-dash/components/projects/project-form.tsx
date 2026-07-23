'use client';

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/types";
import type { ProjectWithRelations } from "@/types/project";
import type { UserSummary } from "@/types/user";

type ProjectAction = (
  prev: ActionResult | null,
  formData: FormData,
) => Promise<ActionResult>;

export default function ProjectForm({
  action,
  users,
  project,
  submitLabel = "Save",
}: {
  action: ProjectAction;
  users: UserSummary[];
  project?: ProjectWithRelations;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  const errors = state && !state.ok ? state.fieldErrors : undefined;
  const formError =
    state && !state.ok && !state.fieldErrors ? state.error : undefined;

  const memberIds = new Set(project?.members.map((m) => m.userId) ?? []);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--fg)]">Name</label>
        <Input
          name="name"
          defaultValue={project?.name}
          invalid={!!errors?.name}
          placeholder="Project name"
        />
        {errors?.name?.[0] && (
          <p className="text-sm text-[var(--danger)]">{errors.name[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--fg)]">
          Description
        </label>
        <Textarea
          name="description"
          rows={4}
          defaultValue={project?.description}
          invalid={!!errors?.description}
          placeholder="What is this project about?"
        />
        {errors?.description?.[0] && (
          <p className="text-sm text-[var(--danger)]">{errors.description[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[var(--fg)]">Members</label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {users.map((u) => (
            <label
              key={u.id}
              className="flex items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] px-3 py-2 text-sm hover:border-[var(--border-strong)]"
            >
              <input
                type="checkbox"
                name="memberids"
                value={u.id}
                defaultChecked={memberIds.has(u.id)}
              />
              <span className="text-[var(--fg)]">{u.name}</span>
            </label>
          ))}
        </div>
      </div>

      {formError && <p className="text-sm text-[var(--danger)]">{formError}</p>}

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
