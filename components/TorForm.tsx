"use client";

import { useState } from "react";

type Proposal = {
  id: string;
  number: string;
  program: string;
  kegiatan: string | null;
  uraian: string;
  volume: number;
  satuan: string | null;
  harga_satuan: number;
  sumber_dana: string | null;
};

const fields = [
  ["judul", "Judul TOR", true], ["latar_belakang", "Latar Belakang", true], ["dasar_hukum", "Dasar Hukum", false],
  ["tujuan", "Tujuan", true], ["output", "Output", false], ["outcome", "Outcome", false],
  ["indikator_keberhasilan", "Indikator Keberhasilan", false], ["lokasi", "Lokasi", false],
  ["waktu_pelaksanaan", "Waktu Pelaksanaan", false], ["peserta", "Peserta", false],
  ["narasumber", "Narasumber", false], ["metode_pelaksanaan", "Metode Pelaksanaan", false],
] as const;

export default function TorForm({ action, proposals, initial }: { action: (data: FormData) => void; proposals: Proposal[]; initial?: Partial<Proposal> & Record<string, string | null | undefined> }) {
  const [proposalId, setProposalId] = useState(initial?.proposal_id ?? "");
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map(([name]) => [name, initial?.[name] ?? ""])));
  const [budget, setBudget] = useState({
    program: initial?.program ?? "", kegiatan: initial?.kegiatan ?? "", rincian_anggaran: initial?.rincian_anggaran ?? "",
    sumber_dana: initial?.sumber_dana ?? "",
  });
  function choose(id: string) {
    setProposalId(id);
    const p = proposals.find((item) => item.id === id);
    if (!p) return;
    setBudget({ program: p.program, kegiatan: p.kegiatan ?? "", rincian_anggaran: `${p.uraian} (${p.volume} ${p.satuan ?? ""} x Rp ${Number(p.harga_satuan).toLocaleString("id-ID")})`, sumber_dana: p.sumber_dana ?? "" });
  }
  return <form action={action} className="flex flex-col gap-5 rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-7">
    <div><label className="mb-2 block text-sm font-semibold">Usulan Anggaran (opsional)</label><select name="proposal_id" value={proposalId} onChange={(e) => choose(e.target.value)} className="form-input"><option value="">Tidak menghubungkan</option>{proposals.map((p) => <option key={p.id} value={p.id}>{p.number} — {p.program}</option>)}</select></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div><label className="mb-2 block text-sm font-semibold">Tahun Anggaran</label><input name="year" defaultValue={initial?.year ?? "2026"} className="form-input" required /></div>
      <div><label className="mb-2 block text-sm font-semibold">Program</label><input name="program" value={budget.program} onChange={(e) => setBudget({ ...budget, program: e.target.value })} className="form-input" required /></div>
      <div><label className="mb-2 block text-sm font-semibold">Kegiatan</label><input name="kegiatan" value={budget.kegiatan} onChange={(e) => setBudget({ ...budget, kegiatan: e.target.value })} className="form-input" /></div>
      <div><label className="mb-2 block text-sm font-semibold">Sumber Dana</label><input name="sumber_dana" value={budget.sumber_dana} onChange={(e) => setBudget({ ...budget, sumber_dana: e.target.value })} className="form-input" /></div>
    </div>
    <div><label className="mb-2 block text-sm font-semibold">Rincian Anggaran</label><textarea name="rincian_anggaran" value={budget.rincian_anggaran} onChange={(e) => setBudget({ ...budget, rincian_anggaran: e.target.value })} className="form-input min-h-[80px]" /></div>
    {fields.map(([name, label, required]) => <div key={name}><label className="mb-2 block text-sm font-semibold">{label}</label><textarea name={name} required={required} value={values[name]} onChange={(e) => setValues({ ...values, [name]: e.target.value })} className="form-input min-h-[80px]" /></div>)}
    <div><label className="mb-2 block text-sm font-semibold">Dokumen Pendukung <span className="font-normal text-[#718078]">(opsional)</span></label><input name="document" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" className="block w-full rounded-lg border border-[#DCE6DF] px-3 py-2 text-sm" /></div>
    <button type="submit" className="self-start rounded-xl bg-[#0B5B35] px-5 py-3 text-sm font-bold text-white">Simpan sebagai draft</button>
  </form>;
}
