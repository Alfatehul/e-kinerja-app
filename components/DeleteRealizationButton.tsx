"use client";

import { useRouter } from "next/navigation";
import { deleteRealization } from "@/app/fakultas/pengisian/actions";
import ConfirmActionButton from "./ConfirmActionButton";

export default function DeleteRealizationButton({
  assignmentId,
  logId,
}: {
  assignmentId: string;
  logId: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    await deleteRealization(assignmentId, logId);
    router.refresh();
  }

  return (
    <ConfirmActionButton onConfirm={handleDelete} message="Entri realisasi ini akan dihapus. Lanjutkan?" className="text-red-600 text-xs font-semibold hover:underline" />
  );
}
