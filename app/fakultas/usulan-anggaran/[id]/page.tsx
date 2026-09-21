import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { submitProposal } from "../actions";
import StatusBadge from "@/components/StatusBadge";
import DeleteProposalButton from "@/components/DeleteProposalButton";
import DocumentUploader from "@/components/DocumentUploader";

export default async function UsulanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proposal } = await supabase
    .from("budget_proposals")
    .select("*")
    .eq("id", id)
    .single();
  if (!proposal) notFound();

  // ...di dalam komponen, setelah query proposal:
  const { data: documents } = await supabase
    .from("budget_documents")
    .select("*")
    .eq("entity_type", "proposal")
    .eq("entity_id", id);

  const { data: history } = await supabase
    .from("budget_history")
    .select("*")
    .eq("entity_type", "proposal")
    .eq("entity_id", id)
    .order("created_at", { ascending: true });

  const editable =
    proposal.status === "Draft" || proposal.status === "Perlu Perbaikan";

  async function handleSubmit() {
    "use server";
    await submitProposal(id);
  }

  const totalAnggaran =
    proposal.total_anggaran ?? proposal.volume * proposal.harga_satuan;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0B5B35]">
            Pengajuan anggaran
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">
            {proposal.number}
          </h1>
          <div className="mt-3">
            <StatusBadge status={proposal.status} />
          </div>
        </div>
        {editable && (
          <div className="flex gap-2">
            <Link
              href={`/fakultas/usulan-anggaran/${id}/edit`}
              className="rounded-xl border border-[#B9D7C1] px-4 py-2 text-sm font-bold text-[#0B5B35] transition hover:bg-[#F0F8F2]"
            >
              Edit
            </Link>
            <DeleteProposalButton id={id} />
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <section className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 border-b border-[#EDF2EE] pb-4">
            <h2 className="text-base font-bold text-[#17231D]">
              Informasi usulan
            </h2>
            <p className="mt-1 text-xs text-[#849289]">
              Ringkasan program dan kebutuhan anggaran yang diajukan.
            </p>
          </div>
          <dl className="grid gap-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-[#849289]">Tahun anggaran</dt>
              <dd className="mt-1 font-semibold text-[#334A3C]">{proposal.year}</dd>
            </div>
            <div>
              <dt className="text-xs text-[#849289]">Program</dt>
              <dd className="mt-1 font-semibold text-[#334A3C]">{proposal.program}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-[#849289]">Kegiatan</dt>
              <dd className="mt-1 font-semibold text-[#334A3C]">{proposal.kegiatan || "—"}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-2xl border border-[#B9D7C1] bg-[#F1F8F3] p-5 shadow-sm sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#64736A]">
            Total anggaran
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-[#0B5B35]">
            Rp {Number(totalAnggaran).toLocaleString("id-ID")}
          </p>
          <p className="mt-2 text-xs leading-5 text-[#64736A]">
            Nilai total pengajuan untuk program ini.
          </p>
        </section>
      </div>

      <section className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-[#17231D]">Uraian kebutuhan</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#52645A]">
          {proposal.uraian}
        </p>
      </section>

      {proposal.tor_link && (
        <section className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-base font-bold text-[#17231D]">Dokumen TOR</h2>
          <a
            href={proposal.tor_link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex text-sm font-bold text-[#0B5B35] hover:underline"
          >
            Buka link dokumen TOR
          </a>
        </section>
      )}

      {proposal.catatan_verifikator && (
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5 text-sm text-orange-700">
          <p className="font-bold">Catatan verifikator</p>
          <p className="mt-1 leading-6">{proposal.catatan_verifikator}</p>
        </div>
      )}

      <section className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-bold text-[#17231D]">Riwayat pengajuan</h2>
        <div className="mt-4 flex flex-col">
          {history?.map((h) => (
            <div key={h.id} className="flex gap-3 border-l-2 border-[#B9D7C1] pb-4 pl-4 last:pb-0">
              <div>
                <p className="text-sm font-semibold text-[#334A3C]">{h.event}</p>
                <p className="mt-1 text-xs text-[#849289]">
                  {new Date(h.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
          ))}
          {history?.length === 0 && (
            <p className="text-sm text-[#849289]">Belum ada riwayat pengajuan.</p>
          )}
        </div>
      </section>

      <div className="rounded-2xl border border-[#DCE6DF] bg-white p-5 shadow-sm sm:p-6">
        <DocumentUploader
          entityType="proposal"
          entityId={id}
          facultyId={proposal.faculty_id}
          documents={documents ?? []}
          editable={true}
        />
      </div>

      {editable && (
        <form action={handleSubmit} className="flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-[#0B5B35] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#073B25]"
          >
            Ajukan ke Biro AUPK
          </button>
        </form>
      )}
    </div>
  );
}
