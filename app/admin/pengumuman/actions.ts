"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { notifyFacultyAdmin } from "@/lib/notifications";

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient();
  const endDate = String(formData.get("end_date") ?? "").trim();
  const targetFaculty = String(formData.get("target_faculty") ?? "Semua Fakultas").trim();
  const title = String(formData.get("title") ?? "").trim();
  const { error } = await supabase.from("announcements").insert({
    title,
    body: String(formData.get("body") ?? "").trim(),
    target_faculty: targetFaculty,
    publish_date: String(formData.get("publish_date") ?? "").trim(),
    end_date: endDate || null,
  });
  if (error) throw new Error(error.message);
  const { data: faculties } = targetFaculty === "Semua Fakultas"
    ? await supabase.from("faculties").select("id")
    : await supabase.from("faculties").select("id").eq("name", targetFaculty);
  await Promise.all((faculties ?? []).map((faculty) =>
    notifyFacultyAdmin(faculty.id, `Pengumuman baru: ${title}`),
  ));
  redirect("/admin/pengumuman");
}

export async function togglePin(id: string, pinned: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("announcements")
    .update({ pinned })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pengumuman");
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/pengumuman");
}
