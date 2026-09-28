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

function statusClass(status: string | null) {
  if (status === "Selesai" || status === "Diverifikasi") return "bg-[#EAF3ED] text-[#527160]";
  if (status === "Diajukan") return "bg-[#EEF2F5] text-[#557083]";
  if (status === "Ditolak") return "bg-[#F5EEEE] text-[#86615D]";
  return "bg-[#F5F5F2] text-[#707A73]";
}

function achievement(assignment: FacultyAssignment) {
  const target = assignment.indicators?.target ?? 0;
  return target > 0
    ? Math.min(100, Math.round(((assignment.realization ?? 0) / target) * 1000) / 10)
    : 0;
}

export default function FacultyIndicatorTable({
  faculties,
  assignments,
}: {
  faculties: Faculty[];
  assignments: FacultyAssignment[];
}) {
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const facultyById = useMemo(
    () => new Map(faculties.map((faculty) => [faculty.id, faculty])),
    [faculties],
  );

  const facultyCards = useMemo(
    () =>
      faculties.map((faculty) => {
        const items = assignments.filter((assignment) => assignment.faculty_id === faculty.id);
        const average = items.length
          ? Math.round((items.reduce((sum, item) => sum + achievement(item), 0) / items.length) * 10) / 10
          : 0;
        return {
          faculty,
          items,
          average,
          completed: items.filter((item) => ["Selesai", "Diverifikasi"].includes(item.status ?? "")).length,
          pending: items.filter((item) => item.status === "Diajukan").length,
        };
      }),
    [assignments, faculties],
  );

  const selectedFaculty = selectedFacultyId ? facultyById.get(selectedFacultyId) : null;
  const query = search.trim().toLowerCase();
  const detailAssignments = assignments.filter((assignment) => {
    if (selectedFacultyId && assignment.faculty_id !== selectedFacultyId) return false;
    const indicator = assignment.indicators;
    return (
      !query ||
      indicator?.code.toLowerCase().includes(query) ||
      indicator?.name.toLowerCase().includes(query) ||
      indicator?.category?.toLowerCase().includes(query)
    );
  });
  const totalIndicators = assignments.length;
  const overallAverage = totalIndicators
    ? Math.round((assignments.reduce((sum, item) => sum + achievement(item), 0) / totalIndicators) * 10) / 10
    : 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64736A]">Total fakultas / unit</p>
          <p className="mt-2 text-3xl font-bold text-[#34463B]">{faculties.length}</p>
        </div>
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64736A]">Total indikator ditugaskan</p>
          <p className="mt-2 text-3xl font-bold text-[#34463B]">{totalIndicators}</p>
        </div>
        <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-[#64736A]">Capaian rata-rata</p>
          <p className="mt-2 text-3xl font-bold text-[#806F43]">{overallAverage}%</p>
        </div>
      </div>

      <section className="rounded-2xl border border-[#DCE6DF] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-[#17231D]">Fakultas / Unit</h2>
            <p className="mt-1 text-xs text-[#64736A]">Pilih card untuk melihat indikator yang ditugaskan.</p>
          </div>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari indikator..."
            className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FAF8] px-3 py-2.5 text-sm outline-none focus:border-[#9AB7A3] sm:max-w-xs"
          />
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {facultyCards.map(({ faculty, items, average, completed, pending }) => {
            const selected = selectedFacultyId === faculty.id;
            return (
              <button
                key={faculty.id}
                type="button"
                onClick={() => setSelectedFacultyId(selected ? null : faculty.id)}
                className={`group rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                  selected
                    ? "border-[#9AB7A3] bg-[#F2F7F3] ring-2 ring-[#C9DED0]"
                    : "border-[#E1E9E2] bg-[#FCFDFC] hover:border-[#B9D7C1]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#EAF2EC] text-sm font-bold text-[#527160]">
                      {(faculty.code ?? faculty.name).slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#34463B]">{faculty.name}</p>
                      <p className="mt-1 text-xs text-[#849289]">{faculty.code ?? "Unit kerja"} · {faculty.status ?? "Aktif"}</p>
                    </div>
                  </div>
                  <span className="text-lg text-[#849289] transition group-hover:translate-x-0.5">→</span>
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#34463B]">{items.length}</p>
                    <p className="text-[11px] text-[#849289]">indikator</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#806F43]">{average}%</p>
                    <p className="text-[11px] text-[#849289]">rata-rata capaian</p>
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E8EFEA]">
                  <div className="h-full rounded-full bg-[#C49A45]" style={{ width: `${average}%` }} />
                </div>
                <div className="mt-4 flex gap-2 text-[11px] font-semibold">
                  <span className="rounded-full bg-[#EAF3ED] px-2.5 py-1 text-[#527160]">{completed} selesai</span>
                  <span className="rounded-full bg-[#F5F2E9] px-2.5 py-1 text-[#806F43]">{pending} menunggu</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {selectedFaculty && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#17231D]/35 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedFacultyId(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="faculty-detail-title"
            className="flex max-h-[min(720px,calc(100vh-2rem))] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-[#DCE6DF] bg-white shadow-2xl"
          >
        <div className="flex flex-col gap-3 border-b border-[#DCE6DF] bg-[#F8FBF8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="faculty-detail-title" className="text-sm font-bold text-[#334A3C]">
              Indikator {selectedFaculty.name}
            </h2>
            <p className="mt-1 text-xs text-[#849289]">{detailAssignments.length} indikator ditampilkan</p>
          </div>
          <button type="button" onClick={() => setSelectedFacultyId(null)} aria-label="Tutup detail fakultas" className="self-start rounded-lg border border-[#DCE6DF] px-3 py-1.5 text-lg leading-none text-[#64736A] hover:bg-white">
            ×
          </button>
        </div>
        <div className="max-h-[calc(100vh-11rem)] overflow-auto">
          {detailAssignments.length > 0 ? (
            <table className="min-w-[760px] w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 border-b border-[#DCE6DF] bg-[#F4F8F5] text-[10px] uppercase tracking-[0.1em] text-[#64736A]">
                <tr>
                  <th className="w-14 px-5 py-3 text-center font-bold">No.</th>
                  <th className="px-4 py-3 font-bold">Indikator</th>
                  <th className="w-28 px-4 py-3 text-right font-bold">Target</th>
                  <th className="w-28 px-4 py-3 text-right font-bold">Realisasi</th>
                  <th className="w-36 px-4 py-3 font-bold">Capaian</th>
                  <th className="w-32 px-4 py-3 font-bold">Status</th>
                  <th className="w-28 px-5 py-3 text-right font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EDF2EE]">
                {detailAssignments.map((assignment, index) => {
                  const indicator = assignment.indicators;
                  const progress = achievement(assignment);
                  return (
                    <tr key={assignment.id} className="transition hover:bg-[#FCFDFC]">
                      <td className="px-5 py-4 text-center align-top text-xs font-semibold text-[#849289]">
                        {index + 1}
                      </td>
                      <td className="max-w-[280px] px-4 py-4 align-top">
                        <p className="font-bold text-[#527160]">{indicator?.code ?? "-"}</p>
                        <p className="mt-1 font-semibold leading-5 text-[#34463B]">
                          {indicator?.name ?? "Indikator tidak ditemukan"}
                        </p>
                        <p className="mt-1 text-xs text-[#849289]">
                          {indicator?.category ?? "Tanpa kategori"}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-right align-top font-medium text-[#53645A]">
                        {indicator?.target ?? "-"} {indicator?.unit ?? ""}
                      </td>
                      <td className="px-4 py-4 text-right align-top font-medium text-[#53645A]">
                        {assignment.realization ?? 0} {indicator?.unit ?? ""}
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex justify-between gap-2 text-xs font-bold text-[#64736A]">
                          <span>{progress}%</span>
                        </div>
                        <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-[#E8EFEA]">
                          <div className="h-full rounded-full bg-[#C49A45]" style={{ width: `${progress}%` }} />
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(assignment.status)}`}>
                          {assignment.status ?? "Belum Diisi"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right align-top">
                        <Link href={`/admin/monitoring/${assignment.id}`} className="inline-flex rounded-lg border border-[#C9DED0] px-2.5 py-1.5 text-xs font-bold text-[#527160] hover:bg-[#EEF5F0]">
                          Detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="px-5 py-12 text-center text-sm text-[#64736A]">Tidak ada indikator yang sesuai.</p>
          )}
        </div>
          </section>
        </div>
      )}
    </div>
  );
}
