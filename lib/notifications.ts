import { createClient } from "@/lib/supabase/server";

export type Notification = {
  id: string;
  user_id: string;
  text: string;
  read: boolean;
  created_at: string;
};

export type AppNotification = Notification;

export async function notifyUser(userId: string, text: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("notify_user", {
    target_user_id: userId,
    notification_text: text,
  });
  if (error) throw new Error(`Gagal mengirim notifikasi: ${error.message}`);
}

export async function notifyFacultyAdmin(facultyId: string, text: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("notify_faculty_admin", {
    target_faculty_id: facultyId,
    notification_text: text,
  });
  if (error) throw new Error(`Gagal mengirim notifikasi Fakultas: ${error.message}`);
}

export async function notifyAllBiro(text: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("notify_all_biro", {
    notification_text: text,
  });
  if (error) throw new Error(`Gagal mengirim notifikasi Biro: ${error.message}`);
}

export async function getNotifications(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) throw new Error(`Gagal memuat notifikasi: ${error.message}`);
  return (data ?? []) as Notification[];
}
