import { requireUser } from "@/lib/session";
import { isAdmin } from "@/lib/permissions";
import AppNavbar from "@/components/layout/app-navbar";
import AppSidebar from "@/components/layout/app-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen">
      <AppNavbar />
      <div className="flex">
        <AppSidebar isAdmin={isAdmin(user)} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
