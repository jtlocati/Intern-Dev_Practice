'use client';

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ISSUE_STATUSES, ISSUE_PRIORITIES } from "@/lib/constants";
import { formatLabel } from "@/lib/utils";
import type { ActionResult } from "@/types";
import type { IssueWithRelations } from "@/types/issue";
import type { ProjectSummary } from "@/types/project";
import type { UserSummary } from "@/types/user";

type IssueAction = (
  prev: ActionResult | null,
  formData: FormData,
) => Promise<ActionResult>;

// A labelled field wrapper with an optional error message underneath.
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[var(--fg)]">{label}</label>
      {children}
      {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
    </div>
  );
}

export default function IssueForm({
  action,
  projects,
  users,
  issue,
  submitLabel = "Save",
}: {
  action: IssueAction;
  projects: ProjectSummary[];
  users: UserSummary[];
  issue?: IssueWithRelations;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  const errors = state && !state.ok ? state.fieldErrors : undefined;
  const formError =
    state && !state.ok && !state.fieldErrors ? state.error : undefined;

  // Prefill the date input (yyyy-mm-dd) when editing an issue with a due date.
  const dueDefault = issue?.dueDate
    ? new Date(issue.dueDate).toISOString().slice(0, 10)
    : "";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {/* When editing, carry the id so the update action knows what to change. */}
      {issue && <input type="hidden" name="id" value={issue.id} />}

      <Field label="Title" error={errors?.title?.[0]}>
        <Input
          name="title"
          defaultValue={issue?.title}
          invalid={!!errors?.title}
          placeholder="Short summary of the bug"
        />
      </Field>

      <Field label="Description" error={errors?.description?.[0]}>
        <Textarea
          name="description"
          rows={5}
          defaultValue={issue?.description}
          invalid={!!errors?.description}
          placeholder="Steps to reproduce, expected vs actual behavior…"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Project" error={errors?.projectId?.[0]}>
          <Select
            name="projectId"
            defaultValue={issue?.projectId ?? ""}
            invalid={!!errors?.projectId}
          >
            <option value="" disabled>
              Select a project
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Assignee">
          <Select name="assigneeId" defaultValue={issue?.assigneeId ?? ""}>
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Status">
          <Select name="status" defaultValue={issue?.status ?? "BACKLOG"}>
            {ISSUE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {formatLabel(s)}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Priority">
          <Select name="priority" defaultValue={issue?.priority ?? "MEDIUM"}>
            {ISSUE_PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {formatLabel(p)}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Due date">
          <Input type="date" name="dueDate" defaultValue={dueDefault} />
        </Field>
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
