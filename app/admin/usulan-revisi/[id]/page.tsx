import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyRevision } from "../actions";
import StatusBadge from "@/components/StatusBadge";

export default async function RevisiDetailAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: revision } = await supabase
    .from("budget_revisions")
    .select("*, faculties(name), budget_proposals(number)")
    .eq("id", id)
    .single();
  if (!revision) notFound();

  const { data: history } = await supabase
    .from("budget_history")
    .select("*")
    .eq("entity_type", "revision")
    .eq("entity_id", id)
    .order("created_at", { ascending: true });

  const nilaiSebelum = revision.before_volume * revision.before_harga_satuan;
  const nilaiSesudah = revision.after_volume * revision.after_harga_satuan;
  const canReview =
    revision.status === "Diajukan" || revision.status === "Diverifikasi";

  async function approve(formData: FormData) {
    "use server";
    await verifyRevision(
      id,
      "Disetujui",
      (formData.get("note") as string) || "Disetujui.",
    );
  }
  async function reject(formData: FormData) {
    "use server";
    await verifyRevision(id, "Ditolak", formData.get("note") as string);
  }
  async function requestFix(formData: FormData) {
    "use server";
    await verifyRevision(id, "Perlu Perbaikan", formData.get("note") as string);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-xl font-semibold">{revision.number}</h1>
      <p className="text-sm text-[#5B5A55] mb-2">
        {(revision as any).faculties.name} · Terkait:{" "}
        {(revision as any).budget_proposals?.number}
      </p>
      <div className="mb-4">
        <StatusBadge status={revision.status} />
      </div>

      <div className="bg-white border border-[#E1DDCF] rounded-lg p-4 mb-4 text-sm">
        <div className="mb-2">
          <strong>Jenis Revisi:</strong> {revision.jenis_revisi}
        </div>
        <div>
          <strong>Alasan:</strong> {revision.alasan_revisi}
        </div>
      </div>

      <table className="w-full text-sm border-collapse mb-4">
        <thead>
          <tr className="bg-[#EEF0F5]">
            <th className="p-2 text-left">Komponen</th>
            <th className="p-2 text-right">Sebelum</th>
            <th className="p-2 text-right">Sesudah</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-[#E1DDCF]">
            <td className="p-2">{revision.after_uraian}</td>
            <td className="p-2 text-right">
              Rp {Number(nilaiSebelum).toLocaleString("id-ID")}
            </td>
            <td className="p-2 text-right font-bold text-[#1B2A4B]">
              Rp {Number(nilaiSesudah).toLocaleString("id-ID")}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="bg-white border border-[#E1DDCF] rounded-lg p-4 mb-4">
        <div className="font-semibold text-sm mb-2">Riwayat</div>
        {history?.map((h) => (
          <div key={h.id} className="text-xs text-[#5B5A55] mb-1">
            {new Date(h.created_at).toLocaleDateString("id-ID")} — {h.event}
          </div>
        ))}
      </div>

      {canReview && (
        <div className="bg-white border border-[#E1DDCF] rounded-lg p-4">
          <div className="font-semibold text-sm mb-2">Tindakan Verifikasi</div>
          <form className="flex flex-col gap-3">
            <textarea
              name="note"
              placeholder="Catatan verifikator (wajib untuk Tolak / Perlu Perbaikan)"
              className="border border-[#E1DDCF] rounded-md p-2 text-sm min-h-[60px]"
            />
            <div className="flex gap-2 flex-wrap">
              <button
                formAction={approve}
                className="bg-green-700 text-white text-sm px-4 py-2 rounded-md"
              >
                Setujui
              </button>
              <button
                formAction={requestFix}
                className="bg-amber-600 text-white text-sm px-4 py-2 rounded-md"
              >
                Perlu Perbaikan
              </button>
              <button
                formAction={reject}
                className="bg-red-600 text-white text-sm px-4 py-2 rounded-md"
              >
                Tolak
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
