import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const categories = [
  "Pendidikan",
  "Penelitian",
  "Pengabdian",
  "Kemahasiswaan",
  "SDM",
  "Keuangan",
  "Sarana Prasarana",
  "Tata Kelola",
  "Kerja Sama",
  "Akreditasi",
];

export default async function TambahIndikatorPage() {
  const supabase = await createClient();

  const { data: faculties } = await supabase
    .from("faculties")
    .select("id, name, code")
    .order("name");

  async function createIndicator(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const selectedFaculties = formData.getAll("faculties") as string[];

    const { data: newIndicator, error } = await supabase
      .from("indicators")
      .insert({
        code: formData.get("code") as string,
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        target: Number(formData.get("target")),
        unit: formData.get("unit") as string,
        weight: Number(formData.get("weight")),
        period: formData.get("period") as string,
        deadline: formData.get("deadline") as string,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (selectedFaculties.length > 0) {
      const assignments = selectedFaculties.map((facultyId) => ({
        indicator_id: newIndicator.id,
        faculty_id: facultyId,
      }));

      await supabase.from("indicator_assignments").insert(assignments);
    }

    redirect("/admin/indikator");
  }

  return (
    <div className="mx-auto w-full max-w-4xl pb-10">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0B5B35]">
          Manajemen Kinerja
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-[#17231D]">
          Tambah Indikator
        </h1>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#64736A]">
          Tambahkan indikator kinerja baru dan tentukan fakultas atau unit yang
          wajib mengisi indikator tersebut.
        </p>
      </div>

      {/* FORM */}
      <form
        action={createIndicator}
        className="overflow-hidden rounded-2xl border border-[#DCE6DF] bg-white shadow-[0_12px_35px_rgba(23,35,29,0.06)]"
      >
        {/* FORM HEADER */}
        <div className="border-b border-[#DCE6DF] bg-[#F8FBF8] px-6 py-5">
          <h2 className="text-base font-bold text-[#14532D]">
            Informasi Indikator
          </h2>

          <p className="mt-1 text-xs text-[#64736A]">
            Isi informasi indikator secara lengkap.
          </p>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* KODE */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Kode Indikator
              <span className="text-red-500 ml-1">*</span>
            </label>

            <input
              name="code"
              required
              className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-[#1F2937] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/10"
              placeholder="Contoh: IND-011"
            />
          </div>

          {/* NAMA */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Nama Indikator
              <span className="text-red-500 ml-1">*</span>
            </label>

            <input
              name="name"
              required
              className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-[#1F2937] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/10"
              placeholder="Masukkan nama indikator"
            />
          </div>

          {/* DESKRIPSI */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Deskripsi
            </label>

            <textarea
              name="description"
              rows={4}
              className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-[#1F2937] outline-none resize-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/10"
              placeholder="Jelaskan indikator yang akan digunakan..."
            />
          </div>

          {/* KATEGORI + SATUAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Kategori
              </label>

              <select
                name="category"
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-[#1F2937] bg-white outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/10"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Satuan
              </label>

              <input
                name="unit"
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-[#1F2937] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/10"
                placeholder="%, publikasi, orang, dll."
              />
            </div>
          </div>

          {/* TARGET + BOBOT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Target
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                name="target"
                type="number"
                required
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-[#1F2937] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/10"
                placeholder="Contoh: 100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Bobot (%)
              </label>

              <input
                name="weight"
                type="number"
                defaultValue={5}
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-[#1F2937] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/10"
              />
            </div>
          </div>

          {/* PERIODE + DEADLINE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Periode
              </label>

              <input
                name="period"
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-[#1F2937] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/10"
                placeholder="Contoh: Tahunan 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1.5">
                Deadline
                <span className="text-red-500 ml-1">*</span>
              </label>

              <input
                name="deadline"
                type="date"
                required
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2.5 text-sm text-[#1F2937] outline-none transition focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/10"
              />
            </div>
          </div>

          {/* FAKULTAS */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">
              Fakultas / Unit yang Wajib Mengisi
            </label>

            <p className="text-xs text-[#6B7280] mb-3">
              Pilih fakultas atau unit yang diwajibkan mengisi indikator ini.
            </p>

            <div className="overflow-hidden rounded-xl border border-[#DCE6DF]">
              <div className="grid grid-cols-[52px_120px_1fr] items-center bg-[#F3F8F4] px-4 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#64736A]">
                <span>Pilih</span>
                <span>Kode</span>
                <span>Nama Fakultas / Unit</span>
              </div>
              <div className="divide-y divide-[#E8EFEA]">
                {faculties?.map((f) => (
                  <label
                    key={f.id}
                    className="grid cursor-pointer grid-cols-[52px_120px_1fr] items-center px-4 py-3 text-sm transition-colors hover:bg-[#F8FBF8]"
                  >
                    <span>
                      <input
                        type="checkbox"
                        name="faculties"
                        value={f.id}
                        className="h-4 w-4 accent-[#16A34A]"
                      />
                    </span>
                    <span className="font-semibold text-[#14532D]">{f.code}</span>
                    <span className="text-[#374151]">{f.name}</span>
                  </label>
                ))}
                {faculties?.length === 0 && (
                  <p className="px-4 py-6 text-center text-sm text-[#64736A]">
                    Belum ada data Fakultas / Unit.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end border-t border-[#DCE6DF] bg-[#F8FBF8] px-6 py-4">
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-[#14532D] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#166534]"
          >
            Simpan Indikator
          </button>
        </div>
      </form>
    </div>
  );
}
