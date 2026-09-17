import LogoutButton from "@/components/LogoutButton";

export default function Topbar({
  userName,
  roleLabel,
  onToggleSidebar,
}: {
  userName: string;
  roleLabel: string;
  onToggleSidebar?: () => void;
}) {
  return (
    <header className="h-[58px] bg-white border-b border-[#E1DDCF] flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {/* --- TOMBOL + IKON SVG MENU 3 GARIS --- */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md hover:bg-gray-100 text-[#5B5A55] transition-colors cursor-pointer"
          aria-label="Toggle Navigation"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {/* -------------------------------------- */}

        <div className="text-sm text-[#5B5A55]">{roleLabel}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold text-[#1E2027]">{userName}</div>
        <LogoutButton />
      </div>
    </header>
  );
}
