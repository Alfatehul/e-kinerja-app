"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export async function createRevision(formData: FormData) {
  const session = await getCurrentProfile();
  const supabase = await createClient();

  const proposalId = formData.get("proposal_id") as string;
  const { data: proposal } = await supabase
    .from("budget_proposals")
    .select("*")
    .eq("id", proposalId)
    .single();
  if (!proposal) throw new Error("Usulan tidak ditemukan");

  const { count } = await supabase
    .from("budget_revisions")
    .select("*", { count: "exact", head: true })
    .eq("faculty_id", session!.profile.faculty_id);

  const number = `REV-2026-${String((count ?? 0) + 1).padStart(3, "0")}-${session!.profile.faculty_id.slice(0, 4).toUpperCase()}`;

  const { data, error } = await supabase
    .from("budget_revisions")
    .insert({
      number,
      proposal_id: proposalId,
      year: proposal.year,
      faculty_id: session!.profile.faculty_id,
      jenis_revisi: formData.get("jenis_revisi") as string,
      before_uraian: proposal.uraian,
      before_volume: proposal.volume,
      before_harga_satuan: proposal.harga_satuan,
      after_uraian: formData.get("after_uraian") as string,
      after_volume: Number(formData.get("after_volume")),
      after_harga_satuan: Number(formData.get("after_harga_satuan")),
      alasan_revisi: formData.get("alasan_revisi") as string,
      pengusul_id: session!.user.id,
      tanggal_pengajuan: new Date().toISOString().slice(0, 10),
      status: "Diajukan",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("budget_history").insert({
    entity_type: "revision",
    entity_id: data.id,
    event: "Revisi diajukan",
    by: session!.user.id,
  });

  redirect("/fakultas/usulan-revisi");
}

export async function updateRevision(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("budget_revisions")
    .update({
      jenis_revisi: formData.get("jenis_revisi") as string,
      after_uraian: formData.get("after_uraian") as string,
      after_volume: Number(formData.get("after_volume")),
      after_harga_satuan: Number(formData.get("after_harga_satuan")),
      alasan_revisi: formData.get("alasan_revisi") as string,
      status: "Diajukan",
      catatan_verifikator: null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  redirect(`/fakultas/usulan-revisi/${id}`);
}
