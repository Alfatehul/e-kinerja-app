import Link from "next/link";
import { createAnnouncement } from "../actions";

export default function TambahPengumumanPage() {
  return (
    <div className="mx-auto w-full max-w-2xl pb-10">
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0B5B35]">
          Komunikasi publik
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[#17231D]">
          Buat Pengumuman
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#64736A]">
          Sampaikan informasi penting kepada Fakultas / Unit melalui
          pengumuman yang terjadwal.
        </p>
      </div>

      <form
        action={createAnnouncement}
        className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-[0_12px_35px_rgba(23,35,29,0.06)]"
      >
        <div className="border-b border-[#DCE6DF] bg-[#F8FBF8] px-6 py-5">
          <h2 className="text-base font-bold text-[#14532D]">
          Detail Pengumuman
          </h2>
          <p className="mt-1 text-xs text-[#64736A]">
          Lengkapi informasi berikut sebelum menerbitkan pengumuman.
          </p>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <div>
          <label htmlFor="title" className="mb-2 block text-sm font-semibold text-[#334A3C]">Judul pengumuman</label>
          <input
          id="title"
          name="title"
          required
          placeholder="Contoh: Jadwal pengumpulan laporan kinerja"
          className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-4 py-3 text-sm text-[#17231D] outline-none transition focus:border-[#7FB493] focus:bg-white focus:ring-2 focus:ring-[#7FB493]/15"
          />
        </div>
        <div>
          <label htmlFor="body" className="mb-2 block text-sm font-semibold text-[#334A3C]">Isi pengumuman</label>
          <textarea
          id="body"
          name="body"
          required
          rows={7}
          placeholder="Tulis isi pengumuman secara jelas..."
          className="w-full resize-none rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-4 py-3 text-sm leading-6 text-[#17231D] outline-none transition focus:border-[#7FB493] focus:bg-white focus:ring-2 focus:ring-[#7FB493]/15"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="target_faculty" className="mb-2 block text-sm font-semibold text-[#334A3C]">Target penerima</label>
          <input
          id="target_faculty"
          name="target_faculty"
          defaultValue="Semua Fakultas"
          className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-4 py-3 text-sm text-[#17231D] outline-none transition focus:border-[#7FB493] focus:bg-white focus:ring-2 focus:ring-[#7FB493]/15"
          />
        </div>
          <div>
          <label className="block text-sm font-semibold mb-1">
            Tanggal terbit
          </label>
          <input
            name="publish_date"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-4 py-3 text-sm text-[#17231D] outline-none transition focus:border-[#7FB493] focus:bg-white focus:ring-2 focus:ring-[#7FB493]/15"
          />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
          Tanggal berakhir <span className="font-normal text-[#94A39A]">(opsional)</span>
          </label>
          <div>
          <input
            name="end_date"
            type="date"
            className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-4 py-3 text-sm text-[#17231D] outline-none transition focus:border-[#7FB493] focus:bg-white focus:ring-2 focus:ring-[#7FB493]/15"
          />
          </div>
        </div>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-[#DCE6DF] bg-[#F8FBF8] px-6 py-4 sm:flex-row sm:justify-end">
          <Link href="/admin/pengumuman" className="rounded-xl border border-[#DCE6DF] px-4 py-2.5 text-center text-sm font-semibold text-[#64736A] hover:bg-[#F5F8F5]">
          Batal
          </Link>
          <button type="submit" className="rounded-xl bg-[#0B5B35] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#073B25]">
          Terbitkan pengumuman
          </button>
        </div>
      </form>
    </div>
  );
}
