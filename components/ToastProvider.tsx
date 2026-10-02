"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import LoadingSpinner from "./LoadingSpinner";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (
    message: string,
    type?: ToastType,
    options?: { title?: string; duration?: number }
  ) => string;
  success: (message: string, options?: { title?: string; duration?: number }) => string;
  error: (message: string, options?: { title?: string; duration?: number }) => string;
  warning: (message: string, options?: { title?: string; duration?: number }) => string;
  info: (message: string, options?: { title?: string; duration?: number }) => string;
  loading: (message: string, options?: { title?: string; duration?: number }) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let externalToast: ToastContextValue | null = null;

export const toast = {
  success: (message: string, options?: { title?: string; duration?: number }) =>
    externalToast?.success(message, options),
  error: (message: string, options?: { title?: string; duration?: number }) =>
    externalToast?.error(message, options),
  warning: (message: string, options?: { title?: string; duration?: number }) =>
    externalToast?.warning(message, options),
  info: (message: string, options?: { title?: string; duration?: number }) =>
    externalToast?.info(message, options),
  loading: (message: string, options?: { title?: string; duration?: number }) =>
    externalToast?.loading(message, options),
  dismiss: (id: string) => externalToast?.dismiss(id),
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(100);

  const duration = item.duration ?? (item.type === "error" ? 6000 : 4000);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onDismiss(item.id);
    }, 250);
  }, [item.id, onDismiss]);

  useEffect(() => {
    if (item.type === "loading") return;

    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [duration, handleClose, item.type]);

  const config = {
    success: {
      bg: "bg-white",
      border: "border-[#B9D7C1]",
      shadow: "shadow-[0_12px_32px_rgba(11,91,53,0.12)]",
      titleColor: "text-[#14532D]",
      barColor: "bg-[#16A34A]",
      badgeBg: "bg-[#EAF5EC]",
      icon: <CheckCircleIcon className="w-5 h-5 text-[#16A34A]" />,
      defaultTitle: "Berhasil",
    },
    error: {
      bg: "bg-white",
      border: "border-red-200",
      shadow: "shadow-[0_12px_32px_rgba(180,35,24,0.12)]",
      titleColor: "text-[#991B1B]",
      barColor: "bg-[#DC2626]",
      badgeBg: "bg-red-50",
      icon: <ExclamationCircleIcon className="w-5 h-5 text-[#DC2626]" />,
      defaultTitle: "Gagal",
    },
    warning: {
      bg: "bg-white",
      border: "border-amber-200",
      shadow: "shadow-[0_12px_32px_rgba(217,119,6,0.12)]",
      titleColor: "text-[#92400E]",
      barColor: "bg-[#F59E0B]",
      badgeBg: "bg-amber-50",
      icon: <ExclamationTriangleIcon className="w-5 h-5 text-[#D97706]" />,
      defaultTitle: "Peringatan",
    },
    info: {
      bg: "bg-white",
      border: "border-blue-200",
      shadow: "shadow-[0_12px_32px_rgba(37,99,235,0.12)]",
      titleColor: "text-[#1E40AF]",
      barColor: "bg-[#2563EB]",
      badgeBg: "bg-blue-50",
      icon: <InformationCircleIcon className="w-5 h-5 text-[#2563EB]" />,
      defaultTitle: "Informasi",
    },
    loading: {
      bg: "bg-white",
      border: "border-[#B9D7C1]",
      shadow: "shadow-[0_12px_32px_rgba(11,91,53,0.12)]",
      titleColor: "text-[#14532D]",
      barColor: "bg-[#0B5B35]",
      badgeBg: "bg-[#EAF5EC]",
      icon: <LoadingSpinner size="sm" color="brand" />,
      defaultTitle: "Sedang Memproses...",
    },
  }[item.type];

  return (
    <div
      role="alert"
      className={`pointer-events-auto relative w-full overflow-hidden rounded-2xl border ${config.border} ${config.bg} p-4 ${config.shadow} transition-all duration-300 ease-out ${
        isClosing
          ? "translate-x-full opacity-0 scale-95"
          : "translate-x-0 opacity-100 scale-100"
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.badgeBg}`}
        >
          {config.icon}
        </div>

        <div className="flex-1 min-w-0 pt-0.5">
          <p className={`text-sm font-bold leading-tight ${config.titleColor}`}>
            {item.title || config.defaultTitle}
          </p>
          <p className="mt-1 text-xs leading-5 text-[#4A5568] break-words">
            {item.message}
          </p>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Tutup pemberitahuan"
          className="shrink-0 rounded-lg p-1 text-[#9CA3AF] transition-colors hover:bg-black/5 hover:text-[#4B5563]"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      {item.type !== "loading" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
          <div
            className={`h-full ${config.barColor} transition-all duration-75 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

function ToastQueryWatcher({
  showToast,
}: {
  showToast: ToastContextValue["showToast"];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (!searchParams) return;

    const notice = searchParams.get("notice");
    const errorParam = searchParams.get("error");
    const successParam = searchParams.get("success");

    let triggered = false;

    if (notice) {
      triggered = true;
      if (notice === "created") {
        showToast("Indikator baru berhasil disimpan ke sistem.", "success", {
          title: "Berhasil Disimpan",
        });
      } else if (notice === "updated") {
        showToast("Perubahan data indikator berhasil diperbarui.", "success", {
          title: "Berhasil Diperbarui",
        });
      } else if (notice === "deleted") {
        showToast("Data indikator berhasil dihapus dari sistem.", "success", {
          title: "Berhasil Dihapus",
        });
      } else if (notice === "saved") {
        showToast("Data berhasil disimpan.", "success", {
          title: "Berhasil Disimpan",
        });
      } else if (notice === "submitted") {
        showToast("Pengajuan berhasil dikirim.", "success", {
          title: "Berhasil Diajukan",
        });
      } else if (notice === "approved") {
        showToast("Data berhasil diverifikasi.", "success", {
          title: "Berhasil Diverifikasi",
        });
      } else if (notice === "rejected") {
        showToast("Pengajuan berhasil ditolak.", "success", {
          title: "Status Diperbarui",
        });
      } else if (notice === "cancelled") {
        showToast("Pengajuan berhasil dibatalkan.", "success", {
          title: "Pengajuan Dibatalkan",
        });
      } else {
        showToast(notice, "success");
      }
    }

    if (successParam) {
      triggered = true;
      showToast(successParam, "success");
    }

    if (errorParam) {
      triggered = true;
      showToast(errorParam, "error", {
        title: "Terjadi Kendala",
      });
    }

    if (triggered && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("notice");
      url.searchParams.delete("error");
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
    }
  }, [searchParams, pathname, showToast]);

  return null;
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: ToastType = "info",
      options?: { title?: string; duration?: number }
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = {
        id,
        type,
        message,
        title: options?.title,
        duration: options?.duration,
      };

      setToasts((prev) => [...prev.slice(-4), newToast]);
      return id;
    },
    []
  );

  const success = useCallback(
    (message: string, options?: { title?: string; duration?: number }) =>
      showToast(message, "success", options),
    [showToast]
  );

  const error = useCallback(
    (message: string, options?: { title?: string; duration?: number }) =>
      showToast(message, "error", options),
    [showToast]
  );

  const warning = useCallback(
    (message: string, options?: { title?: string; duration?: number }) =>
      showToast(message, "warning", options),
    [showToast]
  );

  const info = useCallback(
    (message: string, options?: { title?: string; duration?: number }) =>
      showToast(message, "info", options),
    [showToast]
  );

  const loading = useCallback(
    (message: string, options?: { title?: string; duration?: number }) =>
      showToast(message, "loading", options),
    [showToast]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      success,
      error,
      warning,
      info,
      loading,
      dismiss,
    }),
    [dismiss, error, info, loading, showToast, success, warning],
  );

  useEffect(() => {
    externalToast = value;
    return () => {
      externalToast = null;
    };
  }, [value]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <React.Suspense fallback={null}>
        <ToastQueryWatcher showToast={showToast} />
      </React.Suspense>

      {/* Floating Toast Container */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed top-5 right-5 z-[99999] flex w-full max-w-sm flex-col gap-3 px-4 sm:px-0"
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
