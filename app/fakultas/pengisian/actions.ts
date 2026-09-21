"use server";

import { revalidatePath } from "next/cache";
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

export async function addRealization(assignmentId: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("realization_log").insert({
    assignment_id: assignmentId,
    amount: Number(formData.get("amount")),
    date: formData.get("date") as string,
    note: formData.get("note") as string,
  });

  if (error) throw new Error(error.message);

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
}

export async function deleteRealization(assignmentId: string, logId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("realization_log")
    .delete()
    .eq("id", logId);
  if (error) throw new Error(error.message);
  await recomputeRealization(assignmentId);
  revalidatePath(`/fakultas/pengisian/${assignmentId}`);
}

export async function submitForVerification(assignmentId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("indicator_assignments")
    .update({ status: "Diajukan" })
    .eq("id", assignmentId);
  if (error) throw new Error(error.message);
  revalidatePath(`/fakultas/pengisian/${assignmentId}`);
  revalidatePath("/fakultas/pengisian");
}

export async function cancelSubmission(assignmentId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("indicator_assignments")
    .update({ status: "Draft" })
    .eq("id", assignmentId)
    .eq("status", "Diajukan");

  if (error) throw new Error(error.message);

  revalidatePath(`/fakultas/pengisian/${assignmentId}`);
  revalidatePath("/fakultas/pengisian");
}

export async function updateDocumentLink(assignmentId: string, link: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("indicator_assignments")
    .update({ document_link: link || null })
    .eq("id", assignmentId);
  if (error) throw new Error(error.message);
  revalidatePath(`/fakultas/pengisian/${assignmentId}`);
  revalidatePath("/fakultas/pengisian");
}
