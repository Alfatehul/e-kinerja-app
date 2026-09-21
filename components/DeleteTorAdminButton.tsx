"use client";
import { deleteTorAdmin } from "@/app/admin/tor/actions";
export default function DeleteTorAdminButton({ id }: { id: string }) {
  return <button onClick={async () => { if (confirm("TOR ini akan dihapus permanen. Lanjutkan?")) await deleteTorAdmin(id); }} className="text-red-600 text-xs font-semibold hover:underline">Hapus</button>;
}
