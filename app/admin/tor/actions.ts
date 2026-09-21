"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
export async function verifyTor(id: string, status: "Disetujui" | "Ditolak" | "Perlu Perbaikan", catatan: string) {
  const session = await getCurrentProfile(); const supabase = await createClient();
  const { error } = await supabase.from("budget_tors").update({ status, catatan_verifikator: catatan }).eq("id", id);
  if (error) throw new Error(error.message);
  await supabase.from("budget_history").insert({ entity_type: "tor", entity_id: id, event: `Status diubah menjadi ${status}`, by: session!.user.id });
  revalidatePath("/admin/tor"); revalidatePath(`/admin/tor/${id}`);
}
export async function deleteTorAdmin(id: string) {
  const supabase = await createClient(); const { error } = await supabase.from("budget_tors").delete().eq("id", id);
  if (error) throw new Error(error.message); redirect("/admin/tor");
}
