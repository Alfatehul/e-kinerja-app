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

  return returnPath === "/fakultas/pengisian" || returnPath === detailPath
    ? returnPath
    : detailPath;
}

function getTodayJakarta() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function addRealization(assignmentId: string, formData: FormData) {
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
    `${getReturnPath(assignmentId, formData.get("return_path"))}?notice=${encodeURIComponent("Realisasi berhasil ditambahkan.")}&modal=closed`,
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
) {
  const supabase = await createClient();
  const { data: assignment, error: assignmentError } = await supabase
    .from("indicator_assignments")
    .select("document_link")
    .eq("id", assignmentId)
    .single();

  if (assignmentError) throw new Error(assignmentError.message);
  if (!assignment.document_link?.trim()) {
    throw new Error(
      "Link dokumen pendukung wajib diisi sebelum mengajukan verifikasi.",
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
    `${getReturnPath(assignmentId, returnPath)}?notice=${encodeURIComponent("Indikator berhasil diajukan untuk verifikasi.")}&modal=closed`,
  );
}

export async function cancelSubmission(
  assignmentId: string,
  returnPath?: string,
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
    `${getReturnPath(assignmentId, returnPath)}?notice=${encodeURIComponent("Pengajuan berhasil dibatalkan.")}&modal=closed`,
  );
}

export async function updateDocumentLink(
  assignmentId: string,
  link: string,
  returnPath?: string,
) {
  const documentLink = link.trim();
  if (!documentLink) {
    throw new Error("Link dokumen pendukung wajib diisi.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("indicator_assignments")
    .update({ document_link: documentLink })
    .eq("id", assignmentId);
  if (error) throw new Error(error.message);
  revalidatePath(`/fakultas/pengisian/${assignmentId}`);
  revalidatePath("/fakultas/pengisian");
  const destination =
    getReturnPath(assignmentId, returnPath);
  redirect(
    `${destination}?notice=${encodeURIComponent("Link dokumen pendukung berhasil disimpan.")}&modal=closed`,
  );
}
