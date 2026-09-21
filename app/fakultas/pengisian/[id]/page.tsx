import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  addRealization,
  cancelSubmission,
  submitForVerification,
} from "../actions";
import DeleteRealizationButton from "@/components/DeleteRealizationButton";
import { updateDocumentLink } from "../actions";
import StatusBadge from "@/components/StatusBadge";

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
  async function handleCancelSubmission() {
    "use server";
    await cancelSubmission(id);
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0B5B35]">
          Pengisian indikator
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">
          {assignment.indicators.code}
        </h1>
        <p className="mt-2 text-sm text-[#64736A]">
          {assignment.indicators.name}
        </p>
        <div className="mt-3">
          <StatusBadge status={assignment.status} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[#849289]">Target</p>
          <p className="mt-2 text-xl font-bold text-[#334A3C]">{assignment.indicators.target} {assignment.indicators.unit}</p>
        </div>
        <div className="rounded-2xl border border-[#B9D7C1] bg-[#F1F8F3] p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[#64736A]">Realisasi</p>
          <p className="mt-2 text-xl font-bold text-[#0B5B35]">{assignment.realization} {assignment.indicators.unit}</p>
        </div>
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wide text-[#849289]">Capaian</p>
          <p className="mt-2 text-xl font-bold text-[#334A3C]">{pct}%</p>
        </div>
      </div>

      {assignment.status === "Ditolak" && assignment.note && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          <p className="font-bold">Ditolak Admin Biro</p>
          <p className="mt-1 leading-6">{assignment.note}</p>
        </div>
      )}

      {editable && (
        <form
          action={handleAdd}
          className="flex flex-col gap-5 rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="border-b border-[#EDF2EE] pb-4">
            <h2 className="text-base font-bold text-[#17231D]">Tambah realisasi</h2>
            <p className="mt-1 text-xs text-[#849289]">Masukkan capaian terbaru indikator.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#334A3C]">Jumlah</label>
              <input
                name="amount"
                type="number"
                step="any"
                required
                className="form-input"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#334A3C]">Tanggal</label>
              <input
                name="date"
                type="date"
                required
                className="form-input"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#334A3C]">Keterangan</label>
            <textarea
              name="note"
              rows={3}
              className="form-input resize-y"
            />
          </div>
          <button
            type="submit"
            className="self-start rounded-xl bg-[#0B5B35] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#073B25]"
          >
            + Tambah Realisasi
          </button>
        </form>
      )}

      <form
        action={handleLinkSave}
        className="flex flex-col gap-4 rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:flex-row sm:items-end sm:p-6"
      >
        <div className="flex-1">
          <label className="mb-2 block text-sm font-semibold text-[#334A3C]">Link Dokumen Pendukung <span className="font-normal text-[#849289]">(opsional)</span></label>
          <input
            name="document_link"
            type="url"
            defaultValue={assignment.document_link ?? ""}
            placeholder="https://drive.google.com/..."
            className="form-input"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-[#0B5B35] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#073B25]"
        >
          Simpan Link
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
        <div className="border-b border-[#DCE6DF] bg-[#F8FBF8] px-5 py-4">
          <h2 className="text-base font-bold text-[#17231D]">Riwayat realisasi</h2>
        </div>
        {logs?.length === 0 && (
          <p className="px-5 py-8 text-sm text-[#849289]">Belum ada riwayat.</p>
        )}
        {logs?.map((l) => (
          <div
            key={l.id}
            className="flex items-center justify-between border-t border-[#E8EFEA] px-5 py-4 text-sm first:border-t-0"
          >
            <div>
              <div className="font-semibold text-[#0B5B35]">
                +{l.amount} {assignment.indicators.unit}
              </div>
              <div className="text-xs text-[#849289]">
                {l.date} {l.note && `· ${l.note}`}
              </div>
            </div>
            {editable && (
              <div className="flex gap-3">
                <Link
                  href={`/fakultas/pengisian/${id}/log/${l.id}/edit`}
                  className="text-xs font-bold text-[#0B5B35] hover:underline"
                >
                  Edit
                </Link>
                <DeleteRealizationButton assignmentId={id} logId={l.id} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        {assignment.status === "Diajukan" && (
          <form action={handleCancelSubmission}>
            <button
              type="submit"
              className="rounded-xl border border-[#D5E1D8] bg-white px-5 py-3 text-sm font-bold text-[#52645A] shadow-sm hover:bg-[#F4F8F5]"
            >
              Batal Ajukan
            </button>
          </form>
        )}
        {editable && (
          <form action={handleSubmit}>
            <button
              type="submit"
              className="rounded-xl bg-[#0B5B35] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#073B25]"
            >
              Ajukan Verifikasi
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
