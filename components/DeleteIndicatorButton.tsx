"use client";

import { useRouter } from "next/navigation";
import { deleteIndicator } from "@/app/admin/indikator/actions";

export default function DeleteIndicatorButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (
      !confirm(
        "Indikator ini beserta seluruh data terkait akan dihapus permanen. Lanjutkan?",
      )
    )
      return;
    await deleteIndicator(id);
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
