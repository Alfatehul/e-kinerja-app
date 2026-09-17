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
    <div className="max-w-xl">
      <h1 className="font-serif text-xl font-semibold mb-4">Edit Indikator</h1>
      <form
        action={updateIndicator}
        className="bg-white border border-[#E1DDCF] rounded-lg p-6 flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">
            Kode Indikator
          </label>
          <input
            name="code"
            required
            defaultValue={indicator.code}
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Nama Indikator
          </label>
          <input
            name="name"
            required
            defaultValue={indicator.name}
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Deskripsi</label>
          <textarea
            name="description"
            defaultValue={indicator.description ?? ""}
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Kategori</label>
            <select
              name="category"
              defaultValue={indicator.category}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            >
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Satuan</label>
            <input
              name="unit"
              defaultValue={indicator.unit ?? ""}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Target</label>
            <input
              name="target"
              type="number"
              required
              defaultValue={indicator.target}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">
              Bobot (%)
            </label>
            <input
              name="weight"
              type="number"
              defaultValue={indicator.weight}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Periode</label>
            <input
              name="period"
              defaultValue={indicator.period ?? ""}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Deadline</label>
            <input
              name="deadline"
              type="date"
              required
              defaultValue={indicator.deadline ?? ""}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Fakultas/Unit yang Wajib Mengisi
          </label>
          <div className="flex flex-wrap gap-2">
            {faculties?.map((f) => {
              const already = currentFacultyIds.includes(f.id);
              return (
                <label
                  key={f.id}
                  className="flex items-center gap-1.5 text-sm border border-[#E1DDCF] rounded-md px-2.5 py-1.5"
                >
                  <input
                    type="checkbox"
                    name="faculties"
                    value={f.id}
                    defaultChecked={already}
                    disabled={already}
                  />
                  {f.code}{" "}
                  {already && (
                    <span className="text-[10px] text-gray-400">
                      (sudah ditugaskan)
                    </span>
                  )}
                </label>
              );
            })}
          </div>
          <p className="text-xs text-[#5B5A55] mt-1">
            Fakultas yang sudah ditugaskan tidak bisa dilepas dari sini (agar
            data yang sudah diisi tidak hilang). Centang fakultas baru untuk
            menambah penugasan.
          </p>
        </div>
        <button
          type="submit"
          className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md self-start"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
