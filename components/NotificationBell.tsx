"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/lib/notifications";

function relativeTime(value: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "Baru saja";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

type Feedback = {
  type: "success" | "error";
  message: string;
};

export default function NotificationBell({
  userId,
  initialNotifications,
}: {
  userId: string;
  initialNotifications: Notification[];
}) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);
  const [realtimeReady, setRealtimeReady] = useState(false);
  const [helpdeskToast, setHelpdeskToast] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const knownNotificationIds = useRef(new Set(initialNotifications.map((item) => item.id)));
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);
  const unreadCount = notifications.filter((item) => !item.read).length;

  function showFeedback(nextFeedback: Feedback) {
    setFeedback(nextFeedback);
    window.setTimeout(() => setFeedback(null), 3500);
  }

  useEffect(() => {
    if (!open) return;

    function handleOutsidePointerDown(event: PointerEvent) {
      const target = event.target;
      if (target instanceof Node && !dropdownRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [open]);

  useEffect(() => {
    function showHelpdeskToast(notification: Notification) {
      if (
        notification.text.startsWith("Pesan Help Desk baru") ||
        notification.text.startsWith("Pesan baru di Help Desk:")
      ) {
        setHelpdeskToast(notification.text);
        window.setTimeout(() => setHelpdeskToast(null), 5000);
      }
    }

    async function refreshNotifications() {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        for (const notification of data as Notification[]) {
          if (!knownNotificationIds.current.has(notification.id)) {
            knownNotificationIds.current.add(notification.id);
            showHelpdeskToast(notification);
          }
        }
        setNotifications(data as Notification[]);
      }
    }

    void refreshNotifications();
    const refreshTimer = window.setInterval(() => {
      void refreshNotifications();
    }, 15000);

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as Notification;
          if (knownNotificationIds.current.has(notification.id)) return;
          knownNotificationIds.current.add(notification.id);
          setNotifications((current) =>
            current.some((item) => item.id === notification.id)
              ? current
              : [notification, ...current].slice(0, 20),
          );
          showHelpdeskToast(notification);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new as Notification;
          setNotifications((current) =>
            current.map((item) =>
              item.id === notification.id ? notification : item,
            ),
          );
        },
      )
      .subscribe((status) => {
        setRealtimeReady(status === "SUBSCRIBED");
      });

    return () => {
      window.clearInterval(refreshTimer);
      void supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  async function markRead(id: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id)
      .eq("user_id", userId);
    if (error) {
      showFeedback({ type: "error", message: `Gagal menandai notifikasi: ${error.message}` });
      return;
    }
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
    showFeedback({ type: "success", message: "Notifikasi ditandai sudah dibaca." });
  }

  async function markAllRead() {
    if (unreadCount === 0) return;
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false);
    if (error) {
      showFeedback({ type: "error", message: `Gagal menandai semua notifikasi: ${error.message}` });
      return;
    }
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    showFeedback({ type: "success", message: "Semua notifikasi ditandai sudah dibaca." });
  }

  async function deleteNotification(id: string) {
    const previous = notifications;
    setNotifications((current) => current.filter((item) => item.id !== id));

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      setNotifications(previous);
      showFeedback({ type: "error", message: `Gagal menghapus notifikasi: ${error.message}` });
      return;
    }
    showFeedback({ type: "success", message: "Notifikasi berhasil dihapus." });
  }

  async function deleteAllNotifications() {
    if (notifications.length === 0) return;

    const previous = notifications;
    setNotifications([]);

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("user_id", userId);

    if (error) {
      setNotifications(previous);
      showFeedback({ type: "error", message: `Gagal menghapus semua notifikasi: ${error.message}` });
      return;
    }
    showFeedback({ type: "success", message: "Semua notifikasi berhasil dihapus." });
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        aria-label={`Notifikasi, ${unreadCount} belum dibaca`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-xl p-2.5 text-[#496056] transition hover:bg-[#EAF3ED] hover:text-[#0B5B35]"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#B8862E] px-1 text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#E1DDCF] bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-[#E1DDCF] bg-[#F6F4EF] px-4 py-3">
            <div>
              <p className="text-sm font-bold text-[#1B2A4B]">Notifikasi</p>
              <p className="mt-0.5 text-[10px] text-[#5B5A55]">
                {realtimeReady ? "Live" : "Memperbarui otomatis"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => void markAllRead()}
                disabled={unreadCount === 0}
                className="text-xs font-bold text-[#1B2A4B] hover:underline disabled:cursor-not-allowed disabled:opacity-40"
              >
                Tandai semua dibaca
              </button>
              <button
                type="button"
                onClick={() => void deleteAllNotifications()}
                disabled={notifications.length === 0}
                className="text-xs font-bold text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
              >
                Hapus semua
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-10 text-center text-sm text-[#5B5A55]">Belum ada notifikasi.</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 border-b border-[#E1DDCF] px-4 py-3 transition last:border-0 hover:bg-[#FAF8F3] ${notification.read ? "bg-white" : "bg-[#F3E9D3]"}`}
                >
                  <button
                    type="button"
                    onClick={() => !notification.read && void markRead(notification.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="text-sm font-semibold text-[#1B2A4B]">{notification.text}</p>
                    <p className="mt-1 text-[11px] text-[#5B5A55]">{relativeTime(notification.created_at)}</p>
                  </button>
                  <button
                    type="button"
                    aria-label="Hapus notifikasi"
                    onClick={() => void deleteNotification(notification.id)}
                    className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-[#8A6B2E] hover:bg-white hover:text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              ))
            )}
            {feedback && (
              <div
                role="status"
                aria-live="polite"
                className={`fixed bottom-5 left-1/2 z-[10000] -translate-x-1/2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
                  feedback.type === "success" ? "bg-[#0B5B35]" : "bg-[#B42318]"
                }`}
              >
                {feedback.message}
              </div>
            )}
          </div>
        </div>
      )}
      {helpdeskToast && typeof document !== "undefined" && createPortal(
        <div
          role="status"
          aria-live="polite"
          style={{ position: "fixed", right: "1.25rem", bottom: "1.25rem", top: "auto", left: "auto" }}
          className="z-[9999] flex max-w-[min(24rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border border-[#0A472A] bg-[#0B5B35] px-4 py-3 text-white shadow-[0_14px_40px_rgba(7,59,37,0.35)]"
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#C49A45] text-white shadow-sm">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.8 9.8 0 0 1-4-.8L3 21l1.8-4.2A8.1 8.1 0 0 1 3 11.5 8.6 8.6 0 0 1 12 3a8.6 8.6 0 0 1 9 8.5Z" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#F7E8B7]">Pesan Helpdesk baru</p>
            <p className="mt-0.5 truncate text-sm font-semibold text-white">{helpdeskToast}</p>
          </div>
          <button
            type="button"
            aria-label="Tutup notifikasi Helpdesk"
            onClick={() => setHelpdeskToast(null)}
            className="text-lg leading-none text-white/70 hover:text-white"
          >
            ×
          </button>
        </div>,
        document.body,
      )}
    </div>
  );
}
