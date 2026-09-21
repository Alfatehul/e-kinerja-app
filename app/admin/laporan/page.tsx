import { createClient } from "@/lib/supabase/server";
import IndicatorReport, { type IndicatorReportRow } from "@/components/IndicatorReport";

type ReportAssignment = {
  realization: number | null;
  status: string | null;
  indicators: IndicatorData | IndicatorData[] | null;
  faculties: { id: string; name: string } | { id: string; name: string }[] | null;
};
type IndicatorData = { code: string; name: string; period: string | null; target: number; unit: string | null };

export default async function AdminReportPage() {
  const supabase = await createClient();
  const [{ data: assignments, error }, { data: faculties }] = await Promise.all([
    supabase.from("indicator_assignments").select("realization, status, faculties(id, name), indicators(code, name, period, target, unit)"),
    supabase.from("faculties").select("id, name").order("name"),
  ]);
  const rows = (assignments as ReportAssignment[] | null ?? []).flatMap((assignment) => {
    const indicator = Array.isArray(assignment.indicators) ? assignment.indicators[0] : assignment.indicators;
    const faculty = Array.isArray(assignment.faculties) ? assignment.faculties[0] : assignment.faculties;
    return indicator && faculty ? [{
      code: indicator.code ?? "-",
      name: indicator.name ?? "-",
      facultyName: faculty.name ?? "-",
      period: indicator.period ?? "",
      target: Number(indicator.target ?? 0),
      realization: Number(assignment.realization ?? 0),
      unit: indicator.unit ?? "",
      status: assignment.status ?? "-",
    }] : [];
  }) as IndicatorReportRow[];
  return error ? <p className="text-sm text-red-600">Gagal memuat laporan: {error.message}</p> : <IndicatorReport rows={rows} faculties={faculties ?? []} canFilterFaculty />;
}
