"use client";
import { deleteTor } from "@/app/fakultas/tor/actions";
import ConfirmActionButton from "./ConfirmActionButton";
export default function DeleteTorButton({ id }: { id: string }) {
  return <ConfirmActionButton onConfirm={() => deleteTor(id)} message="TOR ini akan dihapus permanen. Lanjutkan?" className="text-red-600 text-xs font-semibold hover:underline" />;
}
