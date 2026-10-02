"use client";

import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

export type IndicatorReportRow = {
  name: string;
  facultyName: string;
  period: string;
  quarter: string | null;
  target: number;
  realization: number;
  unit: string;
  documentLink?: string | null;
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
  const [quarter, setQuarter] = useState("all");
  const [faculty, setFaculty] = useState("all");

  const headingFaculty = canFilterFaculty
    ? faculty === "all"
      ? "Semua Fakultas / Unit"
      : faculty
    : (facultyName ?? "Fakultas / Unit");
  const quarterLabels: Record<string, string> = {
    "1": "Triwulan I",
    "2": "Triwulan II",
    "3": "Triwulan III",
    "4": "Triwulan IV",
  };
  const selectedQuarter =
    quarter === "all" ? "Semua Triwulan" : quarterLabels[quarter] ?? quarter;

  const quarters = useMemo(
    () =>
      Array.from(new Set(rows.map((row) => row.quarter).filter(Boolean))).sort(),
    [rows],
  );
  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          (quarter === "all" || row.quarter === quarter) &&
          (!canFilterFaculty ||
            faculty === "all" ||
            row.facultyName === faculty),
      ),
    [canFilterFaculty, faculty, quarter, rows],
  );
  const selectedFaculty = canFilterFaculty
    ? faculty === "all"
      ? "Semua Fakultas"
      : faculty
    : (facultyName ?? "Fakultas");

  function exportPdf() {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    const left = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const columns = [
      { label: "No", width: 12 },
      { label: "Indikator", width: 90 },
      { label: "Fakultas / Unit", width: 48 },
      { label: "Target", width: 38 },
      { label: "Realisasi", width: 38 },
      { label: "Dokumen Pendukung", width: 43 },
    ];
    const lineHeight = 4;
    const padding = 2;
    const tableBottom = pageHeight - 17;

    const drawTableHeader = (y: number) => {
      let x = left;
      const height = 9;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      columns.forEach((column) => {
        doc.setFillColor(11, 91, 53);
        doc.setDrawColor(180, 195, 184);
        doc.rect(x, y, column.width, height, "FD");
        doc.setTextColor(255, 255, 255);
        doc.text(
          doc.splitTextToSize(column.label, column.width - padding * 2),
          x + padding,
          y + 5.5,
        );
        x += column.width;
      });
      return y + height;
    };

    const drawPageHeading = (continued = false) => {
      doc.setTextColor(23, 35, 29);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("UNIVERSITAS ISLAM NEGERI AR-RANIRY", pageWidth / 2, 15, {
        align: "center",
      });
      doc.setFontSize(12);
      doc.text("FORMULIR CAPAIAN KINERJA", pageWidth / 2, 25, {
        align: "center",
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(
        `Fakultas / Unit: ${selectedFaculty}   |   Triwulan: ${selectedQuarter}${continued ? " (Lanjutan)" : ""}`,
        left,
        34,
      );
      return drawTableHeader(39);
    };

    let y = drawPageHeading();
    filteredRows.forEach((row, index) => {
      const values = [
          String(index + 1),
          row.name,
          row.facultyName,
          row.target > 0 ? `${formatNumber(row.target)} ${row.unit}` : "-",
          `${formatNumber(row.realization)} ${row.unit}`,
          row.documentLink ? "Tersedia" : "-",
      ];
      const wrapped = values.map((value, columnIndex) =>
        doc.splitTextToSize(value, columns[columnIndex].width - padding * 2),
      );
      const linesPerChunk = Math.max(
        1,
        Math.floor((tableBottom - y - padding * 2) / lineHeight),
      );
      const lineCount = Math.max(...wrapped.map((lines) => lines.length));

      for (let offset = 0; offset < lineCount; offset += linesPerChunk) {
        if (y + padding * 2 + Math.min(linesPerChunk, lineCount - offset) * lineHeight > tableBottom) {
          doc.addPage();
          y = drawPageHeading(true);
        }
        const chunkLines = Math.min(linesPerChunk, lineCount - offset);
        const rowHeight = chunkLines * lineHeight + padding * 2;
        let x = left;
        columns.forEach((column, columnIndex) => {
          doc.setFillColor(index % 2 === 0 ? 255 : 248, 255, index % 2 === 0 ? 255 : 249);
          doc.setDrawColor(205, 216, 207);
          doc.rect(x, y, column.width, rowHeight, "FD");
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(23, 35, 29);
          const lines = wrapped[columnIndex].slice(offset, offset + chunkLines);
          if (lines.length > 0) {
            doc.text(lines, x + padding, y + padding + lineHeight * 0.8);
          }
          x += column.width;
        });
        y += rowHeight;
      }
    });

    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(90, 105, 96);
      doc.text(`Dicetak: ${new Date().toLocaleString("id-ID")}`, left, pageHeight - 8);
      doc.text(`Halaman ${page} dari ${pageCount}`, pageWidth - left, pageHeight - 8, {
        align: "right",
      });
    }
    doc.save("laporan-kinerja-indikator.pdf");
  }

  function exportExcel() {
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["FORMULIR CAPAIAN KINERJA"],
      [`Fakultas / Unit: ${selectedFaculty}`],
      [`Triwulan: ${selectedQuarter}`],
      [],
      ["No", "Indikator", "Target", "Realisasi", "Dokumen Pendukung"],
      ...filteredRows.map((row, index) => [
        index + 1,
        row.name,
        row.target > 0 ? `${formatNumber(row.target)} ${row.unit}` : "-",
        `${formatNumber(row.realization)} ${row.unit}`,
        row.documentLink ? "Ada" : "-",
      ]),
    ]);
    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 42 },
      { wch: 18 },
      { wch: 20 },
      { wch: 18 },
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
            Formulir Capaian Kinerja
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-[#0B5B35] bg-white px-4 py-2 text-sm font-semibold text-[#0B5B35]"
          >
            Cetak
          </button>
          <button
            type="button"
            onClick={exportPdf}
            className="rounded-lg bg-[#0B5B35] px-4 py-2 text-sm font-semibold text-white"
          >
            Export PDF
          </button>
          <button
            type="button"
            onClick={exportExcel}
            className="rounded-lg bg-[#C49A45] px-4 py-2 text-sm font-semibold text-[#073B25]"
          >
            Export Excel
          </button>
        </div>
      </div>

      <div className="print-hidden flex flex-wrap gap-3 rounded-xl border border-[#DCE6DF] bg-white p-4">
        {canFilterFaculty && (
          <label className="flex min-w-52 flex-1 flex-col gap-1 text-xs font-semibold text-[#44534B]">
            Fakultas
            <select
              className="form-input py-2"
              value={faculty}
              onChange={(event) => setFaculty(event.target.value)}
            >
              <option value="all">Semua Fakultas</option>
              {faculties.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="flex min-w-52 flex-1 flex-col gap-1 text-xs font-semibold text-[#44534B]">
          Triwulan
          <select
            className="form-input py-2"
            value={quarter}
            onChange={(event) => setQuarter(event.target.value)}
          >
            <option value="all">Semua Triwulan</option>
            {quarters.map((item) => (
              <option key={item} value={item ?? ""}>
                {quarterLabels[item ?? ""] ?? item}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="report-paper rounded-xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-8">
        <header className="border-b-2 border-[#0B5B35] pb-5 text-center">
          <p className="text-sm font-bold tracking-wide text-[#0B5B35]">
            UNIVERSITAS ISLAM NEGERI AR-RANIRY
          </p>
          <p className="mt-1 text-xs font-semibold tracking-[0.16em] text-[#64736A]">
            BIRO ADMINISTRASI UMUM
          </p>
          <h2 className="mt-4 text-xl font-bold text-[#17231D]">
            FORMULIR CAPAIAN KINERJA
          </h2>
          <p className="mt-2 text-sm text-[#64736A]">
            {headingFaculty} · {selectedQuarter}
          </p>
        </header>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead className="bg-[#0B5B35] text-left text-white">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Indikator</th>
                <th className="p-3">Fakultas / Unit</th>
                <th className="p-3">Target</th>
                <th className="p-3">Realisasi</th>
                <th className="p-3">Dokumen Pendukung</th>
                <th className="p-3">Capaian</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => (
                <tr
                  key={`${row.name}-${row.facultyName}-${index}`}
                  className="border-b border-[#DCE6DF] align-top"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{row.name}</td>
                  <td className="p-3">{row.facultyName}</td>
                  <td className="p-3">
                    {row.target > 0 ? `${formatNumber(row.target)} ${row.unit}` : "-"}
                  </td>
                  <td className="p-3">
                    {formatNumber(row.realization)} {row.unit}
                  </td>
                  <td className="p-3">
                    {row.documentLink ? (
                      <a href={row.documentLink} target="_blank" rel="noreferrer" className="font-semibold text-[#0B5B35] underline">
                        Lihat dokumen
                      </a>
                    ) : (
                      <span className="text-[#64736A]">-</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold">{achievement(row)}%</td>
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#64736A]">
                    Tidak ada data untuk filter yang dipilih.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <footer className="mt-8 flex justify-between border-t border-[#DCE6DF] pt-3 text-xs text-[#64736A]">
          <span>Dicetak: {new Date().toLocaleDateString("id-ID")}</span>
          <span>Halaman 1</span>
        </footer>
      </section>
    </div>
  );
}
