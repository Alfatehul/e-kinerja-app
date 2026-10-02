import Link from "next/link";
import { createProposal } from "../actions";
import SubmitButton from "@/components/SubmitButton";

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
        Lengkapi kebutuhan anggaran unit Anda. Data akan disimpan
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
        <div className="border-t border-[#EDF2EE] pt-6">
          <h2 className="text-base font-bold text-[#17231D]">Klasifikasi anggaran</h2>
          <p className="mt-1 text-xs text-[#849289]">Lengkapi struktur program, kegiatan, dan keluaran yang diajukan.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ["kementerian_lembaga", "Kementerian Negara / Lembaga"],
            ["unit_eselon", "Unit Eselon I / II"],
            ["satker", "Satker"],
            ["sasaran_kegiatan", "Sasaran Kegiatan"],
            ["klasifikasi_rincian_output", "Klasifikasi Rincian Output"],
            ["rincian_output", "Rincian Output"],
            ["indikator_ro", "Indikator RO"],
            ["satuan_ukuran_keluaran", "Satuan Ukuran Keluaran"],
          ].map(([name, label]) => (
            <div key={name}>
              <label htmlFor={name} className="mb-2 block text-sm font-semibold text-[#334A3C]">{label}</label>
              <input id={name} name={name} required className="form-input" />
            </div>
          ))}
          <div>
            <label htmlFor="volume_keluaran" className="mb-2 block text-sm font-semibold text-[#334A3C]">Volume Keluaran</label>
            <input id="volume_keluaran" name="volume_keluaran" type="number" min="0" step="any" required className="form-input" />
          </div>
        </div>
        <div>
          <div>
            <label htmlFor="kegiatan" className="mb-2 block text-sm font-semibold text-[#334A3C]">Kegiatan</label>
            <input
              id="kegiatan"
              name="kegiatan"
              placeholder="Nama kegiatan"
              className="form-input"
            />
          </div>
        </div>
        <div className="border-t border-[#EDF2EE] pt-6">
          <h2 className="text-base font-bold text-[#17231D]">Kebutuhan anggaran</h2>
          <p className="mt-1 text-xs text-[#849289]">Jelaskan kebutuhan dan masukkan total anggaran yang diajukan.</p>
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
        <div className="rounded-2xl border border-[#DCE6DF] bg-[#FAFCFA] p-4">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-[#334A3C]">Rincian kebutuhan</h3>
            <p className="mt-1 text-xs text-[#849289]">Semua field berikut bersifat opsional.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sumber_dana" className="mb-2 block text-sm font-semibold text-[#334A3C]">Sumber Dana <span className="font-normal text-[#849289]">(opsional)</span></label>
              <input id="sumber_dana" name="sumber_dana" placeholder="Contoh: PNBP / BOPTN" className="form-input" />
            </div>
            <div>
              <label htmlFor="volume" className="mb-2 block text-sm font-semibold text-[#334A3C]">Volume <span className="font-normal text-[#849289]">(opsional)</span></label>
              <input id="volume" name="volume" type="number" min="0" step="any" className="form-input" />
            </div>
            <div>
              <label htmlFor="satuan" className="mb-2 block text-sm font-semibold text-[#334A3C]">Satuan <span className="font-normal text-[#849289]">(opsional)</span></label>
              <input id="satuan" name="satuan" placeholder="Contoh: paket, unit, orang" className="form-input" />
            </div>
            <div>
              <label htmlFor="harga_satuan" className="mb-2 block text-sm font-semibold text-[#334A3C]">Harga Satuan (Rp) <span className="font-normal text-[#849289]">(opsional)</span></label>
              <input id="harga_satuan" name="harga_satuan" type="number" min="0" step="any" className="form-input" />
            </div>
            <div>
              <label htmlFor="jumlah" className="mb-2 block text-sm font-semibold text-[#334A3C]">Jumlah (Rp) <span className="font-normal text-[#849289]">(opsional)</span></label>
              <input id="jumlah" name="jumlah" type="number" min="0" step="any" className="form-input" />
            </div>
          </div>
        </div>
        <div>
            <label htmlFor="total_anggaran" className="mb-2 block text-sm font-semibold text-[#334A3C]">Total Anggaran (Rp)</label>
            <input
              id="total_anggaran"
              name="total_anggaran"
              type="number"
              required
              defaultValue={0}
              min="0"
              className="form-input"
            />
        </div>
        <div>
          <label htmlFor="tor_link" className="mb-2 block text-sm font-semibold text-[#334A3C]">
            Link Dokumen TOR <span className="font-normal text-[#849289]">(opsional)</span>
          </label>
          <input
            id="tor_link"
            name="tor_link"
            type="url"
            placeholder="https://drive.google.com/..."
            className="form-input"
          />
          <p className="mt-2 text-xs text-[#849289]">
            Masukkan tautan TOR yang dapat diakses oleh verifikator.
          </p>
        </div>
        <div>
          <label htmlFor="rab_link" className="mb-2 block text-sm font-semibold text-[#334A3C]">
            Link Dokumen RAB <span className="font-normal text-[#849289]">(opsional)</span>
          </label>
          <input
            id="rab_link"
            name="rab_link"
            type="url"
            placeholder="https://drive.google.com/..."
            className="form-input"
          />
          <p className="mt-2 text-xs text-[#849289]">
            Masukkan tautan RAB yang dapat diakses oleh verifikator.
          </p>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-[#EDF2EE] pt-5 sm:flex-row sm:justify-end">
          <Link href="/fakultas/usulan-anggaran" className="rounded-xl border border-[#DCE6DF] px-5 py-3 text-center text-sm font-semibold text-[#64736A] transition hover:bg-[#F5F8F5]">Batal</Link>
          <SubmitButton label="Simpan sebagai draft" loadingLabel="Menyimpan draft..." className="px-5 py-3" />
        </div>
      </form>
    </div>
  );
}
