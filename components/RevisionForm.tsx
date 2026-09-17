"use client";

import { useState } from "react";
import { createRevision } from "@/app/fakultas/usulan-revisi/actions";

export default function RevisionForm({ proposals }: { proposals: any[] }) {
  const [proposalId, setProposalId] = useState(proposals[0]?.id ?? "");
  const proposal = proposals.find((p) => p.id === proposalId);
  const [afterUraian, setAfterUraian] = useState(proposal?.uraian ?? "");
  const [afterVolume, setAfterVolume] = useState(proposal?.volume ?? 0);
  const [afterHarga, setAfterHarga] = useState(proposal?.harga_satuan ?? 0);

  function pickProposal(id: string) {
    setProposalId(id);
    const p = proposals.find((x) => x.id === id);
    setAfterUraian(p?.uraian ?? "");
    setAfterVolume(p?.volume ?? 0);
    setAfterHarga(p?.harga_satuan ?? 0);
  }

  const selisih = proposal
    ? afterVolume * afterHarga - proposal.volume * proposal.harga_satuan
    : 0;

  return (
    <form
      action={createRevision}
      className="bg-white border border-[#E1DDCF] rounded-lg p-6 flex flex-col gap-4"
    >
      <div>
        <label className="block text-sm font-semibold mb-1">
          Usulan Anggaran yang Direvisi
        </label>
        <select
          name="proposal_id"
          value={proposalId}
          onChange={(e) => pickProposal(e.target.value)}
          className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
        >
          {proposals.map((p) => (
            <option key={p.id} value={p.id}>
              {p.number} — {p.program}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1">Jenis Revisi</label>
        <input
          name="jenis_revisi"
          required
          className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          placeholder="Pergeseran komponen biaya, dsb."
        />
      </div>

      {proposal && (
        <div className="bg-[#F6F4EF] border border-[#E1DDCF] rounded-lg p-3 text-sm">
          <div className="text-xs text-[#5B5A55] mb-1">Data Sebelum Revisi</div>
          <div>
            {proposal.uraian} — {proposal.volume} {proposal.satuan} × Rp{" "}
            {Number(proposal.harga_satuan).toLocaleString("id-ID")} ={" "}
            <strong>
              Rp{" "}
              {Number(proposal.volume * proposal.harga_satuan).toLocaleString(
                "id-ID",
              )}
            </strong>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1">
          Uraian Setelah Revisi
        </label>
        <textarea
          name="after_uraian"
          required
          value={afterUraian}
          onChange={(e) => setAfterUraian(e.target.value)}
          className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm min-h-[60px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Volume Baru
          </label>
          <input
            name="after_volume"
            type="number"
            required
            value={afterVolume}
            onChange={(e) => setAfterVolume(Number(e.target.value))}
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">
            Harga Satuan Baru (Rp)
          </label>
          <input
            name="after_harga_satuan"
            type="number"
            required
            value={afterHarga}
            onChange={(e) => setAfterHarga(Number(e.target.value))}
            className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm"
          />
        </div>
      </div>

      {proposal && (
        <div className="text-sm">
          Selisih:{" "}
          <strong className={selisih >= 0 ? "text-green-700" : "text-red-600"}>
            {selisih >= 0 ? "+" : ""}Rp{" "}
            {Number(selisih).toLocaleString("id-ID")}
          </strong>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-1">
          Alasan Revisi
        </label>
        <textarea
          name="alasan_revisi"
          required
          className="w-full border border-[#E1DDCF] rounded-md p-2 text-sm min-h-[60px]"
        />
      </div>

      <button
        type="submit"
        className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md self-start"
      >
        Ajukan Revisi
      </button>
    </form>
  );
}
