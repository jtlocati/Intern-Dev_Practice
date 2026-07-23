import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getInitials, formatLabel } from "@/lib/utils";
import type { UserWithCounts } from "@/data/users";

export default function UsersTable({ users }: { users: UserWithCounts[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Assigned</TableHead>
          <TableHead className="text-right">Projects owned</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-2)] text-xs font-semibold text-[var(--fg-muted)]">
                  {getInitials(user.name)}
                </span>
                <span className="font-medium text-[var(--fg)]">
                  {user.name}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-[var(--fg-muted)]">
              {user.email}
            </TableCell>
            <TableCell>
              <Badge tone={user.role === "ADMIN" ? "primary" : "neutral"}>
                {formatLabel(user.role)}
              </Badge>
            </TableCell>
            <TableCell className="text-right text-[var(--fg-muted)]">
              {user._count.assignedIssues}
            </TableCell>
            <TableCell className="text-right text-[var(--fg-muted)]">
              {user._count.ownedProjects}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
