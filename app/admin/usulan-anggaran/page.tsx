import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";
import TableActionLink from "@/components/TableActionLink";

type ProposalRow = {
  id: string;
  number: string;
  program: string;
  total_anggaran: number | null;
  volume: number;
  harga_satuan: number;
  status: string;
  faculties: { name: string } | null;
};

export default async function UsulanAnggaranAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; faculty?: string }>;
}) {
  const { status, faculty } = await searchParams;
  const supabase = await createClient();

  const { data: faculties } = await supabase
    .from("faculties")
    .select("id, name")
    .order("name");
  let query = supabase
    .from("budget_proposals")
    .select("*, faculties(name)")
    .order("created_at", { ascending: true });
  if (status) query = query.eq("status", status);
  if (faculty) query = query.eq("faculty_id", faculty);
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
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">Pengajuan</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">Usulan Anggaran</h1>
          <p className="mt-2 text-sm text-[#64736A]">Kelola dan tinjau pengajuan anggaran dari seluruh fakultas/unit.</p>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Link
          href={faculty ? `/admin/usulan-anggaran?faculty=${encodeURIComponent(faculty)}` : "/admin/usulan-anggaran"}
          className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition ${!status ? "border-[#0B5B35] bg-[#0B5B35] text-white shadow-sm" : "border-[#DCE6DF] bg-white text-[#64736A] hover:border-[#0B5B35] hover:text-[#0B5B35]"}`}
        >
          Semua
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/usulan-anggaran?status=${encodeURIComponent(s)}${faculty ? `&faculty=${encodeURIComponent(faculty)}` : ""}`}
            className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition ${status === s ? "border-[#0B5B35] bg-[#0B5B35] text-white shadow-sm" : "border-[#DCE6DF] bg-white text-[#64736A] hover:border-[#0B5B35] hover:text-[#0B5B35]"}`}
          >
            {s}
          </Link>
        ))}
      </div>
      <form method="get" className="flex items-center gap-3">
        {status && <input type="hidden" name="status" value={status} />}
        <label htmlFor="faculty" className="text-sm font-semibold text-[#334A3C]">Fakultas/Unit</label>
        <select id="faculty" name="faculty" defaultValue={faculty ?? ""} className="form-input max-w-sm">
          <option value="">Semua Fakultas/Unit</option>
          {faculties?.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <button type="submit" className="rounded-xl bg-[#0B5B35] px-4 py-2.5 text-sm font-bold text-white">Terapkan</button>
      </form>
      <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] text-sm">
          <thead className="border-b border-[#DCE6DF] bg-[#F5F8F5] text-left text-xs uppercase tracking-wide text-[#64736A]">
            <tr>
              <th className="px-4 py-3">No. Usulan</th><th className="px-4 py-3">Fakultas</th><th className="px-4 py-3">Program</th><th className="px-4 py-3">Total Anggaran</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(proposals as ProposalRow[] | null)?.map((p) => (
              <tr key={p.id} className="border-b border-[#EDF2EE] transition hover:bg-[#FAFCFA]">
                <td className="px-4 py-4 font-bold text-[#0B5B35]">{p.number}</td><td className="px-4 py-4 font-medium text-[#44534B]">{p.faculties?.name ?? "—"}</td><td className="px-4 py-4 text-[#44534B]">{p.program}</td><td className="px-4 py-4 font-semibold text-[#17231D]">
                  Rp {Number(p.total_anggaran ?? p.volume * p.harga_satuan).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-4">
                  <TableActionLink href={`/admin/usulan-anggaran/${p.id}`} />
                </td>
              </tr>
            ))}
            {proposals?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[#64736A]">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
