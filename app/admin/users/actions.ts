"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateUserProfile(formData: FormData) {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "admin_biro") {
    throw new Error("Akses hanya untuk Admin Biro.");
  }

  const userId = String(formData.get("user_id") ?? "");
  const role = String(formData.get("role") ?? "");
  const facultyId = String(formData.get("faculty_id") ?? "") || null;

  if (!userId || !["admin_biro", "admin_fakultas"].includes(role)) {
    throw new Error("Data pengguna tidak valid.");
  }
  if (role === "admin_fakultas" && !facultyId) {
    throw new Error("Admin Fakultas harus terhubung ke fakultas atau unit.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ role, faculty_id: role === "admin_biro" ? null : facultyId })
    .eq("id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/users");
}

export async function updateUserPassword(formData: FormData) {
  const session = await getCurrentProfile();
  if (!session || session.profile.role !== "admin_biro") {
    throw new Error("Akses hanya untuk Admin Biro.");
  }

  const userId = String(formData.get("user_id") ?? "");
  const password = String(formData.get("password") ?? "");
  const passwordConfirmation = String(formData.get("password_confirmation") ?? "");

  if (!userId) throw new Error("Pengguna tidak valid.");
  if (password.length < 8) {
    throw new Error("Password minimal harus terdiri dari 8 karakter.");
  }
  if (password !== passwordConfirmation) {
    throw new Error("Konfirmasi password tidak cocok.");
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    password,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/users");
}
