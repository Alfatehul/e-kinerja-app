"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { notifyFacultyAdmin } from "@/lib/notifications";
import { redirect } from "next/navigation";

export async function verifyProposal(
  id: string,
  status: "Disetujui" | "Ditolak" | "Perlu Perbaikan",
  catatan: string,
) {
  const session = await getCurrentProfile();
  const supabase = await createClient();
  const { data: proposal } = await supabase
    .from("budget_proposals")
    .select("number, faculty_id")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("budget_proposals")
    .update({
      status,
      catatan_verifikator: catatan,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  if (proposal) {
    await notifyFacultyAdmin(proposal.faculty_id, `Usulan ${proposal.number} telah ${status}`);
  }

  await supabase.from("budget_history").insert({
    entity_type: "proposal",
    entity_id: id,
    event: `Status diubah menjadi ${status}`,
    by: session!.user.id,
  });

  revalidatePath("/admin/usulan-anggaran");
  revalidatePath(`/admin/usulan-anggaran/${id}`);
}

export async function deleteProposalAdmin(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("budget_proposals")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/admin/usulan-anggaran");
}
