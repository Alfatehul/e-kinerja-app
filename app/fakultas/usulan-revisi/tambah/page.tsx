import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import RevisionForm from "@/components/RevisionForm";

export default async function TambahRevisiPage() {
  const session = await getCurrentProfile();
  const supabase = await createClient();

  const { data: proposals } = await supabase
    .from("budget_proposals")
    .select("*")
    .eq("faculty_id", session!.profile.faculty_id)
    .eq("status", "Disetujui");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">Pengajuan perubahan</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">Ajukan Usulan Revisi</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64736A]">Pilih usulan yang sudah disetujui, jelaskan perubahan, dan lampirkan dokumen pendukung bila diperlukan.</p>
      </div>
      {proposals?.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#C9DED0] bg-[#F8FBF8] px-5 py-12 text-center text-sm text-[#718078]">
          Belum ada usulan anggaran berstatus "Disetujui" yang bisa direvisi.
        </div>
      ) : (
        <RevisionForm proposals={proposals ?? []} />
      )}
    </div>
  );
}
