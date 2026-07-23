import { getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { UserSummary } from "@/types/user";

function Person({ user, isOwner }: { user: UserSummary; isOwner?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-2)] text-xs font-semibold text-[var(--fg-muted)]">
        {getInitials(user.name)}
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-[var(--fg)]">{user.name}</span>
        <span className="text-xs text-[var(--fg-muted)]">{user.email}</span>
      </div>
      {isOwner && (
        <Badge tone="primary" className="ml-auto">
          Owner
        </Badge>
      )}
    </li>
  );
}

export default function ProjectMembersList({
  owner,
  members,
}: {
  owner: UserSummary;
  members: UserSummary[];
}) {
  // Owner is shown first with a badge; don't list them twice.
  const others = members.filter((m) => m.id !== owner.id);

  return (
    <ul className="flex flex-col gap-4">
      <Person user={owner} isOwner />
      {others.map((m) => (
        <Person key={m.id} user={m} />
      ))}
      {others.length === 0 && (
        <li className="text-sm text-[var(--fg-muted)]">No additional members.</li>
      )}
    </ul>
  );
}
