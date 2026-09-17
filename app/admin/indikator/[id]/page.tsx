import { redirect, notFound } from "next/navigation";
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

function getStatusStyle(status: string) {
  switch (status?.toLowerCase()) {
    case "aktif":
      return {
        background: "#DCFCE7",
        color: "#166534",
        border: "#BBF7D0",
      };

    case "draft":
      return {
        background: "#FEF3C7",
        color: "#92400E",
        border: "#FDE68A",
      };

    case "nonaktif":
    case "tidak aktif":
      return {
        background: "#FEE2E2",
        color: "#991B1B",
        border: "#FECACA",
      };

    default:
      return {
        background: "#F1F5F9",
        color: "#475569",
        border: "#E2E8F0",
      };
  }
}

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

  const status = indicator.status ?? "Aktif";
  const statusStyle = getStatusStyle(status);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Manajemen Indikator</p>

            <h1 className="text-2xl font-semibold text-[#1B2A4B]">
              Edit Indikator
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Perbarui informasi dan penugasan indikator kinerja.
            </p>
          </div>

          {/* Status */}
          <div
            className="px-3 py-1.5 rounded-full text-xs font-semibold border"
            style={{
              backgroundColor: statusStyle.background,
              color: statusStyle.color,
              borderColor: statusStyle.border,
            }}
          >
            {status}
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        action={updateIndicator}
        className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
      >
        {/* Informasi Dasar */}
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
            {/* Kode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kode Indikator
              </label>

              <input
                name="code"
                required
                defaultValue={indicator.code}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>

            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Indikator
              </label>

              <input
                name="name"
                required
                defaultValue={indicator.name}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>

            {/* Deskripsi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>

              <textarea
                name="description"
                rows={4}
                defaultValue={indicator.description ?? ""}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>
          </div>
        </div>

        {/* Target & Bobot */}
        <div className="p-6 border-b border-gray-100">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-800">
              Target dan Penilaian
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Tentukan target, satuan, bobot, dan periode indikator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>

              <select
                name="category"
                defaultValue={indicator.category}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Satuan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Satuan
              </label>

              <input
                name="unit"
                defaultValue={indicator.unit ?? ""}
                placeholder="Contoh: Persen, Orang, Dokumen"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>

            {/* Target */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target
              </label>

              <input
                name="target"
                type="number"
                required
                defaultValue={indicator.target}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>

            {/* Bobot */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bobot (%)
              </label>

              <input
                name="weight"
                type="number"
                defaultValue={indicator.weight}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>

            {/* Periode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode
              </label>

              <input
                name="period"
                defaultValue={indicator.period ?? ""}
                placeholder="Contoh: 2026"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>

              <input
                name="deadline"
                type="date"
                required
                defaultValue={indicator.deadline ?? ""}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1B2A4B] focus:ring-2 focus:ring-[#1B2A4B]/10"
              />
            </div>
          </div>
        </div>

        {/* Fakultas */}
        <div className="p-6 border-b border-gray-100">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-800">
              Penugasan Fakultas / Unit
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Pilih fakultas atau unit yang wajib mengisi indikator ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {faculties?.map((faculty) => {
              const already = currentFacultyIds.includes(faculty.id);

              return (
                <label
                  key={faculty.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 transition ${
                    already
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-gray-200 hover:border-[#1B2A4B]"
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

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {faculty.code}
                    </p>

                    <p className="text-xs text-gray-500">{faculty.name}</p>
                  </div>

                  {already && (
                    <span className="text-[10px] font-medium bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      Sudah ditugaskan
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-100 p-3">
            <p className="text-xs text-amber-800">
              Fakultas yang sudah ditugaskan tidak dapat dilepas dari halaman
              ini agar data yang sudah diisi tidak hilang. Centang fakultas baru
              untuk menambahkan penugasan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Pastikan data sudah benar sebelum menyimpan perubahan.
          </p>

          <button
            type="submit"
            className="bg-[#1B2A4B] hover:bg-[#14213D] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition shadow-sm"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
