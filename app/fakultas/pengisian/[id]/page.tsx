import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  addRealization,
  cancelSubmission,
  submitForVerification,
} from "../actions";
import DeleteRealizationButton from "@/components/DeleteRealizationButton";
import { updateDocumentLink } from "../actions";
import StatusBadge from "@/components/StatusBadge";
import SubmitButton from "@/components/SubmitButton";
import FormModal from "@/components/FormModal";
import EditLogPage from "./log/[logId]/edit/page";

const realizationUnits = [
  "tahun",
  "orang",
  "OB",
  "OLT",
  "OH",
  "LS",
  "paket",
  "meter",
  "unit",
  "OM",
  "SKS",
  "TM",
  "buah",
  "semester",
  "prodi",
  "bulan",
  "artikel",
  "index",
  "judul",
  "%",
];

function getTodayJakarta() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export default async function PengisianDetailPage({
  params,
  returnTo = "",
}: {
  params: Promise<{ id: string }>;
  returnTo?: string;
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
  const today = getTodayJakarta();
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
    await updateDocumentLink(
      id,
      formData.get("document_link") as string,
      formData.get("return_path") as string,
    );
  }
  async function handleSubmit(formData: FormData) {
    "use server";
    await submitForVerification(id, formData.get("return_path") as string);
  }
  async function handleCancelSubmission(formData: FormData) {
    "use server";
    await cancelSubmission(id, formData.get("return_path") as string);
  }

  return (
    <div className="mx-auto flex w-full max-w-full flex-col gap-4 pb-2">
      <div className="pr-12">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-[#EAF3ED] px-2.5 py-1 text-xs font-bold text-[#0B5B35]">
            {assignment.indicators.code}
          </span>
          {assignment.indicators.quarter && (
            <span className="rounded-lg bg-[#EEF2F5] px-2.5 py-1 text-xs font-semibold text-[#557083]">
              Triwulan {assignment.indicators.quarter}
            </span>
          )}
            <StatusBadge status={assignment.status} />
        </div>
        <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight text-[#17231D] sm:text-xl">
          {assignment.indicators.name}
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="min-w-0 rounded-xl border border-[#DCE6DF] bg-white p-3 sm:rounded-2xl sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#849289] sm:text-xs">Target</p>
          <p className="mt-1.5 break-words text-base font-bold leading-tight text-[#334A3C] sm:text-lg">
            {assignment.indicators.target ?? "-"}{" "}
            <span className="text-xs font-semibold text-[#64736A] sm:text-sm">{assignment.indicators.unit}</span>
          </p>
        </div>
        <div className="min-w-0 rounded-xl border border-[#B9D7C1] bg-[#F1F8F3] p-3 sm:rounded-2xl sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#64736A] sm:text-xs">Realisasi</p>
          <p className="mt-1.5 break-words text-base font-bold leading-tight text-[#0B5B35] sm:text-lg">
            {assignment.realization ?? 0}{" "}
            <span className="text-xs font-semibold text-[#527160] sm:text-sm">{assignment.realization_unit ?? assignment.indicators.unit ?? ""}</span>
          </p>
        </div>
        <div className="min-w-0 rounded-xl border border-[#DCE6DF] bg-white p-3 sm:rounded-2xl sm:p-4">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#849289] sm:text-xs">Capaian</p>
          <p className="mt-1.5 text-base font-bold leading-tight text-[#334A3C] sm:text-lg">{pct}%</p>
        </div>
      </div>

      {assignment.status === "Ditolak" && assignment.note && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-bold">Catatan dari Admin Biro</p>
          <p className="mt-1 leading-5">{assignment.note}</p>
        </div>
      )}

      {editable && (
        <form
          action={handleAdd}
          className="flex flex-col gap-4 rounded-2xl border border-[#DCE6DF] bg-white p-4 sm:p-5"
        >
          <div className="border-b border-[#EDF2EE] pb-3">
            <h3 className="text-sm font-bold text-[#17231D]">Tambah realisasi</h3>
            <p className="mt-1 text-xs leading-5 text-[#849289]">Isi jumlah, satuan, dan tanggal realisasi.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#334A3C]">Jumlah realisasi</label>
              <input
                name="amount"
                type="number"
                step="any"
                required
                className="form-input"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#334A3C]">Satuan realisasi</label>
              <select
                name="realization_unit"
                required
                defaultValue={assignment.realization_unit ?? assignment.indicators.unit ?? ""}
                className="form-input"
              >
                <option value="" disabled>
                  Pilih satuan
                </option>
                {assignment.realization_unit &&
                  !realizationUnits.includes(assignment.realization_unit) && (
                    <option value={assignment.realization_unit}>
                      {assignment.realization_unit}
                    </option>
                  )}
                {realizationUnits.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#334A3C]">Tanggal</label>
              <input
                name="date"
                type="date"
                defaultValue={today}
                className="form-input"
              />
            </div>
          </div>
          {returnTo && <input type="hidden" name="return_path" value={returnTo} />}
          <SubmitButton label="Tambah realisasi" loadingLabel="Menyimpan..." className="self-start px-4 py-2.5" />
        </form>
      )}

      <form
        action={handleLinkSave}
        className="flex flex-col gap-3 rounded-2xl border border-[#DCE6DF] bg-white p-4 sm:flex-row sm:items-end sm:p-5"
      >
        {returnTo && <input type="hidden" name="return_path" value={returnTo} />}
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold text-[#334A3C]">
            Link Dokumen Pendukung <span className="text-red-600">*</span>
          </label>
          <input
            name="document_link"
            type="url"
            defaultValue={assignment.document_link ?? ""}
            placeholder="https://drive.google.com/..."
            className="form-input"
            required
          />
        </div>
        <SubmitButton label="Simpan link" loadingLabel="Menyimpan..." className="px-4 py-2.5" />
      </form>

      <div className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#DCE6DF] bg-[#F8FBF8] px-4 py-3">
          <h3 className="text-sm font-bold text-[#17231D]">Riwayat realisasi</h3>
          <span className="text-xs text-[#849289]">{logs?.length ?? 0} entri</span>
        </div>
        {logs?.length === 0 && (
          <p className="px-4 py-5 text-center text-xs text-[#849289]">Belum ada riwayat realisasi.</p>
        )}
        {logs?.map((l) => (
          <div
            key={l.id}
            className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E8EFEA] px-4 py-3 text-sm first:border-t-0"
          >
            <div>
              <div className="text-sm font-bold text-[#0B5B35]">
                +{l.amount} {assignment.realization_unit ?? assignment.indicators.unit ?? ""}
              </div>
              <div className="mt-0.5 text-xs text-[#849289]">{l.date}</div>
            </div>
            {editable && (
              <div className="flex items-center gap-3">
                <FormModal
                  label="Edit"
                  title="Edit entri realisasi"
                  className="text-xs font-bold text-[#0B5B35] hover:underline"
                >
                  <EditLogPage
                    params={Promise.resolve({ id, logId: l.id })}
                    returnTo={returnTo}
                  />
                </FormModal>
                <DeleteRealizationButton assignmentId={id} logId={l.id} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        {assignment.status === "Diajukan" && (
          <form action={handleCancelSubmission}>
            {returnTo && <input type="hidden" name="return_path" value={returnTo} />}
            <SubmitButton label="Batal Ajukan" loadingLabel="Membatalkan..." variant="secondary" className="px-5 py-3" />
          </form>
        )}
        {editable && (
          <form action={handleSubmit}>
            {returnTo && <input type="hidden" name="return_path" value={returnTo} />}
            <SubmitButton label="Ajukan Verifikasi" loadingLabel="Mengajukan..." className="px-5 py-3" />
          </form>
        )}
      </div>
    </div>
  );
}
