import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";
import TableActionLink from "@/components/TableActionLink";

type RevisionRow = {
  id: string;
  number: string;
  after_volume: number;
  after_harga_satuan: number;
  before_volume: number;
  before_harga_satuan: number;
  status: string;
  faculties: { name: string } | null;
  budget_proposals: { number: string } | null;
};

export default async function UsulanRevisiAdminPage({
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
    .from("budget_revisions")
    .select("*, faculties(name), budget_proposals(number)")
    .order("created_at", { ascending: true });
  if (status) query = query.eq("status", status);
  if (faculty) query = query.eq("faculty_id", faculty);
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
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">Pengajuan</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">Usulan Revisi</h1>
        <p className="mt-2 text-sm text-[#64736A]">Pantau perubahan usulan anggaran dan proses verifikasinya.</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <Link
          href={faculty ? `/admin/usulan-revisi?faculty=${encodeURIComponent(faculty)}` : "/admin/usulan-revisi"}
          className={`whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-semibold transition ${!status ? "border-[#0B5B35] bg-[#0B5B35] text-white shadow-sm" : "border-[#DCE6DF] bg-white text-[#64736A] hover:border-[#0B5B35] hover:text-[#0B5B35]"}`}
        >
          Semua
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/usulan-revisi?status=${encodeURIComponent(s)}${faculty ? `&faculty=${encodeURIComponent(faculty)}` : ""}`}
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
              <th className="px-4 py-3">No. Revisi</th><th className="px-4 py-3">Fakultas</th><th className="px-4 py-3">Usulan Terkait</th><th className="px-4 py-3">Selisih</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(revisions as RevisionRow[] | null)?.map((r) => {
              const selisih =
                r.after_volume * r.after_harga_satuan -
                r.before_volume * r.before_harga_satuan;
              return (
                <tr key={r.id} className="border-b border-[#EDF2EE] transition hover:bg-[#FAFCFA]">
                  <td className="px-4 py-4 font-bold text-[#0B5B35]">
                    {r.number}
                  </td>
                  <td className="px-4 py-4 font-medium text-[#44534B]">{r.faculties?.name ?? "—"}</td>
                  <td className="px-4 py-4 font-medium text-[#44534B]">{r.budget_proposals?.number ?? "—"}</td>
                  <td
                    className={`px-4 py-4 font-semibold ${selisih >= 0 ? "text-emerald-700" : "text-red-600"}`}
                  >
                    {selisih >= 0 ? "+" : ""}Rp{" "}
                    {Number(selisih).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-4">
                    <TableActionLink href={`/admin/usulan-revisi/${r.id}`} />
                  </td>
                </tr>
              );
            })}
            {revisions?.length === 0 && (
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
