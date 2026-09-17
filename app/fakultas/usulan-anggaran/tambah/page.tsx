import { createProposal } from "../actions";

export default function TambahUsulanPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-xl font-semibold mb-4">
        Usulan Anggaran Baru
      </h1>
      <form
        action={createProposal}
        className="bg-white border border-[#E1DDCF] rounded-lg p-6 flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">
            Tahun Anggaran
          </label>
          <input
            name="year"
            defaultValue="2026"
            required
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Program</label>
          <input
            name="program"
            required
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Kegiatan</label>
            <input
              name="kegiatan"
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Subkegiatan
            </label>
            <input
              name="subkegiatan"
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
              defaultValue={1}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Satuan</label>
            <input
              name="satuan"
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
              defaultValue={0}
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
            placeholder="BOPTN / BLU / dsb."
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md self-start"
        >
          Simpan sebagai Draft
        </button>
      </form>
    </div>
  );
}
