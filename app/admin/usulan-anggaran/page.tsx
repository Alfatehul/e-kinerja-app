import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";

export default async function UsulanAnggaranAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("budget_proposals")
    .select("*, faculties(name)")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data: proposals } = await query;

  const statuses = [
    "Draft",
    "Diajukan",
    "Diverifikasi",
    "Disetujui",
    "Ditolak",
    "Perlu Perbaikan",
  ];

  return (
    <div>
      <h1 className="font-serif text-xl font-semibold mb-4">Usulan Anggaran</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        <Link
          href="/admin/usulan-anggaran"
          className={`text-xs font-semibold px-3 py-1.5 rounded-md border ${!status ? "bg-[#1B2A4B] text-white border-[#1B2A4B]" : "bg-white border-[#E1DDCF]"}`}
        >
          Semua
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/usulan-anggaran?status=${encodeURIComponent(s)}`}
            className={`text-xs font-semibold px-3 py-1.5 rounded-md border ${status === s ? "bg-[#1B2A4B] text-white border-[#1B2A4B]" : "bg-white border-[#E1DDCF]"}`}
          >
            {s}
          </Link>
        ))}
      </div>
      <div className="bg-white border border-[#E1DDCF] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#EEF0F5] text-left">
            <tr>
              <th className="p-3">No. Usulan</th>
              <th className="p-3">Fakultas</th>
              <th className="p-3">Program</th>
              <th className="p-3">Total Anggaran</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {proposals?.map((p: any) => (
              <tr key={p.id} className="border-t border-[#E1DDCF]">
                <td className="p-3 font-semibold text-[#1B2A4B]">{p.number}</td>
                <td className="p-3">{p.faculties.name}</td>
                <td className="p-3">{p.program}</td>
                <td className="p-3">
                  Rp {Number(p.volume * p.harga_satuan).toLocaleString("id-ID")}
                </td>
                <td className="p-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="p-3">
                  <Link
                    href={`/admin/usulan-anggaran/${p.id}`}
                    className="text-[#1B2A4B] text-xs font-semibold hover:underline"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
            {proposals?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-[#5B5A55]">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
