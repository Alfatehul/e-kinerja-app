import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";

export default async function UsulanRevisiFakultasPage() {
  const session = await getCurrentProfile();
  const supabase = await createClient();

  const { data: revisions } = await supabase
    .from("budget_revisions")
    .select("*, budget_proposals(number)")
    .eq("faculty_id", session!.profile.faculty_id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-serif text-xl font-semibold">Usulan Revisi</h1>
        <Link
          href="/fakultas/usulan-revisi/tambah"
          className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md"
        >
          + Ajukan Revisi
        </Link>
      </div>
      <div className="bg-white border border-[#E1DDCF] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#EEF0F5] text-left">
            <tr>
              <th className="p-3">No. Revisi</th>
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
                      href={`/fakultas/usulan-revisi/${r.id}`}
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
                <td colSpan={5} className="p-6 text-center text-[#5B5A55]">
                  Belum ada usulan revisi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
