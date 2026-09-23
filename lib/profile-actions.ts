"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export async function updateOwnProfile(formData: FormData) {
  const session = await getCurrentProfile();
  if (!session) throw new Error("Sesi login tidak ditemukan.");

  const fullName = String(formData.get("full_name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirmation = String(formData.get("password_confirmation") ?? "");

  if (fullName.length < 2) throw new Error("Nama lengkap wajib diisi.");
  if (password && password.length < 8) {
    throw new Error("Password baru minimal 8 karakter.");
  }
  if (password !== passwordConfirmation) {
    throw new Error("Konfirmasi password tidak cocok.");
  }

  const supabase = await createClient();
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", session.user.id);
  if (profileError) throw new Error(profileError.message);

  if (password) {
    const { error: passwordError } = await supabase.auth.updateUser({ password });
    if (passwordError) throw new Error(passwordError.message);
  }

  revalidatePath("/admin/profil");
  revalidatePath("/fakultas/profil");
  revalidatePath("/admin");
  revalidatePath("/fakultas");
}
