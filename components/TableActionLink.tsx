import Link from "next/link";

export default function TableActionLink({
  href,
  label = "Lihat detail",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-xl border border-[#C9DED0] bg-[#F5FAF6] px-3 py-2 text-xs font-bold text-[#0B5B35] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#0B5B35] hover:bg-[#0B5B35] hover:text-white hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5B35]"
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4 transition-transform group-hover:scale-110"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
      <span>{label}</span>
      <span aria-hidden className="text-sm transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
