import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { submitTor } from "../actions";
import StatusBadge from "@/components/StatusBadge";
import DocumentUploader from "@/components/DocumentUploader";
import DeleteTorButton from "@/components/DeleteTorButton";
export default async function TorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const supabase = await createClient();
  const { data: tor } = await supabase.from("budget_tors").select("*").eq("id", id).single(); if (!tor) notFound();
  const [{ data: documents }, { data: history }] = await Promise.all([
    supabase.from("budget_documents").select("*").eq("entity_type", "tor").eq("entity_id", id),
    supabase.from("budget_history").select("*").eq("entity_type", "tor").eq("entity_id", id).order("created_at", { ascending: true }),
  ]);
  const editable = ["Draft", "Perlu Perbaikan", "Ditolak"].includes(tor.status);
  async function submit() { "use server"; await submitTor(id); }
  const details = [["Program", tor.program], ["Kegiatan", tor.kegiatan], ["Sumber Dana", tor.sumber_dana], ["Dasar Hukum", tor.dasar_hukum], ["Tujuan", tor.tujuan], ["Output", tor.output], ["Outcome", tor.outcome], ["Indikator Keberhasilan", tor.indikator_keberhasilan], ["Lokasi", tor.lokasi], ["Waktu Pelaksanaan", tor.waktu_pelaksanaan], ["Peserta", tor.peserta], ["Narasumber", tor.narasumber], ["Metode Pelaksanaan", tor.metode_pelaksanaan], ["Rincian Anggaran", tor.rincian_anggaran]];
  return <div className="max-w-3xl"><div className="mb-4 flex items-start justify-between"><div><h1 className="text-xl font-bold">{tor.number}</h1><h2 className="mt-1 text-lg">{tor.judul}</h2><div className="mt-2"><StatusBadge status={tor.status} /></div></div>{editable && <div className="flex gap-3"><Link href={`/fakultas/tor/${id}/edit`} className="text-xs font-semibold text-[#1B2A4B]">Edit</Link><DeleteTorButton id={id} /></div>}</div>
    <div className="grid gap-3 rounded-lg border border-[#E1DDCF] bg-white p-4 text-sm sm:grid-cols-2">{details.map(([label, val]) => <div key={label}><div className="text-xs text-[#5B5A55]">{label}</div><div className="whitespace-pre-line font-semibold">{val || "—"}</div></div>)}<div className="sm:col-span-2"><div className="text-xs text-[#5B5A55]">Latar Belakang</div><div className="whitespace-pre-line">{tor.latar_belakang}</div></div></div>
    {tor.catatan_verifikator && <div className="my-4 rounded-md bg-orange-50 p-3 text-sm text-orange-700"><strong>Catatan Verifikator:</strong> {tor.catatan_verifikator}</div>}
    <div className="my-4 rounded-lg border border-[#E1DDCF] bg-white p-4"><div className="mb-2 font-semibold text-sm">Riwayat</div>{history?.map((h) => <div key={h.id} className="mb-1 text-xs text-[#5B5A55]">{new Date(h.created_at).toLocaleDateString("id-ID")} — {h.event}</div>)}</div>
    <DocumentUploader entityType="tor" entityId={id} facultyId={tor.faculty_id} documents={documents ?? []} editable={editable} />
    {editable && <form action={submit}><button className="rounded-md bg-[#1B2A4B] px-4 py-2 text-sm text-white">Ajukan ke Biro AUPK</button></form>}
  </div>;
}
