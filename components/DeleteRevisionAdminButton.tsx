"use client";
import { deleteRevisionAdmin } from "@/app/admin/usulan-revisi/actions";
export default function DeleteRevisionAdminButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Usulan ini akan dihapus permanen. Lanjutkan?")) return;
    await deleteRevisionAdmin(id);
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
