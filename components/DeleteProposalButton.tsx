"use client";

import { deleteProposal } from "@/app/fakultas/usulan-anggaran/actions";
import ConfirmActionButton from "./ConfirmActionButton";

export default function DeleteProposalButton({ id }: { id: string }) {
  async function handleDelete() {
    await deleteProposal(id);
  }
  return (
    <ConfirmActionButton onConfirm={handleDelete} message="Usulan ini akan dihapus permanen. Lanjutkan?" className="text-red-600 text-xs font-semibold hover:underline" />
  );
}
