import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StatusBadge from "@/components/StatusBadge";
import Link from "next/link";
import DocumentUploader from "@/components/DocumentUploader";

export default async function RevisiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: revision } = await supabase
    .from("budget_revisions")
    .select("*, budget_proposals(number)")
    .eq("id", id)
    .single();
  if (!revision) notFound();

  // ...di dalam komponen, setelah query proposal:
  const { data: documents } = await supabase
    .from("budget_documents")
    .select("*")
    .eq("entity_type", "revision")
    .eq("entity_id", id);

  const { data: history } = await supabase
    .from("budget_history")
    .select("*")
    .eq("entity_type", "revision")
    .eq("entity_id", id)
    .order("created_at", { ascending: true });

  const nilaiSebelum = revision.before_volume * revision.before_harga_satuan;
  const nilaiSesudah = revision.after_volume * revision.after_harga_satuan;

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-start mb-2">
        <h1 className="font-serif text-xl font-semibold">{revision.number}</h1>
        {(revision.status === "Perlu Perbaikan" ||
          revision.status === "Ditolak") && (
          <Link
            href={`/fakultas/usulan-revisi/${id}/edit`}
            className="text-[#1B2A4B] text-xs font-semibold hover:underline"
          >
            Edit & Ajukan Ulang
          </Link>
        )}
      </div>
      <p className="text-sm text-[#5B5A55] mb-2">
        Terkait: {(revision as any).budget_proposals?.number}
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

      {revision.catatan_verifikator && (
        <div className="bg-orange-50 text-orange-700 text-sm p-3 rounded-md mb-4">
          <strong>Catatan Verifikator:</strong> {revision.catatan_verifikator}
        </div>
      )}

      <DocumentUploader
        entityType="revision"
        entityId={id}
        facultyId={revision.faculty_id}
        documents={documents ?? []}
        editable={true}
      />

      <div className="bg-white border border-[#E1DDCF] rounded-lg p-4">
        <div className="font-semibold text-sm mb-2">Riwayat</div>
        {history?.map((h) => (
          <div key={h.id} className="text-xs text-[#5B5A55] mb-1">
            {new Date(h.created_at).toLocaleDateString("id-ID")} — {h.event}
          </div>
        ))}
      </div>
    </div>
  );
}
