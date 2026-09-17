import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";

export default async function UsulanAnggaranFakultasPage() {
  const session = await getCurrentProfile();
  const supabase = await createClient();

  const { data: proposals } = await supabase
    .from("budget_proposals")
    .select("*")
    .eq("faculty_id", session!.profile.faculty_id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-serif text-xl font-semibold">Usulan Anggaran</h1>
        <Link
          href="/fakultas/usulan-anggaran/tambah"
          className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md"
        >
          + Usulan Baru
        </Link>
      </div>
      <div className="bg-white border border-[#E1DDCF] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#EEF0F5] text-left">
            <tr>
              <th className="p-3">No. Usulan</th>
              <th className="p-3">Program / Kegiatan</th>
              <th className="p-3">Total Anggaran</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {proposals?.map((p) => (
              <tr key={p.id} className="border-t border-[#E1DDCF]">
                <td className="p-3 font-semibold text-[#1B2A4B]">{p.number}</td>
                <td className="p-3">
                  {p.program}
                  <div className="text-xs text-[#5B5A55]">{p.kegiatan}</div>
                </td>
                <td className="p-3">
                  Rp {Number(p.volume * p.harga_satuan).toLocaleString("id-ID")}
                </td>
                <td className="p-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="p-3">
                  <Link
                    href={`/fakultas/usulan-anggaran/${p.id}`}
                    className="text-[#1B2A4B] text-xs font-semibold hover:underline"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
            {proposals?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-[#5B5A55]">
                  Belum ada usulan anggaran.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
