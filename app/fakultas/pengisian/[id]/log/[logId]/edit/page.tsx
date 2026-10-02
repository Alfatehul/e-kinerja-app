import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SubmitButton from "@/components/SubmitButton";

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
  returnTo = "",
}: {
  params: Promise<{ id: string; logId: string }>;
  returnTo?: string;
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
      })
      .eq("id", logId);

    if (error) throw new Error(error.message);

    await recomputeRealization(id);
    const returnPath =
      formData.get("return_path") === "/fakultas/pengisian"
        ? "/fakultas/pengisian"
        : `/fakultas/pengisian/${id}`;
    redirect(
      `${returnPath}?notice=${encodeURIComponent("Realisasi berhasil diperbarui.")}&modal=closed`,
    );
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
        {returnTo && (
          <input type="hidden" name="return_path" value={returnTo} />
        )}
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
        <SubmitButton label="Simpan Perubahan" loadingLabel="Menyimpan..." className="self-start rounded-md px-4 py-2" />
      </form>
    </div>
  );
}
