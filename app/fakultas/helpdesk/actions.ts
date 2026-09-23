"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

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
