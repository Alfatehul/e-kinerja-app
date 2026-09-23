"use client";

import { deleteIndicator } from "@/app/admin/indikator/actions";
import ConfirmActionButton from "./ConfirmActionButton";

export default function DeleteIndicatorButton({ id }: { id: string }) {
  async function handleDelete() {
    await deleteIndicator(id);
  }

  return <ConfirmActionButton onConfirm={handleDelete} message="Indikator ini beserta seluruh data terkait akan dihapus permanen. Lanjutkan?" className="text-red-600 text-xs font-semibold hover:underline" />;
}
