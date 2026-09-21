import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";
import TableActionLink from "@/components/TableActionLink";

export default async function UsulanRevisiFakultasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await getCurrentProfile();
  const { q, status } = await searchParams;
  const supabase = await createClient();

  let revisionsQuery = supabase
    .from("budget_revisions")
    .select("*, budget_proposals(number)")
    .eq("faculty_id", session!.profile.faculty_id)
    .order("created_at", { ascending: true });
  if (q) revisionsQuery = revisionsQuery.or(`number.ilike.%${q}%`);
  if (status) revisionsQuery = revisionsQuery.eq("status", status);
  const { data: revisions } = await revisionsQuery;
  const statuses = ["Diajukan", "Diverifikasi", "Disetujui", "Ditolak", "Perlu Perbaikan"];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">Pengajuan</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">Usulan Revisi</h1>
          <p className="mt-2 text-sm text-[#64736A]">Ajukan perubahan dan pantau hasil verifikasi usulan Anda.</p>
        </div>
        <Link
          href="/fakultas/usulan-revisi/tambah"
          className="inline-flex items-center justify-center rounded-xl bg-[#0B5B35] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#073B25]"
        >
          + Ajukan Revisi
        </Link>
      </div>
      <form method="get" className="grid gap-3 rounded-2xl border border-[#DCE6DF] bg-white p-4 shadow-sm md:grid-cols-[1.5fr_1fr_auto]">
        <div>
          <label htmlFor="q" className="mb-1.5 block text-xs font-semibold text-[#334A3C]">Cari revisi</label>
          <input id="q" name="q" defaultValue={q ?? ""} placeholder="Cari nomor revisi..." className="form-input" />
        </div>
        <div>
          <label htmlFor="status" className="mb-1.5 block text-xs font-semibold text-[#334A3C]">Status</label>
          <select id="status" name="status" defaultValue={status ?? ""} className="form-input">
            <option value="">Semua status</option>
            {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button type="submit" className="rounded-xl bg-[#0B5B35] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#073B25]">Filter</button>
          {(q || status) && <Link href="/fakultas/usulan-revisi" className="rounded-xl border border-[#DCE6DF] px-4 py-2.5 text-sm font-semibold text-[#64736A] hover:bg-[#F5F8F5]">Reset</Link>}
        </div>
      </form>
      <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-sm">
          <thead className="border-b border-[#DCE6DF] bg-[#F5F8F5] text-left text-xs uppercase tracking-wide text-[#64736A]">
            <tr>
              <th className="px-4 py-3">No.</th><th className="px-4 py-3">No. Revisi</th><th className="px-4 py-3">Usulan Terkait</th><th className="px-4 py-3">Selisih</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {revisions?.map((r: {
              id: string; number: string; after_volume: number; after_harga_satuan: number;
              before_volume: number; before_harga_satuan: number; status: string;
              budget_proposals: { number: string } | null;
            }, index) => {
              const selisih =
                r.after_volume * r.after_harga_satuan -
                r.before_volume * r.before_harga_satuan;
              return (
                <tr key={r.id} className="border-b border-[#EDF2EE] transition hover:bg-[#FAFCFA]">
                  <td className="px-4 py-4 text-center text-[#849289]">{index + 1}</td>
                  <td className="px-4 py-4 font-bold text-[#0B5B35]">
                    {r.number}
                  </td>
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
                    <TableActionLink href={`/fakultas/usulan-revisi/${r.id}`} />
                  </td>
                </tr>
              );
            })}
            {revisions?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[#64736A]">
                  Belum ada usulan revisi.
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
