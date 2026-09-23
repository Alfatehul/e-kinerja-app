import { createClient } from "@/lib/supabase/server";
import UserManagementTable from "@/components/UserManagementTable";

export default async function UserManagementPage() {
  const supabase = await createClient();
  const [{ data: users, error: userError }, { data: faculties, error: facultyError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, role, faculty_id, faculties(name)")
        .order("full_name"),
      supabase.from("faculties").select("id, name").order("name"),
    ]);

  const error = userError ?? facultyError;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">
          Administrasi
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">
          Manajemen User
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#64736A]">
          Kelola peran dan keterikatan pengguna pada fakultas atau unit kerja.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Gagal memuat data pengguna: {error.message}
        </div>
      ) : (
        <UserManagementTable users={users ?? []} faculties={faculties ?? []} />
      )}
    </div>
  );
}
