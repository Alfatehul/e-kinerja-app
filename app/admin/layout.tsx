import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import DashboardShell from "@/components/DashboardShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentProfile();

  if (!session) redirect("/login");
  if (session.profile.role !== "admin_biro") redirect("/fakultas/dashboard");

  return (
    <DashboardShell
      userName={session.profile.full_name}
      role="biro"
      roleLabel="Admin Biro — Universitas"
    >
      {children}
    </DashboardShell>
  );
}
