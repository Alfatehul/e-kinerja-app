import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProposal } from "../../actions";

export default async function EditUsulanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: proposal } = await supabase
    .from("budget_proposals")
    .select("*")
    .eq("id", id)
    .single();
  if (!proposal) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateProposal(id, formData);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-xl font-semibold mb-4">
        Edit Usulan Anggaran
      </h1>
      <form
        action={handleUpdate}
        className="bg-white border border-[#E1DDCF] rounded-lg p-6 flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">Program</label>
          <input
            name="program"
            required
            defaultValue={proposal.program}
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Kegiatan</label>
            <input
              name="kegiatan"
              defaultValue={proposal.kegiatan}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Subkegiatan
            </label>
            <input
              name="subkegiatan"
              defaultValue={proposal.subkegiatan}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Uraian Kebutuhan
          </label>
          <textarea
            name="uraian"
            required
            defaultValue={proposal.uraian}
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm min-h-[70px]"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Volume</label>
            <input
              name="volume"
              type="number"
              required
              defaultValue={proposal.volume}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Satuan</label>
            <input
              name="satuan"
              defaultValue={proposal.satuan}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Harga Satuan (Rp)
            </label>
            <input
              name="harga_satuan"
              type="number"
              required
              defaultValue={proposal.harga_satuan}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Sumber Dana
          </label>
          <input
            name="sumber_dana"
            defaultValue={proposal.sumber_dana}
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
