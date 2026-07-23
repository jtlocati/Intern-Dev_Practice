'use client';

import { useState } from "react";
import { logoutAction } from "@/actions/auth-actions";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "@/types";

export default function UserMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-[var(--surface-2)]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-semibold text-[var(--primary-fg)]">
          {getInitials(user.name)}
        </span>
        <span className="text-sm font-medium text-[var(--fg)]">{user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-md">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium text-[var(--fg)]">{user.name}</p>
            <p className="truncate text-xs text-[var(--fg-muted)]">{user.email}</p>
          </div>
          {/* logoutAction is a server action, so a plain form action works from a client component */}
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="w-full justify-start"
            >
              Sign out
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
