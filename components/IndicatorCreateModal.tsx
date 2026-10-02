"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function IndicatorCreateModal({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const visible = open && searchParams.get("modal") !== "closed";

  useEffect(() => {
    if (!visible) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [visible]);

  function showModal() {
    setOpen(true);
    if (searchParams.get("modal") === "closed") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("modal");
      router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`, {
        scroll: false,
      });
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={showModal}
        className="inline-flex items-center justify-center rounded-xl bg-[#0B5B35] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#073B25]"
      >
        + Tambah Indikator
      </button>
      {visible && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[#17231D]/45 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="indicator-create-title"
            className="relative my-auto w-full max-w-5xl rounded-2xl bg-[#F5F7F5] shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup formulir tambah indikator"
              className="absolute right-4 top-4 z-10 rounded-lg border border-[#DCE6DF] bg-white p-2 text-[#64736A] transition hover:bg-[#F5F8F5]"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <div className="max-h-[90vh] overflow-y-auto p-1 sm:p-3">
              {children}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
