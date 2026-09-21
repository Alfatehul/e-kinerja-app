"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

function value(formData: FormData, name: string) {
  return (formData.get(name) as string | null)?.trim() || null;
}

async function saveDocument(formData: FormData, id: string, facultyId: string, supabase: Awaited<ReturnType<typeof createClient>>) {
  const file = formData.get("document");
  if (!(file instanceof File) || !file.size) return;
  if (file.size > 10 * 1024 * 1024) throw new Error("Ukuran dokumen maksimal 10 MB.");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${facultyId}/tor/${id}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("budget-documents").upload(path, file, { contentType: file.type });
  if (error) throw new Error(`Gagal mengunggah dokumen: ${error.message}`);
  const { error: dbError } = await supabase.from("budget_documents").insert({ entity_type: "tor", entity_id: id, file_name: file.name, file_path: path, file_size: `${(file.size / 1024).toFixed(0)} KB` });
  if (dbError) throw new Error(`Gagal menyimpan dokumen: ${dbError.message}`);
}

export async function createTor(formData: FormData) {
  const session = await getCurrentProfile();
  if (!session) throw new Error("Sesi pengguna tidak ditemukan.");
  const supabase = await createClient();
  const proposalId = value(formData, "proposal_id");
  const { count } = await supabase.from("budget_tors").select("*", { count: "exact", head: true }).eq("faculty_id", session.profile.faculty_id);
  const number = `TOR-2026-${String((count ?? 0) + 1).padStart(3, "0")}-${session.profile.faculty_id.slice(0, 4).toUpperCase()}`;
  const { data, error } = await supabase.from("budget_tors").insert({
    number, year: value(formData, "year") || "2026", faculty_id: session.profile.faculty_id,
    proposal_id: proposalId, program: value(formData, "program"), kegiatan: value(formData, "kegiatan"),
    rincian_anggaran: value(formData, "rincian_anggaran"), sumber_dana: value(formData, "sumber_dana"),
    judul: value(formData, "judul"), latar_belakang: value(formData, "latar_belakang"),
    dasar_hukum: value(formData, "dasar_hukum"), tujuan: value(formData, "tujuan"),
    output: value(formData, "output"), outcome: value(formData, "outcome"),
    indikator_keberhasilan: value(formData, "indikator_keberhasilan"), lokasi: value(formData, "lokasi"),
    waktu_pelaksanaan: value(formData, "waktu_pelaksanaan"), peserta: value(formData, "peserta"),
    narasumber: value(formData, "narasumber"), metode_pelaksanaan: value(formData, "metode_pelaksanaan"),
    pengusul_id: session.user.id, status: "Draft",
  }).select().single();
  if (error) throw new Error(error.message);
  await saveDocument(formData, data.id, session.profile.faculty_id, supabase);
  await supabase.from("budget_history").insert({ entity_type: "tor", entity_id: data.id, event: "TOR dibuat sebagai draft", by: session.user.id });
  redirect("/fakultas/tor");
}

export async function updateTor(id: string, formData: FormData) {
  const supabase = await createClient();
  const fields = ["program", "kegiatan", "rincian_anggaran", "sumber_dana", "judul", "latar_belakang", "dasar_hukum", "tujuan", "output", "outcome", "indikator_keberhasilan", "lokasi", "waktu_pelaksanaan", "peserta", "narasumber", "metode_pelaksanaan"];
  const update = Object.fromEntries(fields.map((field) => [field, value(formData, field)]));
  const { error } = await supabase.from("budget_tors").update(update).eq("id", id);
  if (error) throw new Error(error.message);
  const { data: tor } = await supabase.from("budget_tors").select("faculty_id").eq("id", id).single();
  if (tor) await saveDocument(formData, id, tor.faculty_id, supabase);
  redirect(`/fakultas/tor/${id}`);
}

export async function deleteTor(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("budget_tors").delete().eq("id", id);
  if (error) throw new Error(error.message);
  redirect("/fakultas/tor");
}

export async function submitTor(id: string) {
  const session = await getCurrentProfile();
  if (!session) throw new Error("Sesi pengguna tidak ditemukan.");
  const supabase = await createClient();
  const { error } = await supabase.from("budget_tors").update({ status: "Diajukan", tanggal_pengajuan: new Date().toISOString().slice(0, 10), catatan_verifikator: null }).eq("id", id);
  if (error) throw new Error(error.message);
  await supabase.from("budget_history").insert({ entity_type: "tor", entity_id: id, event: "TOR diajukan ke Biro AUPK", by: session.user.id });
  revalidatePath(`/fakultas/tor/${id}`);
  revalidatePath("/admin/tor");
}
