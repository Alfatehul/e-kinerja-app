import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import IndicatorReport, { type IndicatorReportRow } from "@/components/IndicatorReport";

type ReportAssignment = {
  realization: number | null;
  status: string | null;
  document_link: string | null;
  indicators: IndicatorData | IndicatorData[] | null;
};
type IndicatorData = { code: string; name: string; description: string | null; quarter: string | null; target: number | null; unit: string | null };

export default async function FacultyReportPage() {
  const session = await getCurrentProfile();
  const supabase = await createClient();
  const [{ data: assignments, error }, { data: faculty }] = await Promise.all([
    supabase
      .from("indicator_assignments")
      .select("realization, status, document_link, indicators(code, name, description, quarter, target, unit)")
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
      description: indicator.description ?? null,
      facultyName: faculty?.name ?? "Fakultas Anda",
      period: "",
      quarter: indicator.quarter,
      target: indicator.target == null ? null : Number(indicator.target),
      realization: Number(assignment.realization ?? 0),
      unit: indicator.unit ?? "",
      status: assignment.status ?? "-",
      documentLink: assignment.document_link ?? null,
    }] : [];
  }) as IndicatorReportRow[];
  return error ? <p className="text-sm text-red-600">Gagal memuat laporan: {error.message}</p> : <IndicatorReport rows={rows} faculties={[]} canFilterFaculty={false} facultyName={faculty?.name ?? "Fakultas Anda"} />;
}
