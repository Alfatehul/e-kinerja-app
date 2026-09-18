import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { addRealization, submitForVerification } from "../actions";
import DeleteRealizationButton from "@/components/DeleteRealizationButton";
import { updateDocumentLink } from "../actions";

export default async function PengisianDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: assignment } = await supabase
    .from("indicator_assignments")
    .select("*, indicators(*)")
    .eq("id", id)
    .single();

  if (!assignment) notFound();

  const { data: logs } = await supabase
    .from("realization_log")
    .select("*")
    .eq("assignment_id", id)
    .order("date", { ascending: false });

  const editable = ["Belum Diisi", "Draft", "Ditolak"].includes(
    assignment.status,
  );
  const pct = assignment.indicators.target
    ? Math.min(
        100,
        Math.round(
          (assignment.realization / assignment.indicators.target) * 1000,
        ) / 10,
      )
    : 0;

  async function handleAdd(formData: FormData) {
    "use server";
    await addRealization(id, formData);
  }
  async function handleLinkSave(formData: FormData) {
    "use server";
    await updateDocumentLink(id, formData.get("document_link") as string);
  }
  async function handleSubmit() {
    "use server";
    await submitForVerification(id);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-xl font-semibold mb-1">
        {assignment.indicators.code} — {assignment.indicators.name}
      </h1>
      <p className="text-sm text-[#5B5A55] mb-4">
        Target: {assignment.indicators.target} {assignment.indicators.unit} ·
        Status: {assignment.status}
      </p>

      <div className="bg-white border border-[#E1DDCF] rounded-lg p-4 mb-4">
        <div className="text-sm text-[#5B5A55] mb-1">
          Total Realisasi Saat Ini
        </div>
        <div className="font-serif text-2xl font-bold">
          {assignment.realization} {assignment.indicators.unit}{" "}
          <span className="text-sm font-normal text-[#5B5A55]">({pct}%)</span>
        </div>
      </div>

      {assignment.status === "Ditolak" && assignment.note && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md mb-4">
          <strong>Ditolak Admin Biro:</strong> {assignment.note}
        </div>
      )}

      {editable && (
        <form
          action={handleAdd}
          className="bg-white border border-[#E1DDCF] rounded-lg p-4 flex flex-col gap-3 mb-4"
        >
          <div className="font-semibold text-sm">Tambah Realisasi</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Jumlah</label>
              <input
                name="amount"
                type="number"
                step="any"
                required
                className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Tanggal
              </label>
              <input
                name="date"
                type="date"
                required
                className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Keterangan
            </label>
            <textarea
              name="note"
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-[#B8862E] text-white text-sm px-4 py-2 rounded-md self-start"
          >
            + Tambah Realisasi
          </button>
        </form>
      )}

      <form
        action={handleLinkSave}
        className="bg-white border border-[#E1DDCF] rounded-lg p-4 mb-4 flex gap-2 items-end"
      >
        <div className="flex-1">
          <label className="block text-xs font-semibold mb-1">
            Link Dokumen Pendukung (opsional)
          </label>
          <input
            name="document_link"
            type="url"
            defaultValue={assignment.document_link ?? ""}
            placeholder="https://drive.google.com/..."
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md"
        >
          Simpan Link
        </button>
      </form>

      <div className="bg-white border border-[#E1DDCF] rounded-lg overflow-hidden mb-4">
        <div className="p-3 font-semibold text-sm border-b border-[#E1DDCF]">
          Riwayat Penambahan Realisasi
        </div>
        {logs?.length === 0 && (
          <p className="p-4 text-sm text-[#5B5A55]">Belum ada riwayat.</p>
        )}
        {logs?.map((l) => (
          <div
            key={l.id}
            className="flex justify-between items-center p-3 border-t border-[#E1DDCF] text-sm first:border-t-0"
          >
            <div>
              <div className="font-semibold text-[#1B2A4B]">
                +{l.amount} {assignment.indicators.unit}
              </div>
              <div className="text-xs text-[#5B5A55]">
                {l.date} {l.note && `· ${l.note}`}
              </div>
            </div>
            {editable && (
              <div className="flex gap-3">
                <Link
                  href={`/fakultas/pengisian/${id}/log/${l.id}/edit`}
                  className="text-[#1B2A4B] text-xs font-semibold hover:underline"
                >
                  Edit
                </Link>
                <DeleteRealizationButton assignmentId={id} logId={l.id} />
              </div>
            )}
          </div>
        ))}
      </div>

      {editable && (
        <form action={handleSubmit}>
          <button
            type="submit"
            className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md"
          >
            Ajukan Verifikasi
          </button>
        </form>
      )}
    </div>
  );
}
