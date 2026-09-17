import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";

export default async function UsulanRevisiAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("budget_revisions")
    .select("*, faculties(name), budget_proposals(number)")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data: revisions } = await query;

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
      <h1 className="font-serif text-xl font-semibold mb-4">Usulan Revisi</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        <Link
          href="/admin/usulan-revisi"
          className={`text-xs font-semibold px-3 py-1.5 rounded-md border ${!status ? "bg-[#1B2A4B] text-white border-[#1B2A4B]" : "bg-white border-[#E1DDCF]"}`}
        >
          Semua
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/usulan-revisi?status=${encodeURIComponent(s)}`}
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
              <th className="p-3">No. Revisi</th>
              <th className="p-3">Fakultas</th>
              <th className="p-3">Usulan Terkait</th>
              <th className="p-3">Selisih</th>
              <th className="p-3">Status</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {revisions?.map((r: any) => {
              const selisih =
                r.after_volume * r.after_harga_satuan -
                r.before_volume * r.before_harga_satuan;
              return (
                <tr key={r.id} className="border-t border-[#E1DDCF]">
                  <td className="p-3 font-semibold text-[#1B2A4B]">
                    {r.number}
                  </td>
                  <td className="p-3">{r.faculties.name}</td>
                  <td className="p-3">{r.budget_proposals?.number}</td>
                  <td
                    className={`p-3 font-semibold ${selisih >= 0 ? "text-green-700" : "text-red-600"}`}
                  >
                    {selisih >= 0 ? "+" : ""}Rp{" "}
                    {Number(selisih).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/admin/usulan-revisi/${r.id}`}
                      className="text-[#1B2A4B] text-xs font-semibold hover:underline"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              );
            })}
            {revisions?.length === 0 && (
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
