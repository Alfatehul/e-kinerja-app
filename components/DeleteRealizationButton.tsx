"use client";

import { useRouter } from "next/navigation";
import { deleteRealization } from "@/app/fakultas/pengisian/actions";

export default function DeleteRealizationButton({
  assignmentId,
  logId,
}: {
  assignmentId: string;
  logId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Hapus entri realisasi ini?")) return;
    await deleteRealization(assignmentId, logId);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 text-xs font-semibold hover:underline"
    >
      Hapus
    </button>
  );
}
