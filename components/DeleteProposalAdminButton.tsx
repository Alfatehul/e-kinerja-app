"use client";
import { deleteProposalAdmin } from "@/app/admin/usulan-anggaran/actions";
import ConfirmActionButton from "./ConfirmActionButton";
export default function DeleteProposalAdminButton({ id }: { id: string }) {
  async function handleDelete() {
    await deleteProposalAdmin(id);
  }
  return <ConfirmActionButton onConfirm={handleDelete} message="Usulan ini akan dihapus permanen. Lanjutkan?" className="text-red-600 text-xs font-semibold hover:underline" />;
}
