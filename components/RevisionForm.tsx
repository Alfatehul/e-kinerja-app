"use client";

import { useState } from "react";
import Link from "next/link";
import { createRevision } from "@/app/fakultas/usulan-revisi/actions";

type Proposal = {
  id: string;
  number: string;
  program: string;
  uraian: string;
  total_anggaran: number | null;
  volume: number;
  harga_satuan: number;
};

export default function RevisionForm({ proposals }: { proposals: Proposal[] }) {
  const [proposalId, setProposalId] = useState(proposals[0]?.id ?? "");
  const proposal = proposals.find((p) => p.id === proposalId);
  const [afterUraian, setAfterUraian] = useState(proposal?.uraian ?? "");
  const [afterHarga, setAfterHarga] = useState(proposal?.total_anggaran ?? (proposal?.volume ?? 0) * (proposal?.harga_satuan ?? 0));

  function pickProposal(id: string) {
    setProposalId(id);
    const p = proposals.find((x) => x.id === id);
    setAfterUraian(p?.uraian ?? "");
    setAfterHarga(p?.total_anggaran ?? (p?.volume ?? 0) * (p?.harga_satuan ?? 0));
  }

  const selisih = proposal
    ? afterHarga - (proposal.total_anggaran ?? proposal.volume * proposal.harga_satuan)
    : 0;

  return (
    <form action={createRevision} className="flex flex-col gap-6 rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-7">
      <div className="border-b border-[#EDF2EE] pb-5">
        <h2 className="text-base font-bold text-[#17231D]">Referensi usulan</h2>
        <p className="mt-1 text-xs text-[#849289]">Pilih usulan yang akan menjadi dasar perubahan.</p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#334A3C]">
          Usulan Anggaran yang Direvisi
        </label>
        <select
          name="proposal_id"
          value={proposalId}
          onChange={(e) => pickProposal(e.target.value)}
          className="form-input"
        >
          {proposals.map((p) => (
            <option key={p.id} value={p.id}>
              {p.number} — {p.program}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#334A3C]">Jenis Revisi</label>
        <input
          name="jenis_revisi"
          required
          className="form-input"
          placeholder="Pergeseran komponen biaya, dsb."
        />
      </div>

      {proposal && (
        <div className="rounded-2xl border border-[#E8DDBB] bg-[#FFFBEF] p-4 text-sm text-[#5F4A20]">
          <div className="text-xs text-[#5B5A55] mb-1">Data Sebelum Revisi</div>
          <div>
            {proposal.uraian} — Total anggaran{" "}
            <strong>
              Rp{" "}
              {Number(proposal.total_anggaran ?? proposal.volume * proposal.harga_satuan).toLocaleString("id-ID")}
            </strong>
          </div>
        </div>
      )}

      <div className="border-t border-[#EDF2EE] pt-6">
        <h2 className="text-base font-bold text-[#17231D]">Rincian perubahan</h2>
        <p className="mt-1 text-xs text-[#849289]">Masukkan data baru dan alasan perubahan dengan lengkap.</p>
      </div>
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#334A3C]">
          Uraian Setelah Revisi
        </label>
        <textarea
          name="after_uraian"
          required
          value={afterUraian}
          onChange={(e) => setAfterUraian(e.target.value)}
          className="form-input min-h-[100px] resize-y"
        />
      </div>
      <div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#334A3C]">
            Total Anggaran Baru (Rp)
          </label>
          <input
            name="after_total_anggaran"
            type="number"
            required
            value={afterHarga}
            onChange={(e) => setAfterHarga(Number(e.target.value))}
            className="form-input"
          />
        </div>
      </div>

      {proposal && (
        <div className="rounded-xl bg-[#F5F8F5] px-4 py-3 text-sm text-[#52645A]">
          Selisih perubahan:{" "}
          <strong className={selisih >= 0 ? "text-green-700" : "text-red-600"}>
            {selisih >= 0 ? "+" : ""}Rp{" "}
            {Number(selisih).toLocaleString("id-ID")}
          </strong>
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#334A3C]">
          Alasan Revisi
        </label>
        <textarea
          name="alasan_revisi"
          required
          className="form-input min-h-[100px] resize-y"
        />
      </div>

      <div className="rounded-2xl border border-dashed border-[#B8D8C1] bg-[#F5FAF6] p-5">
        <label htmlFor="revision-document" className="block text-sm font-bold text-[#173B27]">
          Dokumen Pendukung <span className="font-normal text-[#718078]">(opsional)</span>
        </label>
        <p className="mt-1 text-xs text-[#64736A]">
          PDF, Word, atau Excel. Ukuran maksimal 10 MB.
        </p>
        <input
          id="revision-document"
          name="document"
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
          className="mt-3 block w-full cursor-pointer rounded-lg border border-[#DCE6DF] bg-white px-3 py-2 text-sm text-[#44534B] file:mr-3 file:rounded-md file:border-0 file:bg-[#E5F5E9] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#0B5B35]"
        />
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#EDF2EE] pt-5 sm:flex-row sm:justify-end">
        <Link href="/fakultas/usulan-revisi" className="rounded-xl border border-[#DCE6DF] px-5 py-3 text-center text-sm font-semibold text-[#64736A] transition hover:bg-[#F5F8F5]">Batal</Link>
        <button type="submit" className="rounded-xl bg-[#0B5B35] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#073B25]">Ajukan revisi</button>
      </div>
    </form>
  );
}
