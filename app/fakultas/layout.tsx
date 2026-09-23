import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import DashboardShell from "@/components/DashboardShell";
import { createClient } from "@/lib/supabase/server";
import { getNotifications } from "@/lib/notifications";

export default async function FakultasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentProfile();
  if (!session) redirect("/login");
  if (session.profile.role !== "admin_fakultas") redirect("/admin/dashboard");
  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, body, publish_date, pinned")
    .order("pinned", { ascending: false })
    .order("publish_date", { ascending: false })
    .limit(5);
  const notifications = await getNotifications(session.user.id);

  return (
    <DashboardShell
      userName={session.profile.full_name}
      role="fakultas"
      roleLabel="Fakultas / Unit"
      announcements={announcements ?? []}
      userId={session.user.id}
      initialNotifications={notifications}
    >
      {children}
    </DashboardShell>
  );
}
