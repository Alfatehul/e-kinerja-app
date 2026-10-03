import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyAssignment } from "../actions";
import StatusBadge from "@/components/StatusBadge";
import SubmitButton from "@/components/SubmitButton";

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function MonitoringDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: assignment } = await supabase
    .from("indicator_assignments")
    .select("*, indicators(*), faculties(*)")
    .eq("id", id)
    .single();

  if (!assignment) notFound();

  const { data: logs } = await supabase
    .from("realization_log")
    .select("*")
    .eq("assignment_id", id)
    .order("date", { ascending: false });

  const indicator = Array.isArray(assignment.indicators)
    ? assignment.indicators[0]
    : assignment.indicators;
  const faculty = Array.isArray(assignment.faculties)
    ? assignment.faculties[0]
    : assignment.faculties;
  const target = indicator?.target == null ? null : Number(indicator.target);
  const realization = Number(assignment.realization ?? 0);
  const pct =
    target == null
      ? realization > 0
        ? 100
        : 0
      : target > 0
        ? Math.min(100, Math.round((realization / target) * 1000) / 10)
        : 0;

  async function approve() {
    "use server";
    await verifyAssignment(id, "approve");
  }

  async function reject(formData: FormData) {
    "use server";
    await verifyAssignment(id, "reject", String(formData.get("note") ?? ""));
  }

  const canReview = assignment.status === "Diajukan";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <Link href="/admin/monitoring" className="inline-flex items-center gap-2 self-start text-sm font-semibold text-[#64736A] transition hover:text-[#527160]">
        <span aria-hidden="true">←</span> Kembali ke Monitoring &amp; Verifikasi
      </Link>

      <section className="overflow-hidden rounded-3xl border border-[#DCE6DF] bg-white shadow-[0_14px_40px_rgba(23,59,39,0.07)]">
        <div className="bg-gradient-to-r from-[#EEF5F0] via-[#F7FAF7] to-[#F7F3E8] px-5 py-6 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#527160] shadow-sm">{indicator?.code ?? "INDIKATOR"}</span>
                {indicator?.quarter && <span className="rounded-full bg-[#EEF2F5] px-3 py-1 text-xs font-bold text-[#557083]">Triwulan {indicator.quarter}</span>}
              </div>
              <h1 className="mt-4 max-w-3xl text-2xl font-bold leading-tight tracking-tight text-[#26372D] sm:text-3xl">
                {indicator?.name ?? "Detail indikator"}
              </h1>
              <p className="mt-3 flex items-center gap-2 text-sm text-[#64736A]">
                <span className="font-semibold text-[#527160]">{faculty?.code ?? "UNIT"}</span>
                <span>·</span>
                <span>{faculty?.name ?? "Fakultas / Unit tidak ditemukan"}</span>
              </p>
            </div>
            <div className="self-start"><StatusBadge status={assignment.status ?? "Draft"} /></div>
          </div>
        </div>
        <div className="grid divide-y divide-[#E8EFEA] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="px-5 py-5 sm:px-8"><p className="text-xs font-semibold uppercase tracking-wide text-[#849289]">Target</p><p className="mt-2 text-2xl font-bold text-[#34463B]">{target ?? "-"} <span className="text-sm font-medium text-[#849289]">{indicator?.unit ?? ""}</span></p></div>
          <div className="px-5 py-5 sm:px-8"><p className="text-xs font-semibold uppercase tracking-wide text-[#849289]">Realisasi</p><p className="mt-2 text-2xl font-bold text-[#527160]">{realization} <span className="text-sm font-medium text-[#849289]">{assignment.realization_unit ?? indicator?.unit ?? ""}</span></p></div>
          <div className="px-5 py-5 sm:px-8"><p className="text-xs font-semibold uppercase tracking-wide text-[#849289]">Capaian</p><p className="mt-2 text-2xl font-bold text-[#806F43]">{pct}%</p></div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="flex flex-col gap-6">
          <section className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div><p className="text-sm font-bold text-[#34463B]">Progress capaian</p><p className="mt-1 text-xs text-[#849289]">Perbandingan realisasi terhadap target indikator</p></div>
              <span className="text-2xl font-bold text-[#806F43]">{pct}%</span>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#E8EFEA]"><div className="h-full rounded-full bg-gradient-to-r from-[#9AB7A3] to-[#C49A45]" style={{ width: `${pct}%` }} /></div>
            <div className="mt-3 flex justify-between text-xs text-[#849289]"><span>0</span><span>{target ?? "-"} {indicator?.unit ?? ""}</span></div>
          </section>

          {assignment.status === "Ditolak" && assignment.note && (
            <section className="rounded-2xl border border-[#E8C9C5] bg-[#FFF7F6] p-5 text-sm text-[#86615D]">
              <p className="font-bold">Catatan penolakan sebelumnya</p>
              <p className="mt-2 leading-6">{assignment.note}</p>
            </section>
          )}

          <section className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-sm">
            <div className="border-b border-[#E5EEE8] px-5 py-4 sm:px-6"><h2 className="text-base font-bold text-[#34463B]">Riwayat realisasi</h2><p className="mt-1 text-xs text-[#849289]">{logs?.length ?? 0} catatan penambahan realisasi</p></div>
            {logs?.length ? (
              <div className="divide-y divide-[#EDF2EE]">
                {logs.map((log, index) => (
                  <div key={log.id} className="flex gap-4 px-5 py-4 sm:px-6">
                    <div className="flex flex-col items-center"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEF5F0] text-xs font-bold text-[#527160]">{index + 1}</span>{index < logs.length - 1 && <span className="mt-2 h-full w-px bg-[#DCE6DF]" />}</div>
                    <div className="min-w-0 pb-1"><p className="font-bold text-[#34463B]">+{log.amount} {assignment.realization_unit ?? indicator?.unit ?? ""}</p><p className="mt-1 text-xs font-semibold text-[#789182]">{formatDate(log.date)}</p>{log.note && <p className="mt-2 text-sm leading-6 text-[#64736A]">{log.note}</p>}</div>
                  </div>
                ))}
              </div>
            ) : <p className="px-5 py-10 text-center text-sm text-[#849289]">Belum ada riwayat realisasi.</p>}
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <section className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-[#34463B]">Informasi indikator</h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div><dt className="text-xs text-[#849289]">Kategori</dt><dd className="mt-1 font-semibold text-[#53645A]">{indicator?.category ?? "-"}</dd></div>
              <div><dt className="text-xs text-[#849289]">Periode</dt><dd className="mt-1 font-semibold text-[#53645A]">{indicator?.period ?? "-"}</dd></div>
              <div><dt className="text-xs text-[#849289]">Deadline</dt><dd className="mt-1 font-semibold text-[#53645A]">{formatDate(indicator?.deadline ?? null)}</dd></div>
              <div><dt className="text-xs text-[#849289]">Bobot</dt><dd className="mt-1 font-semibold text-[#53645A]">{indicator?.weight ?? "-"}%</dd></div>
            </dl>
          </section>

          {canReview ? (
            <section className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#789182]">Tindakan verifikasi</p>
              <h2 className="mt-1 text-lg font-bold text-[#34463B]">Periksa pengajuan</h2>
              <p className="mt-2 text-sm leading-6 text-[#64736A]">Pastikan realisasi dan dokumen pendukung sudah sesuai sebelum memproses data.</p>
              <form action={approve} className="mt-5"><SubmitButton label="Setujui & verifikasi" loadingLabel="Memverifikasi..." className="w-full px-4 py-3" /></form>
              <div className="my-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-[#A0AAA3]"><span className="h-px flex-1 bg-[#E5EEE8]" />atau<span className="h-px flex-1 bg-[#E5EEE8]" /></div>
              <form action={reject} className="space-y-3"><textarea name="note" required placeholder="Tuliskan alasan penolakan..." className="min-h-24 w-full resize-y rounded-xl border border-[#DCE6DF] px-3 py-2.5 text-sm outline-none focus:border-[#C49A45]" /><SubmitButton label="Tolak pengajuan" loadingLabel="Memproses penolakan..." variant="secondary" className="w-full border-[#D9B4AF] bg-[#FFF7F6] px-4 py-3 text-[#86615D] hover:bg-[#FBEDEA]" /></form>
            </section>
          ) : (
            <section className="rounded-2xl border border-[#DCE6DF] bg-[#F8FBF8] p-5"><p className="text-sm font-bold text-[#34463B]">Verifikasi selesai</p><p className="mt-2 text-sm leading-6 text-[#64736A]">Data ini sudah diproses dengan status <strong>{assignment.status}</strong>.</p></section>
          )}
        </aside>
      </div>
    </div>
  );
}
