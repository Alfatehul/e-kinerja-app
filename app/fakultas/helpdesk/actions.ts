"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { notifyAllBiro, notifyFacultyAdmin } from "@/lib/notifications";

export async function createThread(formData: FormData) {
  const session = await getCurrentProfile();
  if (!session?.profile.faculty_id) throw new Error("Profil fakultas tidak ditemukan.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("helpdesk_threads")
    .insert({
      title: String(formData.get("title") ?? "").trim(),
      faculty_id: session.profile.faculty_id,
      created_by: session.user.id,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/fakultas/helpdesk");
  redirect(`/fakultas/helpdesk/${data.id}`);
}

export async function sendHelpdeskMessage(
  threadId: string,
  text: string,
  currentRole: "user" | "admin",
) {
  const session = await getCurrentProfile();
  if (!session) throw new Error("Sesi pengguna tidak ditemukan.");
  const supabase = await createClient();
  const { data: thread, error: threadError } = await supabase
    .from("helpdesk_threads")
    .select("title, faculty_id, faculties(name)")
    .eq("id", threadId)
    .single();
  if (threadError || !thread) throw new Error("Percakapan Helpdesk tidak ditemukan.");

  const expectedRole = session.profile.role === "admin_biro" ? "admin" : "user";
  if (currentRole !== expectedRole) throw new Error("Role pengirim tidak valid.");

  const { error } = await supabase.from("helpdesk_messages").insert({
    thread_id: threadId,
    sender_id: session.user.id,
    from_role: currentRole,
    text: text.trim(),
  });
  if (error) throw new Error(`Gagal mengirim pesan: ${error.message}`);

  const faculty = Array.isArray(thread.faculties)
    ? thread.faculties[0]
    : thread.faculties;
  const notificationText =
    currentRole === "user"
      ? `Pesan Help Desk baru dari ${faculty?.name ?? "Fakultas / Unit"}: ${thread.title}`
      : `Pesan baru di Help Desk: ${thread.title}`;
  if (currentRole === "user") {
    await notifyAllBiro(notificationText);
  } else {
    await notifyFacultyAdmin(thread.faculty_id, notificationText);
  }
}
