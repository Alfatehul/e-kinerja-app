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
    <div className="max-w-3xl">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#1F2937]">
          Tambah Indikator
        </h1>

        <p className="mt-1 text-sm text-[#6B7280]">
          Tambahkan indikator kinerja baru yang akan digunakan dalam sistem
          E-Kinerja.
        </p>
      </div>

      {/* FORM */}
      <form
        action={createIndicator}
        className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden"
      >
        {/* FORM HEADER */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAF8]">
          <h2 className="text-sm font-semibold text-[#14532D]">
            Informasi Indikator
          </h2>

          <p className="text-xs text-[#6B7280] mt-1">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {faculties?.map((f) => (
                <label
                  key={f.id}
                  className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm cursor-pointer hover:bg-[#F0FDF4] hover:border-[#86EFAC] transition-colors"
                >
                  <input
                    type="checkbox"
                    name="faculties"
                    value={f.id}
                    className="w-4 h-4 accent-[#16A34A]"
                  />

                  <span className="text-[#374151]">{f.code}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-[#F8FAF8] border-t border-[#E5E7EB] flex justify-end">
          <button
            type="submit"
            className="bg-[#14532D] hover:bg-[#166534] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Simpan Indikator
          </button>
        </div>
      </form>
    </div>
  );
}
