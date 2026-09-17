"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export async function createProposal(formData: FormData) {
  const session = await getCurrentProfile();
  const supabase = await createClient();

  const { count } = await supabase
    .from("budget_proposals")
    .select("*", { count: "exact", head: true })
    .eq("faculty_id", session!.profile.faculty_id);

  const number = `USUL-2026-${String((count ?? 0) + 1).padStart(3, "0")}-${session!.profile.faculty_id.slice(0, 4).toUpperCase()}`;

  const { data, error } = await supabase
    .from("budget_proposals")
    .insert({
      number,
      year: formData.get("year") as string,
      faculty_id: session!.profile.faculty_id,
      program: formData.get("program") as string,
      kegiatan: formData.get("kegiatan") as string,
      subkegiatan: formData.get("subkegiatan") as string,
      uraian: formData.get("uraian") as string,
      volume: Number(formData.get("volume")),
      satuan: formData.get("satuan") as string,
      harga_satuan: Number(formData.get("harga_satuan")),
      sumber_dana: formData.get("sumber_dana") as string,
      pengusul_id: session!.user.id,
      status: "Draft",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("budget_history").insert({
    entity_type: "proposal",
    entity_id: data.id,
    event: "Usulan dibuat sebagai draft",
    by: session!.user.id,
  });

  redirect("/fakultas/usulan-anggaran");
}

export async function updateProposal(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("budget_proposals")
    .update({
      program: formData.get("program") as string,
      kegiatan: formData.get("kegiatan") as string,
      subkegiatan: formData.get("subkegiatan") as string,
      uraian: formData.get("uraian") as string,
      volume: Number(formData.get("volume")),
      satuan: formData.get("satuan") as string,
      harga_satuan: Number(formData.get("harga_satuan")),
      sumber_dana: formData.get("sumber_dana") as string,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  redirect(`/fakultas/usulan-anggaran/${id}`);
}

export async function deleteProposal(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("budget_proposals")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/fakultas/usulan-anggaran");
}

export async function submitProposal(id: string) {
  const session = await getCurrentProfile();
  const supabase = await createClient();
  const { error } = await supabase
    .from("budget_proposals")
    .update({
      status: "Diajukan",
      tanggal_pengajuan: new Date().toISOString().slice(0, 10),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  await supabase.from("budget_history").insert({
    entity_type: "proposal",
    entity_id: id,
    event: "Usulan diajukan ke Biro AUPK",
    by: session!.user.id,
  });

  revalidatePath(`/fakultas/usulan-anggaran/${id}`);
}
