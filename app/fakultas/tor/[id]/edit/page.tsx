import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateTor } from "../../actions";
import TorForm from "@/components/TorForm";
export default async function EditTorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const supabase = await createClient();
  const { data: tor } = await supabase.from("budget_tors").select("*").eq("id", id).single();
  if (!tor) notFound();
  const { data: proposals } = await supabase.from("budget_proposals").select("id,number,program,kegiatan,uraian,volume,satuan,harga_satuan,sumber_dana").order("created_at", { ascending: false });
  async function action(formData: FormData) { "use server"; await updateTor(id, formData); }
  return <div className="mx-auto max-w-3xl"><h1 className="mb-6 text-2xl font-bold">Edit TOR</h1><TorForm action={action} proposals={proposals ?? []} initial={tor} /></div>;
}
