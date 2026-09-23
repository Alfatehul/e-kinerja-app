"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";

export async function dismissNotification(notificationId: string) {
  const session = await getCurrentProfile();
  if (!session) throw new Error("Sesi pengguna tidak ditemukan.");

  const normalizedId = notificationId.trim();
  if (!normalizedId) throw new Error("ID notifikasi tidak valid.");

  const supabase = await createClient();
  const { error } = await supabase.from("notification_dismissals").upsert(
    { user_id: session.user.id, notification_id: normalizedId },
    { onConflict: "user_id,notification_id" },
  );

  if (error) throw new Error(error.message);
  revalidatePath("/admin", "layout");
  revalidatePath("/fakultas", "layout");
}
