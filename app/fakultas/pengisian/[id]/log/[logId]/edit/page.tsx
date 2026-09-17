import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function recomputeRealization(assignmentId: string) {
  const supabase = await createClient();
  const { data: logs } = await supabase
    .from("realization_log")
    .select("amount")
    .eq("assignment_id", assignmentId);
  const total = (logs ?? []).reduce((sum, l) => sum + Number(l.amount), 0);
  await supabase
    .from("indicator_assignments")
    .update({ realization: total })
    .eq("id", assignmentId);
}

export default async function EditLogPage({
  params,
}: {
  params: Promise<{ id: string; logId: string }>;
}) {
  const { id, logId } = await params;
  const supabase = await createClient();

  const { data: log } = await supabase
    .from("realization_log")
    .select("*")
    .eq("id", logId)
    .single();
  if (!log) notFound();

  async function updateLog(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const { error } = await supabase
      .from("realization_log")
      .update({
        amount: Number(formData.get("amount")),
        date: formData.get("date") as string,
        note: formData.get("note") as string,
      })
      .eq("id", logId);

    if (error) throw new Error(error.message);

    await recomputeRealization(id);
    redirect(`/fakultas/pengisian/${id}`);
  }

  return (
    <div className="max-w-md">
      <h1 className="font-serif text-xl font-semibold mb-4">
        Edit Entri Realisasi
      </h1>
      <form
        action={updateLog}
        className="bg-white border border-[#E1DDCF] rounded-lg p-6 flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">Jumlah</label>
          <input
            name="amount"
            type="number"
            step="any"
            required
            defaultValue={log.amount}
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Tanggal</label>
          <input
            name="date"
            type="date"
            required
            defaultValue={log.date}
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Keterangan</label>
          <textarea
            name="note"
            defaultValue={log.note ?? ""}
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md self-start"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
