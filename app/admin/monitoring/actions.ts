"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { notifyFacultyAdmin } from "@/lib/notifications";

export async function verifyAssignment(
  id: string,
  action: "approve" | "reject",
  note?: string,
) {
  const supabase = await createClient();
  const { data: assignment } = await supabase
    .from("indicator_assignments")
    .select("faculty_id, indicators(code)")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("indicator_assignments")
    .update({
      status: action === "approve" ? "Diverifikasi" : "Ditolak",
      note: action === "reject" ? note : null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  const indicator = Array.isArray(assignment?.indicators)
    ? assignment.indicators[0]
    : assignment?.indicators;
  if (assignment) {
    await notifyFacultyAdmin(
      assignment.faculty_id,
      `Indikator ${indicator?.code ?? ""} telah ${action === "approve" ? "Diverifikasi" : "Ditolak"}`,
    );
  }

  revalidatePath("/admin/monitoring");
  revalidatePath(`/admin/monitoring/${id}`);
}
