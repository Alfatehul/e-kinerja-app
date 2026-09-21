import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";
import TableActionLink from "@/components/TableActionLink";

export default async function UsulanRevisiFakultasPage() {
  const session = await getCurrentProfile();
  const supabase = await createClient();

  const { data: revisions } = await supabase
    .from("budget_revisions")
    .select("*, budget_proposals(number)")
    .eq("faculty_id", session!.profile.faculty_id)
    .order("created_at", { ascending: false });

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
      <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-sm">
          <thead className="border-b border-[#DCE6DF] bg-[#F5F8F5] text-left text-xs uppercase tracking-wide text-[#64736A]">
            <tr>
              <th className="px-4 py-3">No. Revisi</th><th className="px-4 py-3">Usulan Terkait</th><th className="px-4 py-3">Selisih</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {revisions?.map((r: any) => {
              const selisih =
                r.after_volume * r.after_harga_satuan -
                r.before_volume * r.before_harga_satuan;
              return (
                <tr key={r.id} className="border-b border-[#EDF2EE] transition hover:bg-[#FAFCFA]">
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
                <td colSpan={5} className="px-4 py-12 text-center text-[#64736A]">
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
