import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireAuth } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAuth();

  return <DashboardShell userEmail={user.email}>{children}</DashboardShell>;
}
