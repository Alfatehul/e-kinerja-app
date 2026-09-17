import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { submitProposal } from "../actions";
import StatusBadge from "@/components/StatusBadge";
import DeleteProposalButton from "@/components/DeleteProposalButton";

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

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="font-serif text-xl font-semibold">
            {proposal.number}
          </h1>
          <div className="mt-2">
            <StatusBadge status={proposal.status} />
          </div>
        </div>
        {editable && (
          <div className="flex gap-3">
            <Link
              href={`/fakultas/usulan-anggaran/${id}/edit`}
              className="text-[#1B2A4B] text-xs font-semibold hover:underline self-center"
            >
              Edit
            </Link>
            <DeleteProposalButton id={id} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm bg-white border border-[#E1DDCF] rounded-lg p-4 mb-4">
        <div>
          <div className="text-[#5B5A55] text-xs">Tahun</div>
          <div className="font-semibold">{proposal.year}</div>
        </div>
        <div>
          <div className="text-[#5B5A55] text-xs">Sumber Dana</div>
          <div className="font-semibold">{proposal.sumber_dana}</div>
        </div>
        <div>
          <div className="text-[#5B5A55] text-xs">Program</div>
          <div className="font-semibold">{proposal.program}</div>
        </div>
        <div>
          <div className="text-[#5B5A55] text-xs">Kegiatan</div>
          <div className="font-semibold">{proposal.kegiatan}</div>
        </div>
        <div>
          <div className="text-[#5B5A55] text-xs">Subkegiatan</div>
          <div className="font-semibold">{proposal.subkegiatan}</div>
        </div>
      </div>

      <div className="bg-[#F6F4EF] border border-[#E1DDCF] rounded-lg p-4 mb-4 text-sm">
        <div className="mb-2">{proposal.uraian}</div>
        <div className="flex gap-3 items-center">
          <span>
            {proposal.volume} {proposal.satuan}
          </span>
          <span>×</span>
          <span>
            Rp {Number(proposal.harga_satuan).toLocaleString("id-ID")}
          </span>
          <span>=</span>
          <span className="font-bold text-[#1B2A4B]">
            Rp{" "}
            {Number(proposal.volume * proposal.harga_satuan).toLocaleString(
              "id-ID",
            )}
          </span>
        </div>
      </div>

      {proposal.catatan_verifikator && (
        <div className="bg-orange-50 text-orange-700 text-sm p-3 rounded-md mb-4">
          <strong>Catatan Verifikator:</strong> {proposal.catatan_verifikator}
        </div>
      )}

      <div className="bg-white border border-[#E1DDCF] rounded-lg p-4 mb-4">
        <div className="font-semibold text-sm mb-2">Riwayat</div>
        {history?.map((h) => (
          <div key={h.id} className="text-xs text-[#5B5A55] mb-1">
            {new Date(h.created_at).toLocaleDateString("id-ID")} — {h.event}
          </div>
        ))}
      </div>

      {editable && (
        <form action={handleSubmit}>
          <button
            type="submit"
            className="bg-[#1B2A4B] text-white text-sm px-4 py-2 rounded-md"
          >
            Ajukan ke Biro AUPK
          </button>
        </form>
      )}
    </div>
  );
}
