"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function FormModal({
  children,
  label,
  title,
  className,
  dialogClassName,
  showTitle = false,
  modalId,
}: {
  children: ReactNode;
  label: string;
  title: string;
  className?: string;
  dialogClassName?: string;
  showTitle?: boolean;
  modalId?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const visible =
    (open || (!!modalId && searchParams.get("modal") === modalId)) &&
    searchParams.get("modal") !== "closed";

  const hideModal = useCallback(() => {
    setOpen(false);
    if (modalId && searchParams.get("modal") === modalId) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("modal");
      router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`, {
        scroll: false,
      });
    }
  }, [modalId, pathname, router, searchParams]);

  useEffect(() => {
    if (!visible) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") hideModal();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [hideModal, visible]);

  function showModal() {
    setOpen(true);
    if (modalId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("modal", modalId);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      return;
    }
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
        className={
          className ??
          "inline-flex items-center justify-center rounded-xl bg-[#0B5B35] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#073B25]"
        }
      >
        {label}
      </button>
      {visible && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#17231D]/45 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) hideModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`relative my-auto flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-[#F5F7F5] shadow-2xl ${dialogClassName ?? "max-w-3xl"}`}
          >
            {showTitle && (
              <div className="shrink-0 border-b border-[#DCE6DF] bg-white px-5 py-4">
                <h2 className="pr-10 text-base font-bold leading-snug text-[#17231D] sm:text-lg">
                  {title}
                </h2>
              </div>
            )}
            <button
              type="button"
              onClick={hideModal}
              aria-label={`Tutup ${title.toLowerCase()}`}
              className="absolute right-4 top-4 z-10 rounded-lg border border-[#DCE6DF] bg-white p-2 text-[#64736A] transition hover:bg-[#F5F8F5]"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
            <div
              className={`form-modal-content min-h-0 overflow-y-auto text-left ${showTitle ? "p-3 sm:p-5" : "p-1 sm:p-3"}`}
            >
              {children}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
