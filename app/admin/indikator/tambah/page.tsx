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
    <div className="max-w-xl">
      <h1 className="font-serif text-xl font-semibold mb-4">
        Tambah Indikator
      </h1>
      <form
        action={createIndicator}
        className="bg-white border border-[#E1DDCF] rounded-lg p-6 flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-semibold mb-1">
            Kode Indikator
          </label>
          <input
            name="code"
            required
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            placeholder="IND-011"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Nama Indikator
          </label>
          <input
            name="name"
            required
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Deskripsi</label>
          <textarea
            name="description"
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Kategori</label>
            <select
              name="category"
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
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
              placeholder="%, publikasi, dsb."
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
              defaultValue={5}
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Periode</label>
            <input
              name="period"
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
              placeholder="Tahunan 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Deadline</label>
            <input
              name="deadline"
              type="date"
              required
              className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Fakultas/Unit yang Wajib Mengisi
          </label>
          <div className="flex flex-wrap gap-2">
            {faculties?.map((f) => (
              <label
                key={f.id}
                className="flex items-center gap-1.5 text-sm border border-[#E1DDCF] rounded-md px-2.5 py-1.5"
              >
                <input type="checkbox" name="faculties" value={f.id} />
                {f.code}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md self-start"
        >
          Simpan Indikator
        </button>
      </form>
    </div>
  );
}
