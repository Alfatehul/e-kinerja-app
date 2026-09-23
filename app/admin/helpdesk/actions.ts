"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

async function requireAdmin() {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "admin_biro") {
    throw new Error("Akses hanya untuk Admin Biro.");
  }
  return session;
}

export async function createThreadForFaculty(formData: FormData) {
  const session = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const facultyId = String(formData.get("faculty_id") ?? "").trim();

  if (!title || !facultyId) {
    throw new Error("Topik dan Fakultas / Unit wajib diisi.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("helpdesk_threads")
    .insert({
      title,
      faculty_id: facultyId,
      created_by: session.user.id,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/helpdesk");
  redirect(`/admin/helpdesk/${data.id}`);
}

export async function deleteThread(threadId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("helpdesk_threads")
    .delete()
    .eq("id", threadId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/helpdesk");
  redirect("/admin/helpdesk");
}
