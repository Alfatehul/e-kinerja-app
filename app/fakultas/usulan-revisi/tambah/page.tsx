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
    <div className="max-w-2xl">
      <h1 className="font-serif text-xl font-semibold mb-4">
        Ajukan Usulan Revisi
      </h1>
      {proposals?.length === 0 ? (
        <p className="text-sm text-[#5B5A55]">
          Belum ada usulan anggaran berstatus "Disetujui" yang bisa direvisi.
        </p>
      ) : (
        <RevisionForm proposals={proposals ?? []} />
      )}
    </div>
  );
}
