import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { verifyProposal } from "../actions";
import StatusBadge from "@/components/StatusBadge";

export default async function UsulanDetailAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proposal } = await supabase
    .from("budget_proposals")
    .select("*, faculties(name)")
    .eq("id", id)
    .single();
  if (!proposal) notFound();

  const { data: history } = await supabase
    .from("budget_history")
    .select("*")
    .eq("entity_type", "proposal")
    .eq("entity_id", id)
    .order("created_at", { ascending: true });

  const canReview =
    proposal.status === "Diajukan" || proposal.status === "Diverifikasi";

  async function approve(formData: FormData) {
    "use server";
    await verifyProposal(
      id,
      "Disetujui",
      (formData.get("note") as string) || "Disetujui.",
    );
  }
  async function reject(formData: FormData) {
    "use server";
    await verifyProposal(id, "Ditolak", formData.get("note") as string);
  }
  async function requestFix(formData: FormData) {
    "use server";
    await verifyProposal(id, "Perlu Perbaikan", formData.get("note") as string);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-xl font-semibold">{proposal.number}</h1>
      <p className="text-sm text-[#5B5A55] mb-2">
        {(proposal as any).faculties.name}
      </p>
      <div className="mb-4">
        <StatusBadge status={proposal.status} />
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

      <div className="bg-white border border-[#E1DDCF] rounded-lg p-4 mb-4">
        <div className="font-semibold text-sm mb-2">Riwayat</div>
        {history?.map((h) => (
          <div key={h.id} className="text-xs text-[#5B5A55] mb-1">
            {new Date(h.created_at).toLocaleDateString("id-ID")} — {h.event}
          </div>
        ))}
      </div>

      {canReview && (
        <div className="bg-white border border-[#E1DDCF] rounded-lg p-4">
          <div className="font-semibold text-sm mb-2">Tindakan Verifikasi</div>
          <form className="flex flex-col gap-3">
            <textarea
              name="note"
              placeholder="Catatan verifikator (wajib untuk Tolak / Perlu Perbaikan)"
              className="border border-[#E1DDCF] rounded-md p-2 text-sm min-h-[60px]"
            />
            <div className="flex gap-2 flex-wrap">
              <button
                formAction={approve}
                className="bg-green-700 text-white text-sm px-4 py-2 rounded-md"
              >
                Setujui
              </button>
              <button
                formAction={requestFix}
                className="bg-amber-600 text-white text-sm px-4 py-2 rounded-md"
              >
                Perlu Perbaikan
              </button>
              <button
                formAction={reject}
                className="bg-red-600 text-white text-sm px-4 py-2 rounded-md"
              >
                Tolak
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
