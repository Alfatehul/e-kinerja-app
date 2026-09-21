import { createMemo } from "../actions";

export default function TambahMemoPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">Komunikasi internal</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">Buat memo baru</h1>
        <p className="mt-2 text-sm text-[#64736A]">Memo akan dapat dibaca oleh penerima sesuai target yang dipilih.</p>
      </div>
      <form action={createMemo} className="flex flex-col gap-5 rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-6">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-semibold text-[#334A3C]">Judul memo</label>
          <input id="title" name="title" required placeholder="Contoh: Jadwal pengumpulan laporan kinerja" className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-4 py-3 text-sm text-[#17231D]" />
        </div>
        <div>
          <label htmlFor="body" className="mb-2 block text-sm font-semibold text-[#334A3C]">Isi memo</label>
          <textarea id="body" name="body" required rows={7} placeholder="Tulis isi memo secara jelas..." className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-4 py-3 text-sm leading-6 text-[#17231D]" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="target_faculty" className="mb-2 block text-sm font-semibold text-[#334A3C]">Target penerima</label>
            <input id="target_faculty" name="target_faculty" defaultValue="Semua Fakultas" className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-4 py-3 text-sm text-[#17231D]" />
          </div>
          <div>
            <label htmlFor="publish_date" className="mb-2 block text-sm font-semibold text-[#334A3C]">Tanggal terbit</label>
            <input id="publish_date" name="publish_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-4 py-3 text-sm text-[#17231D]" />
          </div>
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <a href="/admin/memo" className="rounded-xl border border-[#DCE6DF] px-4 py-2.5 text-center text-sm font-semibold text-[#64736A] hover:bg-[#F5F8F5]">Batal</a>
          <button type="submit" className="rounded-xl bg-[#0B5B35] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#073B25]">Terbitkan memo</button>
        </div>
      </form>
    </div>
  );
}
