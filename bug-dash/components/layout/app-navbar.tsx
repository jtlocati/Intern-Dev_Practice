import { getCurrentUser } from "@/lib/session";
import UserMenu from "./user-menu";

export default async function AppNavbar() {
  const user = await getCurrentUser();

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4">
      <span className="text-base font-semibold text-[var(--fg)]">Bug Dash</span>
      {user && <UserMenu user={user} />}
    </header>
  );
}
