"use client";

import { useState } from "react";
import { useToast } from "./ToastProvider";
import LoadingSpinner from "./LoadingSpinner";

export default function ConfirmActionButton({
  onConfirm,
  message,
  className,
}: {
  onConfirm: () => Promise<void>;
  message: string;
  className: string;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const { success, error } = useToast();

  async function confirmAction() {
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
      success("Data berhasil dihapus.");
    } catch (caughtError) {
      const digest =
        typeof caughtError === "object" &&
        caughtError !== null &&
        "digest" in caughtError &&
        typeof caughtError.digest === "string"
          ? caughtError.digest
          : "";
      const isRedirect =
        (caughtError instanceof Error &&
          caughtError.message.includes("NEXT_REDIRECT")) ||
        digest.startsWith("NEXT_REDIRECT");
      if (isRedirect) {
        setOpen(false);
        return;
      }
      error(
        caughtError instanceof Error
          ? caughtError.message
          : "Data gagal dihapus. Silakan coba lagi.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" disabled={busy} onClick={() => setOpen(true)} className={className}>
        Hapus
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl border border-[#E1DDCF] bg-white p-5 shadow-2xl"
          >
            <h2 className="text-base font-bold text-[#1B2A4B]">
              Konfirmasi penghapusan
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#5B5A55]">{message}</p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={() => setOpen(false)}
                className="rounded-xl border border-[#E1DDCF] px-4 py-2 text-sm font-semibold text-[#5B5A55]"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void confirmAction()}
                className="rounded-xl bg-[#B42318] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                {busy ? (
                  <span className="inline-flex items-center gap-2">
                    <LoadingSpinner size="sm" color="white" />
                    Menghapus...
                  </span>
                ) : (
                  "Ya, hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
