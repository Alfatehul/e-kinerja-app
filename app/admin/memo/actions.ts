"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { notifyFacultyAdmin } from "@/lib/notifications";

export async function createMemo(formData: FormData) {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "admin_biro") {
    throw new Error("Anda tidak memiliki akses untuk membuat memo.");
  }

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const targetFaculty = String(formData.get("target_faculty") ?? "Semua Fakultas").trim();
  if (!title || !body) throw new Error("Judul dan isi memo wajib diisi.");
  if (!targetFaculty) throw new Error("Target penerima wajib dipilih.");

  const supabase = await createClient();
  if (targetFaculty !== "Semua Fakultas") {
    const { data: faculty } = await supabase
      .from("faculties")
      .select("id")
      .eq("name", targetFaculty)
      .maybeSingle();
    if (!faculty) throw new Error("Fakultas atau unit penerima tidak valid.");
  }

  const { error } = await supabase.from("memos").insert({
    title,
    body,
    target_faculty: targetFaculty,
    status: String(formData.get("status") ?? "Diterbitkan"),
    publish_date: String(formData.get("publish_date") ?? new Date().toISOString().slice(0, 10)),
    created_by: session.user.id,
  });
  if (error) throw new Error(error.message);
  const { data: faculties } = targetFaculty === "Semua Fakultas"
    ? await supabase.from("faculties").select("id")
    : await supabase.from("faculties").select("id").eq("name", targetFaculty);
  await Promise.all((faculties ?? []).map((faculty) =>
    notifyFacultyAdmin(faculty.id, `Memo baru: ${title}`),
  ));
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
