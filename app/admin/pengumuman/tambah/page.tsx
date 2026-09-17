import { createAnnouncement } from "../actions";

export default function TambahPengumumanPage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-xl font-semibold mb-4">Buat Pengumuman</h1>
      <form
        action={createAnnouncement}
        className="bg-white border border-[#E1DDCF] rounded-lg p-6 flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">Judul</label>
          <input
            name="title"
            required
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Isi</label>
          <textarea
            name="body"
            required
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm min-h-[100px]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Target Penerima
          </label>
          <input
            name="target_faculty"
            defaultValue="Semua Fakultas"
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Tanggal Publikasi
            </label>
            <input
              name="publish_date"
              type="date"
              required
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Tanggal Berakhir
            </label>
            <input
              name="end_date"
              type="date"
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md self-start"
        >
          Terbitkan
        </button>
      </form>
    </div>
  );
}
