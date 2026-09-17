"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").insert({
    title: formData.get("title") as string,
    body: formData.get("body") as string,
    target_faculty: formData.get("target_faculty") as string,
    publish_date: formData.get("publish_date") as string,
    end_date: formData.get("end_date") as string,
  });
  if (error) throw new Error(error.message);
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
