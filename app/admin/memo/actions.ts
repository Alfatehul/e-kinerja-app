"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export async function createMemo(formData: FormData) {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "admin_biro") {
    throw new Error("Anda tidak memiliki akses untuk membuat memo.");
  }

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title || !body) throw new Error("Judul dan isi memo wajib diisi.");

  const { error } = await (await createClient()).from("memos").insert({
    title,
    body,
    target_faculty: String(formData.get("target_faculty") ?? "Semua Fakultas").trim(),
    status: String(formData.get("status") ?? "Diterbitkan"),
    publish_date: String(formData.get("publish_date") ?? new Date().toISOString().slice(0, 10)),
    created_by: session.user.id,
  });
  if (error) throw new Error(error.message);
  redirect("/admin/memo");
}

export async function toggleMemoPin(id: string, pinned: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("memos").update({ pinned }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/memo");
  revalidatePath("/fakultas/memo");
}

export async function deleteMemo(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("memos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/memo");
  revalidatePath("/fakultas/memo");
}
