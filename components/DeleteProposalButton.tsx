"use client";

import { useRouter } from "next/navigation";
import { deleteProposal } from "@/app/fakultas/usulan-anggaran/actions";

export default function DeleteProposalButton({ id }: { id: string }) {
  const router = useRouter();
  async function handleDelete() {
    if (!confirm("Usulan ini akan dihapus permanen. Lanjutkan?")) return;
    await deleteProposal(id);
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
