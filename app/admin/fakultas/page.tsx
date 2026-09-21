import { createClient } from "@/lib/supabase/server";
import FacultyIndicatorTable, {
  type Faculty,
  type FacultyAssignment,
} from "@/components/FacultyIndicatorTable";

export default async function FacultyPage() {
  const supabase = await createClient();

  const [{ data: faculties, error: facultyError }, { data: assignments, error: assignmentError }] =
    await Promise.all([
      supabase
        .from("faculties")
        .select("id, name, code, status")
        .order("name"),
      supabase
        .from("indicator_assignments")
        .select(
          "id, faculty_id, realization, status, document_link, indicators(id, code, name, category, target, unit, deadline)",
        )
        .order("created_at", { ascending: false }),
    ]);

  const facultyData = (faculties ?? []) as Faculty[];
  const assignmentData = (assignments ?? []).map((assignment) => ({
    ...assignment,
    indicators: Array.isArray(assignment.indicators)
      ? assignment.indicators[0] ?? null
      : assignment.indicators,
  })) as FacultyAssignment[];
  const error = facultyError ?? assignmentError;

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">
          Organisasi
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">
          Fakultas / Unit
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#64736A]">
          Lihat indikator yang ditugaskan, target, realisasi, dan status capaian
          untuk setiap fakultas atau unit kerja.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Gagal memuat data fakultas atau indikator: {error.message}
        </div>
      )}

      <FacultyIndicatorTable
        faculties={facultyData}
        assignments={assignmentData}
      />
    </div>
  );
}
