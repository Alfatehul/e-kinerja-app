import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import DashboardShell from "@/components/DashboardShell";

export default async function FakultasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentProfile();
  if (!session) redirect("/login");
  if (session.profile.role !== "admin_fakultas") redirect("/admin/dashboard");

  return (
    <DashboardShell
      userName={session.profile.full_name}
      role="fakultas"
      roleLabel="Fakultas / Unit"
    >
      {children}
    </DashboardShell>
  );
}
