"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { notifyAllBiro } from "@/lib/notifications";

function optionalNumber(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  return value === "" ? null : Number(value);
}

export async function createProposal(formData: FormData) {
  const session = await getCurrentProfile();
  const facultyId = session?.profile.faculty_id;
  if (!session || !facultyId) {
    throw new Error(
      "Profil Fakultas/Unit belum terhubung. Hubungi Admin Biro untuk melengkapi faculty_id.",
    );
  }
  const supabase = await createClient();

  const { count } = await supabase
    .from("budget_proposals")
    .select("*", { count: "exact", head: true })
    .eq("faculty_id", facultyId);

  const number = `USUL-2026-${String((count ?? 0) + 1).padStart(3, "0")}-${facultyId.slice(0, 4).toUpperCase()}`;

  const { data, error } = await supabase
    .from("budget_proposals")
    .insert({
      number,
      year: formData.get("year") as string,
      faculty_id: facultyId,
      kementerian_lembaga: formData.get("kementerian_lembaga") as string,
      unit_eselon: formData.get("unit_eselon") as string,
      satker: formData.get("satker") as string,
      sasaran_kegiatan: formData.get("sasaran_kegiatan") as string,
      klasifikasi_rincian_output: formData.get("klasifikasi_rincian_output") as string,
      rincian_output: formData.get("rincian_output") as string,
      indikator_ro: formData.get("indikator_ro") as string,
      volume_keluaran: Number(formData.get("volume_keluaran")),
      satuan_ukuran_keluaran: formData.get("satuan_ukuran_keluaran") as string,
      program: formData.get("program") as string,
      kegiatan: formData.get("kegiatan") as string,
      uraian: formData.get("uraian") as string,
      volume: optionalNumber(formData, "volume"),
      satuan: (formData.get("satuan") as string) || null,
      harga_satuan: optionalNumber(formData, "harga_satuan"),
      jumlah: optionalNumber(formData, "jumlah"),
      tor_link: (formData.get("tor_link") as string) || null,
      rab_link: (formData.get("rab_link") as string) || null,
      subkegiatan: null,
      sumber_dana: (formData.get("sumber_dana") as string) || null,
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

  redirect("/fakultas/usulan-anggaran?notice=" + encodeURIComponent("Usulan anggaran berhasil disimpan sebagai draft.") + "&modal=closed");
}

export async function updateProposal(id: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("budget_proposals")
    .update({
      kementerian_lembaga: formData.get("kementerian_lembaga") as string,
      unit_eselon: formData.get("unit_eselon") as string,
      satker: formData.get("satker") as string,
      sasaran_kegiatan: formData.get("sasaran_kegiatan") as string,
      klasifikasi_rincian_output: formData.get("klasifikasi_rincian_output") as string,
      rincian_output: formData.get("rincian_output") as string,
      indikator_ro: formData.get("indikator_ro") as string,
      volume_keluaran: Number(formData.get("volume_keluaran")),
      satuan_ukuran_keluaran: formData.get("satuan_ukuran_keluaran") as string,
      program: formData.get("program") as string,
      kegiatan: formData.get("kegiatan") as string,
      uraian: formData.get("uraian") as string,
      volume: optionalNumber(formData, "volume"),
      satuan: (formData.get("satuan") as string) || null,
      harga_satuan: optionalNumber(formData, "harga_satuan"),
      jumlah: optionalNumber(formData, "jumlah"),
      tor_link: (formData.get("tor_link") as string) || null,
      rab_link: (formData.get("rab_link") as string) || null,
      subkegiatan: null,
      sumber_dana: (formData.get("sumber_dana") as string) || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  redirect(`/fakultas/usulan-anggaran/${id}?notice=` + encodeURIComponent("Usulan anggaran berhasil diperbarui.") + "&modal=closed");
}

export async function deleteProposal(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("budget_proposals")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/fakultas/usulan-anggaran?notice=" + encodeURIComponent("Usulan anggaran berhasil dihapus."));
}

export async function submitProposal(id: string) {
  const session = await getCurrentProfile();
  const supabase = await createClient();
  const { data: proposal } = await supabase
    .from("budget_proposals")
    .select("number, faculties(name)")
    .eq("id", id)
    .single();
  const { error } = await supabase
    .from("budget_proposals")
    .update({
      status: "Diajukan",
      tanggal_pengajuan: new Date().toISOString().slice(0, 10),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  if (proposal) {
    const faculty = Array.isArray(proposal.faculties)
      ? proposal.faculties[0]
      : proposal.faculties;
    await notifyAllBiro(
      `Usulan anggaran baru dari ${faculty?.name ?? "Fakultas / Unit"}: ${proposal.number}`,
    );
  }

  await supabase.from("budget_history").insert({
    entity_type: "proposal",
    entity_id: id,
    event: "Usulan diajukan ke Biro AUPK",
    by: session!.user.id,
  });

  revalidatePath(`/fakultas/usulan-anggaran/${id}`);
  redirect(`/fakultas/usulan-anggaran/${id}?notice=` + encodeURIComponent("Usulan anggaran berhasil diajukan."));
}
