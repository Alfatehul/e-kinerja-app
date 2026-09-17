"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function verifyAssignment(
  id: string,
  action: "approve" | "reject",
  note?: string,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("indicator_assignments")
    .update({
      status: action === "approve" ? "Diverifikasi" : "Ditolak",
      note: action === "reject" ? note : null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/monitoring");
  revalidatePath(`/admin/monitoring/${id}`);
}
