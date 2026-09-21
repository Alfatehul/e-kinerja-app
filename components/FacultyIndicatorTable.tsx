"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface Faculty {
  id: string;
  name: string;
  code: string | null;
  status: string | null;
}

interface Indicator {
  id: string;
  code: string;
  name: string;
  category: string | null;
  target: number | null;
  unit: string | null;
  deadline: string | null;
}

export interface FacultyAssignment {
  id: string;
  faculty_id: string;
  realization: number | null;
  status: string | null;
  document_link: string | null;
  indicators: Indicator | null;
}

function getStatusClass(status: string | null) {
  switch (status) {
    case "Selesai":
    case "Diverifikasi":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Diajukan":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Ditolak":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

export default function FacultyIndicatorTable({
  faculties,
  assignments,
}: {
  faculties: Faculty[];
  assignments: FacultyAssignment[];
}) {
  const [selectedFacultyId, setSelectedFacultyId] = useState("all");
  const [search, setSearch] = useState("");

  const facultyById = useMemo(
    () => new Map(faculties.map((faculty) => [faculty.id, faculty])),
    [faculties],
  );

  const visibleAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();
    return assignments.filter((assignment) => {
      const indicator = assignment.indicators;
      const matchesFaculty =
        selectedFacultyId === "all" ||
        assignment.faculty_id === selectedFacultyId;
      const matchesSearch =
        !query ||
        indicator?.code.toLowerCase().includes(query) ||
        indicator?.name.toLowerCase().includes(query) ||
        indicator?.category?.toLowerCase().includes(query);
      return matchesFaculty && matchesSearch;
    });
  }, [assignments, search, selectedFacultyId]);

  const selectedFaculty =
    selectedFacultyId === "all" ? null : facultyById.get(selectedFacultyId);
  const averageAchievement =
    visibleAssignments.length > 0
      ? Math.round(
          (visibleAssignments.reduce((total, assignment) => {
            const target = assignment.indicators?.target ?? 0;
            const realization = assignment.realization ?? 0;
            return total + (target > 0 ? Math.min(100, (realization / target) * 100) : 0);
          }, 0) /
            visibleAssignments.length) *
            10,
        ) / 10
      : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64736A]">Total fakultas / unit</p>
          <p className="mt-2 text-3xl font-bold text-[#073B25]">{faculties.length}</p>
        </div>
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64736A]">
            Indikator {selectedFaculty ? `di ${selectedFaculty.code ?? selectedFaculty.name}` : "terdaftar"}
          </p>
          <p className="mt-2 text-3xl font-bold text-[#073B25]">{visibleAssignments.length}</p>
        </div>
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64736A]">Capaian rata-rata</p>
          <p className="mt-2 text-3xl font-bold text-[#B27D20]">{averageAchievement}%</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#DCE6DF] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-base font-bold text-[#17231D]">Indikator per fakultas / unit</h2>
            <p className="mt-1 text-xs text-[#64736A]">
              Pilih unit untuk melihat rincian indikator yang ditugaskan.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <label className="min-w-56">
              <span className="sr-only">Pilih fakultas atau unit</span>
              <select
                value={selectedFacultyId}
                onChange={(event) => setSelectedFacultyId(event.target.value)}
                className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FAF8] px-3 py-2.5 text-sm text-[#17231D]"
              >
                <option value="all">Semua fakultas / unit</option>
                {faculties.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.code ? `${faculty.code} — ` : ""}
                    {faculty.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="min-w-56">
              <span className="sr-only">Cari indikator</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari kode atau nama indikator..."
                className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FAF8] px-3 py-2.5 text-sm text-[#17231D] placeholder:text-[#91A097]"
              />
            </label>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-[#DCE6DF] bg-[#F5F8F5] text-xs uppercase tracking-wide text-[#64736A]">
              <tr>
                <th className="px-4 py-3 font-semibold">Indikator</th>
                <th className="px-4 py-3 font-semibold">Fakultas / Unit</th>
                <th className="px-4 py-3 font-semibold">Target</th>
                <th className="px-4 py-3 font-semibold">Realisasi</th>
                <th className="px-4 py-3 font-semibold">Capaian</th>
                <th className="px-4 py-3 font-semibold">Dokumen</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="w-36 px-4 py-3 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {visibleAssignments.map((assignment) => {
                const indicator = assignment.indicators;
                const target = indicator?.target ?? 0;
                const realization = assignment.realization ?? 0;
                const achievement =
                  target > 0 ? Math.min(100, Math.round((realization / target) * 1000) / 10) : 0;
                const faculty = facultyById.get(assignment.faculty_id);

                return (
                  <tr key={assignment.id} className="border-b border-[#EDF2EE] last:border-0">
                    <td className="px-4 py-4">
                      <p className="font-bold text-[#0B5B35]">{indicator?.code ?? "-"}</p>
                      <p className="mt-1 max-w-xs text-[#17231D]">{indicator?.name ?? "Indikator tidak ditemukan"}</p>
                      <p className="mt-1 text-xs text-[#849289]">{indicator?.category ?? "Tanpa kategori"}</p>
                    </td>
                    <td className="px-4 py-4 text-[#44534B]">
                      <p className="font-medium">{faculty?.name ?? "Unit tidak ditemukan"}</p>
                      {faculty?.code && <p className="mt-1 text-xs text-[#849289]">{faculty.code}</p>}
                    </td>
                    <td className="px-4 py-4 font-medium text-[#44534B]">
                      {indicator?.target ?? "-"} {indicator?.unit ?? ""}
                    </td>
                    <td className="px-4 py-4 text-[#44534B]">
                      {realization} {indicator?.unit ?? ""}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-[#17231D]">{achievement}%</span>
                      <div className="mt-2 h-1.5 w-20 overflow-hidden rounded-full bg-[#E8EFEA]">
                        <div className="h-full rounded-full bg-[#C49A45]" style={{ width: `${achievement}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {assignment.document_link ? (
                        <a
                          href={assignment.document_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#B8D8C1] bg-[#F1FAF3] px-2.5 py-1.5 text-xs font-semibold text-[#0B5B35] transition hover:border-[#0B5B35] hover:bg-[#E5F5E9]"
                        >
                          Buka dokumen
                          <span aria-hidden>↗</span>
                        </a>
                      ) : (
                        <span className="text-xs text-[#94A39A]">Belum tersedia</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(assignment.status)}`}>
                        {assignment.status ?? "Belum Diisi"}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <Link
                        href={`/admin/monitoring/${assignment.id}`}
                        aria-label={`Lihat detail ${indicator?.code ?? "indikator"}`}
                        title="Lihat detail indikator"
                        className="group inline-flex items-center gap-2 rounded-xl border border-[#C9DED0] bg-[#F5FAF6] px-3 py-2 text-xs font-bold text-[#0B5B35] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0B5B35] hover:bg-[#0B5B35] hover:text-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5B35]"
                      >
                        <svg
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform group-hover:scale-110"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
                          <circle cx="12" cy="12" r="2.5" />
                        </svg>
                        <span>Lihat detail</span>
                        <svg
                          aria-hidden="true"
                          className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="m13 6 6 6-6 6" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {visibleAssignments.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-[#64736A]">
                    Tidak ada indikator untuk pilihan tersebut.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
