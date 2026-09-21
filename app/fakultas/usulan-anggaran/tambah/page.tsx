import { createProposal } from "../actions";

export default function TambahUsulanPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">
          Pengajuan anggaran
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">
          Usulan Anggaran Baru
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64736A]">
          Lengkapi rincian kebutuhan anggaran unit Anda. Data akan disimpan
          sebagai draft dan dapat diajukan setelah ditinjau kembali.
        </p>
      </div>
      <form
        action={createProposal}
        className="flex flex-col gap-6 rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-7"
      >
        <div className="border-b border-[#EDF2EE] pb-5">
          <h2 className="text-base font-bold text-[#17231D]">Informasi dasar</h2>
          <p className="mt-1 text-xs text-[#849289]">Identitas utama usulan dan program yang diajukan.</p>
        </div>
        <div>
          <label htmlFor="year" className="mb-2 block text-sm font-semibold text-[#334A3C]">Tahun Anggaran</label>
          <input
            id="year"
            name="year"
            defaultValue="2026"
            required
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="program" className="mb-2 block text-sm font-semibold text-[#334A3C]">Program</label>
          <input
            id="program"
            name="program"
            required
            placeholder="Nama program"
            className="form-input"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="kegiatan" className="mb-2 block text-sm font-semibold text-[#334A3C]">Kegiatan</label>
            <input
              id="kegiatan"
              name="kegiatan"
              placeholder="Nama kegiatan"
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="subkegiatan" className="mb-2 block text-sm font-semibold text-[#334A3C]">Subkegiatan</label>
            <input
              id="subkegiatan"
              name="subkegiatan"
              placeholder="Nama subkegiatan"
              className="form-input"
            />
          </div>
        </div>
        <div className="border-t border-[#EDF2EE] pt-6">
          <h2 className="text-base font-bold text-[#17231D]">Rincian kebutuhan</h2>
          <p className="mt-1 text-xs text-[#849289]">Jelaskan kebutuhan secara singkat, jelas, dan terukur.</p>
        </div>
        <div>
          <label htmlFor="uraian" className="mb-2 block text-sm font-semibold text-[#334A3C]">Uraian Kebutuhan</label>
          <textarea
            id="uraian"
            name="uraian"
            required
            placeholder="Contoh: Pengadaan perangkat pendukung kegiatan..."
            className="form-input min-h-[110px] resize-y"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="volume" className="mb-2 block text-sm font-semibold text-[#334A3C]">Volume</label>
            <input
              id="volume"
              name="volume"
              type="number"
              required
              defaultValue={1}
              min="1"
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="satuan" className="mb-2 block text-sm font-semibold text-[#334A3C]">Satuan</label>
            <input
              id="satuan"
              name="satuan"
              placeholder="Unit / paket"
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="harga_satuan" className="mb-2 block text-sm font-semibold text-[#334A3C]">Harga Satuan (Rp)</label>
            <input
              id="harga_satuan"
              name="harga_satuan"
              type="number"
              required
              defaultValue={0}
              min="0"
              className="form-input"
            />
          </div>
        </div>
        <div>
          <label htmlFor="sumber_dana" className="mb-2 block text-sm font-semibold text-[#334A3C]">Sumber Dana</label>
          <input
            id="sumber_dana"
            name="sumber_dana"
            placeholder="BOPTN / BLU / dsb."
            className="form-input"
          />
        </div>
        <div className="rounded-2xl border border-dashed border-[#B8D8C1] bg-[#F5FAF6] p-5">
          <label htmlFor="document" className="block text-sm font-bold text-[#173B27]">
            Dokumen Pendukung <span className="font-normal text-[#718078]">(opsional)</span>
          </label>
          <p className="mt-1 text-xs text-[#64736A]">
            PDF, Word, atau Excel. Ukuran maksimal 10 MB.
          </p>
          <input
            id="document"
            name="document"
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            className="mt-3 block w-full cursor-pointer rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-sm text-[#44534B] file:mr-3 file:rounded-md file:border-0 file:bg-[#E5F5E9] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#0B5B35]"
          />
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-[#EDF2EE] pt-5 sm:flex-row sm:justify-end">
          <a href="/fakultas/usulan-anggaran" className="rounded-xl border border-[#DCE6DF] px-5 py-3 text-center text-sm font-semibold text-[#64736A] transition hover:bg-[#F5F8F5]">Batal</a>
          <button type="submit" className="rounded-xl bg-[#0B5B35] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#073B25]">Simpan sebagai draft</button>
        </div>
      </form>
    </div>
  );
}
