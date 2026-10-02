"use client";

import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FacultyOption = {
  id: string;
  name: string;
  code: string | null;
};

export default function IndicatorFacultyFilter({
  faculties,
  selectedFaculty,
}: {
  faculties: FacultyOption[];
  selectedFaculty: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function updateFaculty(facultyId: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (facultyId) {
      params.set("faculty", facultyId);
    } else {
      params.delete("faculty");
    }

    const query = params.toString();
    startTransition(() => {
      router.replace(`${pathname}${query ? `?${query}` : ""}`, {
        scroll: false,
      });
    });
  }

  return (
    <div>
      <label
        htmlFor="faculty"
        className="mb-1.5 block text-xs font-semibold text-[#334A3C]"
      >
        Fakultas / Unit
      </label>
      <select
        id="faculty"
        value={selectedFaculty}
        onChange={(event) => updateFaculty(event.target.value)}
        aria-busy={isPending}
        className="w-full rounded-xl border border-[#DCE6DF] bg-[#F8FBF8] px-3 py-2.5 text-sm text-[#17231D] outline-none focus:border-[#7FB493] focus:ring-2 focus:ring-[#7FB493]/15"
      >
        <option value="">Semua fakultas / unit</option>
        {faculties.map((faculty) => (
          <option key={faculty.id} value={faculty.id}>
            {faculty.code ? `${faculty.code} — ` : ""}
            {faculty.name}
          </option>
        ))}
      </select>
      <span className="sr-only" aria-live="polite">
        {isPending ? "Memuat data fakultas" : ""}
      </span>
    </div>
  );
}
