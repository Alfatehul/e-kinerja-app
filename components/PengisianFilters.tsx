"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PengisianFilters({
  quarter,
  statuses,
}: {
  quarter: string;
  statuses: string[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function syncWithUrl() {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
      setStatus(params.get("status") ?? "");
    }

    window.addEventListener("popstate", syncWithUrl);
    return () => window.removeEventListener("popstate", syncWithUrl);
  }, []);

  function updateFilters(nextQuery: string, nextStatus: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("quarter", quarter);
    if (nextQuery.trim()) params.set("q", nextQuery);
    else params.delete("q");
    if (nextStatus) params.set("status", nextStatus);
    else params.delete("status");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div
      aria-busy={isPending}
      className="grid gap-3 rounded-2xl border border-[#DCE6DF] bg-white p-4 shadow-sm md:grid-cols-2"
    >
      <div>
        <label
          htmlFor="pengisian-query"
          className="mb-1.5 block text-xs font-semibold text-[#334A3C]"
        >
          Cari indikator
        </label>
        <input
          id="pengisian-query"
          type="search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            updateFilters(nextQuery, status);
          }}
          placeholder="Cari kode atau nama indikator..."
          className="form-input"
        />
      </div>
      <div>
        <label
          htmlFor="pengisian-status"
          className="mb-1.5 block text-xs font-semibold text-[#334A3C]"
        >
          Status
        </label>
        <select
          id="pengisian-status"
          value={status}
          onChange={(event) => {
            const nextStatus = event.target.value;
            setStatus(nextStatus);
            updateFilters(query, nextStatus);
          }}
          className="form-input"
        >
          <option value="">Semua status</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
