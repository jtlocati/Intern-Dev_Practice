import { requireAdmin } from "@/lib/session";
import { getUsersWithCounts } from "@/data/users";
import UsersTable from "./users-table";
import PageHeader from "@/components/layout/page-header";

export default async function Users() {
  await requireAdmin();
  const users = await getUsersWithCounts();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Users"
        description={`${users.length} ${users.length === 1 ? "member" : "members"}`}
      />
      <UsersTable users={users} />
    </div>
  );
}
