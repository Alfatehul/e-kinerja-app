import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";
import TableActionLink from "@/components/TableActionLink";

export default async function UsulanAnggaranFakultasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const session = await getCurrentProfile();
  const { q, status } = await searchParams;
  const supabase = await createClient();

  let proposalsQuery = supabase
    .from("budget_proposals")
    .select("*")
    .eq("faculty_id", session!.profile.faculty_id)
    .order("created_at", { ascending: true });
  if (q) proposalsQuery = proposalsQuery.or(`number.ilike.%${q}%,program.ilike.%${q}%,kegiatan.ilike.%${q}%`);
  if (status) proposalsQuery = proposalsQuery.eq("status", status);
  const { data: proposals } = await proposalsQuery;
  const statuses = ["Draft", "Diajukan", "Diverifikasi", "Disetujui", "Ditolak", "Perlu Perbaikan"];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">Pengajuan</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">Usulan Anggaran</h1>
          <p className="mt-2 text-sm text-[#64736A]">Ajukan dan pantau status kebutuhan anggaran unit Anda.</p>
        </div>
        <Link
          href="/fakultas/usulan-anggaran/tambah"
          className="inline-flex items-center justify-center rounded-xl bg-[#0B5B35] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#073B25]"
        >
          + Usulan Baru
        </Link>
      </div>
      <form method="get" className="grid gap-3 rounded-2xl border border-[#DCE6DF] bg-white p-4 shadow-sm md:grid-cols-[1.5fr_1fr_auto]">
        <div>
          <label htmlFor="q" className="mb-1.5 block text-xs font-semibold text-[#334A3C]">Cari usulan</label>
          <input id="q" name="q" defaultValue={q ?? ""} placeholder="Cari nomor, program, atau kegiatan..." className="form-input" />
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
          {(q || status) && <Link href="/fakultas/usulan-anggaran" className="rounded-xl border border-[#DCE6DF] px-4 py-2.5 text-sm font-semibold text-[#64736A] hover:bg-[#F5F8F5]">Reset</Link>}
        </div>
      </form>
      <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-sm">
          <thead className="border-b border-[#DCE6DF] bg-[#F5F8F5] text-left text-xs uppercase tracking-wide text-[#64736A]">
            <tr>
              <th className="px-4 py-3">No.</th><th className="px-4 py-3">No. Usulan</th><th className="px-4 py-3">Program / Kegiatan</th><th className="px-4 py-3">Total Anggaran</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {proposals?.map((p, index) => (
              <tr key={p.id} className="border-b border-[#EDF2EE] transition hover:bg-[#FAFCFA]">
                <td className="px-4 py-4 text-center text-[#849289]">{index + 1}</td>
                <td className="px-4 py-4 font-bold text-[#0B5B35]">{p.number}</td>
                <td className="px-4 py-4 text-[#44534B]">
                  <p className="font-semibold text-[#17231D]">{p.program}</p>
                  <div className="mt-1 text-xs text-[#849289]">{p.kegiatan || "Kegiatan belum diisi"}</div>
                </td>
                <td className="px-4 py-4 font-semibold text-[#17231D]">
                  Rp {Number(p.total_anggaran ?? p.volume * p.harga_satuan).toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-4">
                  <TableActionLink href={`/fakultas/usulan-anggaran/${p.id}`} />
                </td>
              </tr>
            ))}
            {proposals?.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[#64736A]">
                  Belum ada usulan anggaran.
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
