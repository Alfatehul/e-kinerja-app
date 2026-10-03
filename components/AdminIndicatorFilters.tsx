"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function AdminIndicatorFilters({
  quarter,
  faculty,
}: {
  quarter: string;
  faculty: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function syncWithUrl() {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") ?? "");
    }

    window.addEventListener("popstate", syncWithUrl);
    return () => window.removeEventListener("popstate", syncWithUrl);
  }, []);

  function updateFilters(nextQuery: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("quarter", quarter);
    params.set("faculty", faculty);
    params.delete("category");
    params.delete("status");
    if (nextQuery.trim()) params.set("q", nextQuery);
    else params.delete("q");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div
      aria-busy={isPending}
      className="border-b border-[#DCE6DF] bg-white px-5 py-4"
    >
      <div>
        <label
          htmlFor="admin-indicator-query"
          className="mb-1.5 block text-xs font-semibold text-[#334A3C]"
        >
          Cari indikator
        </label>
        <input
          id="admin-indicator-query"
          type="search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            updateFilters(nextQuery);
          }}
          placeholder="Cari kode atau nama indikator..."
          className="form-input"
        />
      </div>
    </div>
  );
}
