"use client";
import { deleteRevisionAdmin } from "@/app/admin/usulan-revisi/actions";
import ConfirmActionButton from "./ConfirmActionButton";
export default function DeleteRevisionAdminButton({ id }: { id: string }) {
  async function handleDelete() {
    await deleteRevisionAdmin(id);
  }
  return (
    <ConfirmActionButton onConfirm={handleDelete} message="Usulan revisi ini akan dihapus permanen. Lanjutkan?" className="text-red-600 text-xs font-semibold hover:underline" />
  );
}
