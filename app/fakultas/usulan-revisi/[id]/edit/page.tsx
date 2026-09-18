import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateRevision } from "../../actions";

export default async function EditRevisiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: revision } = await supabase
    .from("budget_revisions")
    .select("*")
    .eq("id", id)
    .single();
  if (!revision) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateRevision(id, formData);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-xl font-semibold mb-4">
        Edit Usulan Revisi
      </h1>
      <form
        action={handleUpdate}
        className="bg-white border border-[#E1DDCF] rounded-lg p-6 flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">
            Jenis Revisi
          </label>
          <input
            name="jenis_revisi"
            required
            defaultValue={revision.jenis_revisi}
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Uraian Setelah Revisi
          </label>
          <textarea
            name="after_uraian"
            required
            defaultValue={revision.after_uraian}
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm min-h-[60px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Volume Baru
            </label>
            <input
              name="after_volume"
              type="number"
              required
              defaultValue={revision.after_volume}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Harga Satuan Baru (Rp)
            </label>
            <input
              name="after_harga_satuan"
              type="number"
              required
              defaultValue={revision.after_harga_satuan}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Alasan Revisi
          </label>
          <textarea
            name="alasan_revisi"
            required
            defaultValue={revision.alasan_revisi}
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm min-h-[60px]"
          />
        </div>
        <button
          type="submit"
          className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md self-start"
        >
          Simpan & Ajukan Ulang
        </button>
      </form>
    </div>
  );
}
