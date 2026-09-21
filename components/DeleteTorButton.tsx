"use client";
import { deleteTor } from "@/app/fakultas/tor/actions";
export default function DeleteTorButton({ id }: { id: string }) {
  return <button onClick={async () => { if (confirm("TOR ini akan dihapus permanen. Lanjutkan?")) await deleteTor(id); }} className="text-red-600 text-xs font-semibold hover:underline">Hapus</button>;
}
