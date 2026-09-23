"use client";
import { deleteTorAdmin } from "@/app/admin/tor/actions";
import ConfirmActionButton from "./ConfirmActionButton";
export default function DeleteTorAdminButton({ id }: { id: string }) {
  return <ConfirmActionButton onConfirm={() => deleteTorAdmin(id)} message="TOR ini akan dihapus permanen. Lanjutkan?" className="text-red-600 text-xs font-semibold hover:underline" />;
}
