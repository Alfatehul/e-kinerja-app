"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function recomputeRealization(assignmentId: string) {
  const supabase = await createClient();

  const { data: logs } = await supabase
    .from("realization_log")
    .select("amount")
    .eq("assignment_id", assignmentId);

  const total = (logs ?? []).reduce((sum, l) => sum + Number(l.amount), 0);

  await supabase
    .from("indicator_assignments")
    .update({ realization: total })
    .eq("id", assignmentId);
}

function getReturnPath(assignmentId: string, returnPath: unknown) {
  const detailPath = `/fakultas/pengisian/${assignmentId}`;

  return returnPath === "/fakultas/pengisian" ||
    returnPath === detailPath ||
    (typeof returnPath === "string" &&
      /^\/fakultas\/pengisian\?quarter=[1-4]$/.test(returnPath))
    ? returnPath
    : detailPath;
}

function withNotice(
  destination: string,
  notice: string,
  modalId?: string,
) {
  const params = new URLSearchParams({ notice });
  params.set("modal", modalId ?? "closed");
  return `${destination}${destination.includes("?") ? "&" : "?"}${params}`;
}

function withError(destination: string, error: string, modalId?: string) {
  const params = new URLSearchParams({ error });
  params.set("modal", modalId ?? "closed");
  return `${destination}${destination.includes("?") ? "&" : "?"}${params}`;
}

function getTodayJakarta() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function addRealization(
  assignmentId: string,
  formData: FormData,
) {
  const supabase = await createClient();

  const submittedDate = String(formData.get("date") ?? "").trim();
  const realizationUnit = String(formData.get("realization_unit") ?? "").trim();
  if (!realizationUnit) {
    throw new Error("Satuan realisasi wajib diisi.");
  }

  const { error } = await supabase.from("realization_log").insert({
    assignment_id: assignmentId,
    amount: Number(formData.get("amount")),
    date: submittedDate || getTodayJakarta(),
  });

  if (error) throw new Error(error.message);

  const { error: unitError } = await supabase
    .from("indicator_assignments")
    .update({ realization_unit: realizationUnit })
    .eq("id", assignmentId);
  if (unitError) throw new Error(unitError.message);

  await recomputeRealization(assignmentId);

  const { data: assignment } = await supabase
    .from("indicator_assignments")
    .select("status")
    .eq("id", assignmentId)
    .single();

  if (assignment?.status === "Belum Diisi") {
    await supabase
      .from("indicator_assignments")
      .update({ status: "Draft" })
      .eq("id", assignmentId);
  }

  revalidatePath(`/fakultas/pengisian/${assignmentId}`);
  revalidatePath("/fakultas/pengisian");
  redirect(
    withNotice(
      getReturnPath(assignmentId, formData.get("return_path")),
      "Realisasi berhasil ditambahkan.",
      String(formData.get("modal_id") ?? "") || undefined,
    ),
  );
}

export async function deleteRealization(assignmentId: string, logId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("realization_log")
    .delete()
    .eq("id", logId);
  if (error) throw new Error(error.message);
  await recomputeRealization(assignmentId);
  revalidatePath("/fakultas/pengisian");
  revalidatePath(`/fakultas/pengisian/${assignmentId}`);
}

export async function submitForVerification(
  assignmentId: string,
  returnPath?: string,
  modalId?: string,
) {
  const supabase = await createClient();
  const { data: assignment, error: assignmentError } = await supabase
    .from("indicator_assignments")
    .select("document_link")
    .eq("id", assignmentId)
    .single();

  if (assignmentError) throw new Error(assignmentError.message);
  if (!assignment.document_link?.trim()) {
    redirect(
      withError(
        getReturnPath(assignmentId, returnPath),
        "Link dokumen pendukung wajib diisi sebelum mengajukan verifikasi.",
        modalId,
      ),
    );
  }

  const { error } = await supabase
    .from("indicator_assignments")
    .update({ status: "Diajukan" })
    .eq("id", assignmentId);
  if (error) throw new Error(error.message);
  revalidatePath(`/fakultas/pengisian/${assignmentId}`);
  revalidatePath("/fakultas/pengisian");
  redirect(
    withNotice(
      getReturnPath(assignmentId, returnPath),
      "Indikator berhasil diajukan untuk verifikasi.",
      modalId,
    ),
  );
}

export async function cancelSubmission(
  assignmentId: string,
  returnPath?: string,
  modalId?: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("indicator_assignments")
    .update({ status: "Draft" })
    .eq("id", assignmentId)
    .eq("status", "Diajukan");

  if (error) throw new Error(error.message);

  revalidatePath(`/fakultas/pengisian/${assignmentId}`);
  revalidatePath("/fakultas/pengisian");
  redirect(
    withNotice(
      getReturnPath(assignmentId, returnPath),
      "Pengajuan berhasil dibatalkan.",
      modalId,
    ),
  );
}

export async function updateDocumentLink(
  assignmentId: string,
  link: string,
  returnPath?: string,
  modalId?: string,
) {
  const documentLink = link.trim();
  const supabase = await createClient();
  const { error } = await supabase
    .from("indicator_assignments")
    .update({ document_link: documentLink || null })
    .eq("id", assignmentId);
  if (error) throw new Error(error.message);
  revalidatePath(`/fakultas/pengisian/${assignmentId}`);
  revalidatePath("/fakultas/pengisian");
  const destination =
    getReturnPath(assignmentId, returnPath);
  const notice = documentLink
    ? "Link dokumen pendukung berhasil disimpan."
    : "Link dokumen pendukung berhasil dihapus.";
  redirect(withNotice(destination, notice, modalId));
}
