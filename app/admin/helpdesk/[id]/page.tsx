import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import HelpdeskChat, { type HelpdeskMessage } from "@/components/HelpdeskChat";

export default async function ThreadDetailAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: thread } = await supabase.from("helpdesk_threads").select("*, faculties(name)").eq("id", id).single();
  if (!thread) notFound();
  const { data: messages } = await supabase.from("helpdesk_messages").select("*").eq("thread_id", id).order("created_at", { ascending: true });
  const faculty = Array.isArray(thread.faculties) ? thread.faculties[0] : thread.faculties;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0B5B35]">Helpdesk</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-[#17231D]">{thread.title}</h1><p className="mt-2 text-sm text-[#64736A]">{faculty?.name ?? "Fakultas / Unit"}</p></div>
      <HelpdeskChat threadId={id} initialMessages={(messages ?? []) as HelpdeskMessage[]} currentRole="admin" />
    </div>
  );
}
