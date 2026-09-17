import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyAssignment } from "../actions";

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

  const pct = assignment.indicators.target
    ? Math.min(
        100,
        Math.round(
          (assignment.realization / assignment.indicators.target) * 1000,
        ) / 10,
      )
    : 0;

  async function approve() {
    "use server";
    await verifyAssignment(id, "approve");
  }

  async function reject(formData: FormData) {
    "use server";
    await verifyAssignment(id, "reject", formData.get("note") as string);
  }

  const canReview = assignment.status === "Diajukan";

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-xl font-semibold mb-1">
        {assignment.indicators.code} — {assignment.indicators.name}
      </h1>
      <p className="text-sm text-[#5B5A55] mb-4">
        {assignment.faculties.name} · Status: {assignment.status}
      </p>

      <div className="bg-white border border-[#E1DDCF] rounded-lg p-4 mb-4">
        <div className="text-sm text-[#5B5A55] mb-1">Target vs Realisasi</div>
        <div className="font-serif text-2xl font-bold">
          {assignment.realization} / {assignment.indicators.target}{" "}
          {assignment.indicators.unit}
          <span className="text-sm font-normal text-[#5B5A55]"> ({pct}%)</span>
        </div>
      </div>

      {assignment.status === "Ditolak" && assignment.note && (
        <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md mb-4">
          <strong>Catatan penolakan sebelumnya:</strong> {assignment.note}
        </div>
      )}

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
            className="p-3 border-t border-[#E1DDCF] text-sm first:border-t-0"
          >
            <div className="font-semibold text-[#1B2A4B]">
              +{l.amount} {assignment.indicators.unit}
            </div>
            <div className="text-xs text-[#5B5A55]">
              {l.date} {l.note && `· ${l.note}`}
            </div>
          </div>
        ))}
      </div>

      {canReview ? (
        <div className="flex gap-3 items-start">
          <form action={approve}>
            <button
              type="submit"
              className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md"
            >
              Setujui
            </button>
          </form>

          <form action={reject} className="flex gap-2 items-start">
            <textarea
              name="note"
              required
              placeholder="Alasan penolakan (wajib)"
              className="border border-[#E1DDCF] rounded-md p-2 text-sm w-64"
            />
            <button
              type="submit"
              className="bg-red-600 text-white text-sm px-4 py-2 rounded-md"
            >
              Tolak
            </button>
          </form>
        </div>
      ) : (
        <p className="text-sm text-[#5B5A55]">
          Data ini sudah diproses sebelumnya (status: {assignment.status}),
          tidak perlu ditinjau lagi.
        </p>
      )}
    </div>
  );
}
