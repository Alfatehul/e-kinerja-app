import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

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

export default async function EditIndikatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: indicator } = await supabase
    .from("indicators")
    .select("*")
    .eq("id", id)
    .single();

  if (!indicator) notFound();

  const { data: faculties } = await supabase
    .from("faculties")
    .select("id, name, code")
    .order("name");

  const { data: currentAssignments } = await supabase
    .from("indicator_assignments")
    .select("faculty_id")
    .eq("indicator_id", id);

  const currentFacultyIds = currentAssignments?.map((a) => a.faculty_id) ?? [];

  async function updateIndicator(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const selectedFaculties = formData.getAll("faculties") as string[];

    const { error } = await supabase
      .from("indicators")
      .update({
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
      .eq("id", id);

    if (error) throw new Error(error.message);

    const newFacultyIds = selectedFaculties.filter(
      (fid) => !currentFacultyIds.includes(fid),
    );

    if (newFacultyIds.length > 0) {
      await supabase.from("indicator_assignments").insert(
        newFacultyIds.map((facultyId) => ({
          indicator_id: id,
          faculty_id: facultyId,
        })),
      );
    }

    redirect("/admin/indikator");
  }

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Manajemen Indikator</span>
          <span>›</span>
          <span className="text-[#1B2A4B] font-medium">Edit Indikator</span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#1B2A4B]">
              Edit Indikator
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Perbarui informasi indikator dan penugasan fakultas.
            </p>
          </div>

          {/* STATUS */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500" />

            <span className="text-xs font-semibold text-green-700">Aktif</span>
          </div>
        </div>
      </div>

      {/* FORM */}
      <form
        action={updateIndicator}
        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
      >
        {/* INFORMASI DASAR */}
        <div className="p-6 border-b border-gray-100">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-800">
              Informasi Dasar
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Informasi utama mengenai indikator kinerja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* KODE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Indikator
              </label>

              <input
                name="code"
                required
                defaultValue={indicator.code}
                placeholder="Contoh: IKU-01"
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none transition focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>

            {/* NAMA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Indikator
              </label>

              <input
                name="name"
                required
                defaultValue={indicator.name}
                placeholder="Nama indikator"
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none transition focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>

            {/* DESKRIPSI */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>

              <textarea
                name="description"
                rows={4}
                defaultValue={indicator.description ?? ""}
                placeholder="Masukkan deskripsi indikator..."
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none resize-none transition focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>
          </div>
        </div>

        {/* TARGET & PENILAIAN */}
        <div className="p-6 border-b border-gray-100">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-800">
              Target & Penilaian
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Tentukan kategori, target, bobot, dan periode indikator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* KATEGORI */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>

              <select
                name="category"
                defaultValue={indicator.category}
                className="w-full h-10 px-3 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* SATUAN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Satuan
              </label>

              <input
                name="unit"
                defaultValue={indicator.unit ?? ""}
                placeholder="Contoh: Persen, Orang, Dokumen"
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>

            {/* TARGET */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target
              </label>

              <input
                name="target"
                type="number"
                required
                defaultValue={indicator.target}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>

            {/* BOBOT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bobot (%)
              </label>

              <div className="relative">
                <input
                  name="weight"
                  type="number"
                  defaultValue={indicator.weight}
                  className="w-full h-10 px-3 pr-10 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  %
                </span>
              </div>
            </div>

            {/* PERIODE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode
              </label>

              <input
                name="period"
                defaultValue={indicator.period ?? ""}
                placeholder="Contoh: 2026"
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>

            {/* DEADLINE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>

              <input
                name="deadline"
                type="date"
                required
                defaultValue={indicator.deadline ?? ""}
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>
          </div>
        </div>

        {/* FAKULTAS */}
        <div className="p-6 border-b border-gray-100">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-800">
              Fakultas / Unit yang Wajib Mengisi
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Pilih fakultas atau unit yang diwajibkan mengisi indikator ini.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {faculties?.map((faculty) => {
              const already = currentFacultyIds.includes(faculty.id);

              return (
                <label
                  key={faculty.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition ${
                    already
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-gray-200 hover:border-[#1B2A4B] hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="faculties"
                    value={faculty.id}
                    defaultChecked={already}
                    disabled={already}
                    className="w-4 h-4 accent-[#1B2A4B]"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {faculty.code}
                    </p>

                    <p className="text-xs text-gray-500 truncate">
                      {faculty.name}
                    </p>
                  </div>

                  {already && (
                    <span className="shrink-0 text-[10px] font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                      Ditugaskan
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
            <p className="text-xs leading-relaxed text-amber-800">
              Fakultas yang sudah ditugaskan tidak dapat dilepas dari halaman
              ini agar data yang sudah diisi tidak hilang. Centang fakultas baru
              untuk menambahkan penugasan.
            </p>
          </div>
        </div>

        {/* ACTION */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
          <Link
            href="/admin/indikator"
            className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Batal
          </Link>

          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#1B2A4B] rounded-lg hover:bg-[#14213D] transition shadow-sm"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
