"use client";
import { deleteProposalAdmin } from "@/app/admin/usulan-anggaran/actions";
export default function DeleteProposalAdminButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Usulan ini akan dihapus permanen. Lanjutkan?")) return;
    await deleteProposalAdmin(id);
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
