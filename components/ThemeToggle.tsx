"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      aria-pressed={isDark}
      title={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-3 text-xs font-semibold text-[#334A3C] shadow-sm transition hover:border-[#B9D7C1] hover:bg-[#EAF3ED] dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-emerald-600 dark:hover:bg-slate-700"
    >
      {isDark ? (
        <>
          <SunIcon className="h-4 w-4 text-amber-300" />
          <span className="hidden sm:inline">Terang</span>
        </>
      ) : (
        <>
          <MoonIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Gelap</span>
        </>
      )}
    </button>
  );
}
