"use client";

import Link, { useLinkStatus } from "next/link";
import type { ReactNode } from "react";
import LoadingSpinner from "./LoadingSpinner";

function PendingIndicator() {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return (
    <span
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 text-sm font-semibold text-[#0B5B35]"
    >
      <span className="inline-flex items-center gap-2">
        <LoadingSpinner size="sm" color="brand" />
        Memuat...
      </span>
    </span>
  );
}

export default function QuarterCardLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      <PendingIndicator />
    </Link>
  );
}
