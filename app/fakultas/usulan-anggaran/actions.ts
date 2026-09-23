"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { notifyAllBiro } from "@/lib/notifications";

const allowedDocumentTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

async function saveUploadedDocument(
  formData: FormData,
  entityId: string,
  facultyId: string,
  supabase: Awaited<ReturnType<typeof createClient>>,
) {
  const document = formData.get("document");
  if (!(document instanceof File) || document.size === 0) return;
  if (!allowedDocumentTypes.has(document.type)) {
    throw new Error("Dokumen harus berformat PDF, Word, atau Excel.");
  }
  if (document.size > 10 * 1024 * 1024) {
    throw new Error("Ukuran dokumen maksimal 10 MB.");
  }

  const safeFileName = document.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${facultyId}/proposal/${entityId}/${Date.now()}-${safeFileName}`;
  const { error: uploadError } = await supabase.storage
    .from("budget-documents")
    .upload(path, document, { contentType: document.type, upsert: false });
  if (uploadError) throw new Error(`Gagal mengunggah dokumen: ${uploadError.message}`);

  const { error: documentError } = await supabase.from("budget_documents").insert({
    entity_type: "proposal",
    entity_id: entityId,
    file_name: document.name,
    file_path: path,
    file_size: `${(document.size / 1024).toFixed(0)} KB`,
  });
  if (documentError) throw new Error(`Gagal menyimpan dokumen: ${documentError.message}`);
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
      program: formData.get("program") as string,
      kegiatan: formData.get("kegiatan") as string,
      uraian: formData.get("uraian") as string,
      volume: 1,
      satuan: "total",
      harga_satuan: Number(formData.get("total_anggaran")),
      tor_link: (formData.get("tor_link") as string) || null,
      subkegiatan: null,
      sumber_dana: null,
      pengusul_id: session!.user.id,
      status: "Draft",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  await saveUploadedDocument(
    formData,
    data.id,
    facultyId,
    supabase,
  );

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
      uraian: formData.get("uraian") as string,
      volume: 1,
      satuan: "total",
      harga_satuan: Number(formData.get("total_anggaran")),
      tor_link: (formData.get("tor_link") as string) || null,
      subkegiatan: null,
      sumber_dana: null,
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
}
