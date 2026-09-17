"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export async function verifyRevision(
  id: string,
  status: "Disetujui" | "Ditolak" | "Perlu Perbaikan",
  catatan: string,
) {
  const session = await getCurrentProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("budget_revisions")
    .update({
      status,
      catatan_verifikator: catatan,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabase.from("budget_history").insert({
    entity_type: "revision",
    entity_id: id,
    event: `Status diubah menjadi ${status}`,
    by: session!.user.id,
  });

  revalidatePath("/admin/usulan-revisi");
  revalidatePath(`/admin/usulan-revisi/${id}`);
}
