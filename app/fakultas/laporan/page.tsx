import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import IndicatorReport, { type IndicatorReportRow } from "@/components/IndicatorReport";

type ReportAssignment = {
  realization: number | null;
  status: string | null;
  indicators: IndicatorData | IndicatorData[] | null;
};
type IndicatorData = { code: string; name: string; period: string | null; target: number; unit: string | null };

export default async function FacultyReportPage() {
  const session = await getCurrentProfile();
  const supabase = await createClient();
  const [{ data: assignments, error }, { data: faculty }] = await Promise.all([
    supabase
      .from("indicator_assignments")
      .select("realization, status, indicators(code, name, period, target, unit)")
      .eq("faculty_id", session!.profile.faculty_id),
    supabase
      .from("faculties")
      .select("name")
      .eq("id", session!.profile.faculty_id)
      .single(),
  ]);
  const rows = (assignments as ReportAssignment[] | null ?? []).flatMap((assignment) => {
    const indicator = Array.isArray(assignment.indicators) ? assignment.indicators[0] : assignment.indicators;
    return indicator ? [{
      code: indicator.code ?? "-",
      name: indicator.name ?? "-",
      facultyName: faculty?.name ?? "Fakultas Anda",
      period: indicator.period ?? "",
      target: Number(indicator.target ?? 0),
      realization: Number(assignment.realization ?? 0),
      unit: indicator.unit ?? "",
      status: assignment.status ?? "-",
    }] : [];
  }) as IndicatorReportRow[];
  return error ? <p className="text-sm text-red-600">Gagal memuat laporan: {error.message}</p> : <IndicatorReport rows={rows} faculties={[]} canFilterFaculty={false} facultyName={faculty?.name ?? "Fakultas Anda"} />;
}
