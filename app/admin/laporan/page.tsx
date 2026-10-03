import { createClient } from "@/lib/supabase/server";
import IndicatorReport, {
  type IndicatorReportRow,
} from "@/components/IndicatorReport";

type ReportAssignment = {
  realization: number | null;
  realization_unit: string | null;
  document_link: string | null;
  indicators: IndicatorData | IndicatorData[] | null;
  faculties:
    | { id: string; name: string }
    | { id: string; name: string }[]
    | null;
};
type IndicatorData = {
  code: string;
  name: string;
  description: string | null;
  quarter: string | null;
  target: number | null;
  unit: string | null;
};

export default async function AdminReportPage() {
  const supabase = await createClient();
  const [{ data: assignments, error }, { data: faculties }] = await Promise.all(
    [
      supabase
        .from("indicator_assignments")
        .select(
          "realization, realization_unit, document_link, faculties(id, name), indicators(code, name, description, quarter, target, unit)",
        ),
      supabase.from("faculties").select("id, name").order("name"),
    ],
  );
  const rows = ((assignments as ReportAssignment[] | null) ?? []).flatMap(
    (assignment) => {
      const indicator = Array.isArray(assignment.indicators)
        ? assignment.indicators[0]
        : assignment.indicators;
      const faculty = Array.isArray(assignment.faculties)
        ? assignment.faculties[0]
        : assignment.faculties;
      return indicator && faculty
        ? [
            {
              name: indicator.name ?? "-",
              description: indicator.description ?? null,
              facultyName: faculty.name ?? "-",
              period: "",
              quarter: indicator.quarter,
              target:
                indicator.target == null ? null : Number(indicator.target),
              realization: Number(assignment.realization ?? 0),
              unit: assignment.realization_unit ?? indicator.unit ?? "",
              documentLink: assignment.document_link ?? null,
            },
          ]
        : [];
    },
  ) as IndicatorReportRow[];
  return error ? (
    <p className="text-sm text-red-600">
      Gagal memuat laporan: {error.message}
    </p>
  ) : (
    <IndicatorReport rows={rows} faculties={faculties ?? []} canFilterFaculty />
  );
}
