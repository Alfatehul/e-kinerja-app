"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

export default function ConfirmSubmitButton({
  children = "Hapus",
  message = "Data ini akan dihapus permanen. Lanjutkan?",
  className,
}: {
  children?: ReactNode;
  message?: string;
  className?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <span ref={(element) => {
        formRef.current = element?.closest("form") ?? null;
      }}>
        <button type="button" onClick={() => setOpen(true)} className={className}>
          {children}
        </button>
      </span>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-2xl border border-[#E1DDCF] bg-white p-5 shadow-2xl">
            <h2 className="text-base font-bold text-[#1B2A4B]">Konfirmasi penghapusan</h2>
            <p className="mt-2 text-sm leading-6 text-[#5B5A55]">{message}</p>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-[#E1DDCF] px-4 py-2 text-sm font-semibold text-[#5B5A55]">
                Batal
              </button>
              <button
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                className="rounded-xl bg-[#B42318] px-4 py-2 text-sm font-bold text-white"
              >
                Ya, hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
