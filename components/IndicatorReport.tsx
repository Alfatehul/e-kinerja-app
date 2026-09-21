"use client";

import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

export type IndicatorReportRow = {
  code: string;
  name: string;
  facultyName: string;
  period: string;
  target: number;
  realization: number;
  unit: string;
  status: string;
};

type IndicatorReportProps = {
  rows: IndicatorReportRow[];
  faculties: { id: string; name: string }[];
  canFilterFaculty: boolean;
  facultyName?: string;
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(value);

function achievement(row: IndicatorReportRow) {
  return row.target > 0
    ? Math.min(100, Math.round((row.realization / row.target) * 1000) / 10)
    : 0;
}

export default function IndicatorReport({
  rows,
  faculties,
  canFilterFaculty,
  facultyName,
}: IndicatorReportProps) {
  const [period, setPeriod] = useState("all");
  const [faculty, setFaculty] = useState("all");

  const periods = useMemo(
    () => Array.from(new Set(rows.map((row) => row.period).filter(Boolean))).sort(),
    [rows],
  );
  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          (period === "all" || row.period === period) &&
          (!canFilterFaculty || faculty === "all" || row.facultyName === faculty),
      ),
    [canFilterFaculty, faculty, period, rows],
  );
  const selectedPeriod = period === "all" ? "Semua Periode" : period;
  const selectedFaculty = canFilterFaculty
    ? faculty === "all"
      ? "Semua Fakultas"
      : faculty
    : facultyName ?? "Fakultas";

  function exportPdf() {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const left = 14;
    const pageWidth = 297;
    doc.setTextColor(23, 35, 29);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("UNIVERSITAS ISLAM NEGERI AR-RANIRY", pageWidth / 2, 16, {
      align: "center",
    });
    doc.setFontSize(11);
    doc.text("BIRO ADMINISTRASI UMUM", pageWidth / 2, 23, { align: "center" });
    doc.setFontSize(14);
    doc.text("LAPORAN KINERJA INDIKATOR", pageWidth / 2, 34, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Fakultas: ${selectedFaculty}   |   Periode: ${selectedPeriod}`, left, 43);

    const columns = [
      { label: "No", width: 10 },
      { label: "Indikator", width: 82 },
      { label: "Fakultas", width: 40 },
      { label: "Target", width: 27 },
      { label: "Realisasi", width: 27 },
      { label: "Capaian", width: 22 },
      { label: "Status", width: 45 },
    ];
    const tableTop = 49;
    const rowHeight = 8;
    const drawRow = (values: string[], y: number, header = false) => {
      let x = left;
      doc.setFillColor(header ? 11 : 255, header ? 91 : 255, header ? 53 : 255);
      doc.setTextColor(header ? 255 : 23, header ? 255 : 35, header ? 255 : 29);
      values.forEach((value, index) => {
        const width = columns[index].width;
        doc.rect(x, y, width, rowHeight, "FD");
        doc.text(value.slice(0, 38), x + 2, y + 5.2);
        x += width;
      });
    };
    drawRow(columns.map((column) => column.label), tableTop, true);
    filteredRows.forEach((row, index) =>
      drawRow(
        [
          String(index + 1),
          `${row.code} — ${row.name}`,
          row.facultyName,
          `${formatNumber(row.target)} ${row.unit}`,
          `${formatNumber(row.realization)} ${row.unit}`,
          `${achievement(row)}%`,
          row.status,
        ],
        tableTop + rowHeight * (index + 1),
      ),
    );
    const footerY = Math.min(202, tableTop + rowHeight * (filteredRows.length + 2));
    doc.setFontSize(8);
    doc.setTextColor(90, 105, 96);
    doc.text(`Dicetak: ${new Date().toLocaleString("id-ID")}`, left, footerY);
    doc.text("Halaman 1", pageWidth - left, footerY, { align: "right" });
    doc.save("laporan-kinerja-indikator.pdf");
  }

  function exportExcel() {
    const data = filteredRows.map((row, index) => ({
      No: index + 1,
      Kode: row.code,
      Indikator: row.name,
      Fakultas: row.facultyName,
      Periode: row.period,
      Target: row.target,
      Satuan: row.unit,
      Realisasi: row.realization,
      Capaian: `${achievement(row)}%`,
      Status: row.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    worksheet["!cols"] = [
      { wch: 6 }, { wch: 14 }, { wch: 40 }, { wch: 28 }, { wch: 24 },
      { wch: 12 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 18 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Indikator");
    XLSX.writeFile(workbook, "laporan-kinerja-indikator.xlsx");
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className="print-hidden flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">
            Pelaporan
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">
            Laporan Kinerja Indikator
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => window.print()} className="rounded-lg border border-[#0B5B35] bg-white px-4 py-2 text-sm font-semibold text-[#0B5B35]">
            Cetak
          </button>
          <button type="button" onClick={exportPdf} className="rounded-lg bg-[#0B5B35] px-4 py-2 text-sm font-semibold text-white">
            Export PDF
          </button>
          <button type="button" onClick={exportExcel} className="rounded-lg bg-[#C49A45] px-4 py-2 text-sm font-semibold text-[#073B25]">
            Export Excel
          </button>
        </div>
      </div>

      <div className="print-hidden flex flex-wrap gap-3 rounded-xl border border-[#DCE6DF] bg-white p-4">
        {canFilterFaculty && (
          <label className="flex min-w-52 flex-1 flex-col gap-1 text-xs font-semibold text-[#44534B]">
            Fakultas
            <select className="form-input py-2" value={faculty} onChange={(event) => setFaculty(event.target.value)}>
              <option value="all">Semua Fakultas</option>
              {faculties.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
            </select>
          </label>
        )}
        <label className="flex min-w-52 flex-1 flex-col gap-1 text-xs font-semibold text-[#44534B]">
          Periode
          <select className="form-input py-2" value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option value="all">Semua Periode</option>
            {periods.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>

      <section className="report-paper rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-8">
        <header className="border-b-2 border-[#0B5B35] pb-5 text-center">
          <p className="text-sm font-bold tracking-wide text-[#0B5B35]">UNIVERSITAS ISLAM NEGERI AR-RANIRY</p>
          <p className="mt-1 text-xs font-semibold tracking-[0.16em] text-[#64736A]">BIRO ADMINISTRASI UMUM</p>
          <h2 className="mt-4 text-xl font-bold text-[#17231D]">LAPORAN KINERJA INDIKATOR</h2>
          <p className="mt-2 text-sm text-[#64736A]">{selectedFaculty} · {selectedPeriod}</p>
        </header>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead className="bg-[#0B5B35] text-left text-white">
              <tr><th className="p-3">No</th><th className="p-3">Indikator</th><th className="p-3">Fakultas</th><th className="p-3">Target</th><th className="p-3">Realisasi</th><th className="p-3">Capaian</th><th className="p-3">Status</th></tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr key={`${row.code}-${row.facultyName}`} className="border-b border-[#DCE6DF] align-top">
                  <td className="p-3">{index + 1}</td><td className="p-3"><span className="font-semibold text-[#0B5B35]">{row.code}</span><br />{row.name}</td><td className="p-3">{row.facultyName}</td><td className="p-3">{formatNumber(row.target)} {row.unit}</td><td className="p-3">{formatNumber(row.realization)} {row.unit}</td><td className="p-3 font-semibold">{achievement(row)}%</td><td className="p-3">{row.status}</td>
                </tr>
              ))}
              {filteredRows.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-[#64736A]">Tidak ada data untuk filter yang dipilih.</td></tr>}
            </tbody>
          </table>
        </div>
        <footer className="mt-8 flex justify-between border-t border-[#DCE6DF] pt-3 text-xs text-[#64736A]">
          <span>Dicetak: {new Date().toLocaleDateString("id-ID")}</span><span>Halaman 1</span>
        </footer>
      </section>
    </div>
  );
}
