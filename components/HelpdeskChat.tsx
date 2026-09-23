"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type HelpdeskMessage = {
  id: string;
  thread_id: string;
  sender_id: string;
  from_role: "user" | "admin";
  text: string;
  created_at: string;
};

export default function HelpdeskChat({
  threadId,
  initialMessages,
  currentRole,
}: {
  threadId: string;
  initialMessages: HelpdeskMessage[];
  currentRole: "user" | "admin";
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`helpdesk-thread-${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "helpdesk_messages",
          filter: `thread_id=eq.${threadId}`,
        },
        (payload) => {
          const message = payload.new as HelpdeskMessage;
          setMessages((previous) =>
            previous.some((item) => item.id === message.id)
              ? previous
              : [...previous, message],
          );
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText || sending) return;

    setSending(true);
    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data.user) {
      setSending(false);
      alert("Sesi pengguna tidak ditemukan. Silakan masuk kembali.");
      return;
    }

    const { error } = await supabase.from("helpdesk_messages").insert({
      thread_id: threadId,
      sender_id: data.user.id,
      from_role: currentRole,
      text: trimmedText,
    });

    if (error) {
      alert(`Gagal mengirim pesan: ${error.message}`);
    } else {
      setText("");
    }
    setSending(false);
  }

  const selfLabel = currentRole === "user" ? "Anda" : "Admin";
  const otherLabel = currentRole === "user" ? "Admin" : "Fakultas";

  return (
    <div className="flex min-h-[calc(100vh-260px)] flex-col gap-4">
      <div className="flex-1 overflow-y-auto rounded-2xl border border-[#DCE6DF] bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4">
          {messages.map((message) => {
            const isSelf = message.from_role === currentRole;
            return (
              <div key={message.id} className={`max-w-[85%] ${isSelf ? "self-end" : "self-start"}`}>
                <p className={`mb-1 text-[11px] text-[#849289] ${isSelf ? "text-right" : ""}`}>
                  {isSelf ? selfLabel : otherLabel} ·{" "}
                  {new Date(message.created_at).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${isSelf ? "rounded-br-md bg-[#0B5B35] text-white" : "rounded-bl-md bg-[#F1F6F2] text-[#334A3C]"}`}>
                  {message.text}
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <p className="py-10 text-center text-sm text-[#849289]">Belum ada pesan.</p>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <form onSubmit={handleSend} className="flex gap-3">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Tulis pesan..."
          className="form-input"
          disabled={sending}
        />
        <button type="submit" disabled={sending || !text.trim()} className="rounded-xl bg-[#0B5B35] px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
          {sending ? "Mengirim..." : "Kirim"}
        </button>
      </form>
    </div>
  );
}
