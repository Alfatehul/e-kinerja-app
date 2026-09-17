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
      {/* KIRI */}
      <div className="flex items-center gap-3">
        {/* TOMBOL SIDEBAR */}
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

        {/* ROLE */}
        <div className="text-sm text-[#5B5A55]">{roleLabel}</div>
      </div>

      {/* KANAN */}
      <div className="flex items-center gap-4">
        {/* PROFILE */}
        <div className="flex items-center gap-3">
          {/* ICON PROFILE */}
          <div className="w-8 h-8 rounded-full bg-[#131F38] text-white flex items-center justify-center">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </div>

          {/* NAMA */}
          <div className="flex flex-col">
            <div className="text-sm font-semibold text-[#1E2027]">
              {userName}
            </div>

            <div className="text-[11px] text-[#8A8880]">Administrator</div>
          </div>
        </div>

        {/* LOGOUT */}
        <LogoutButton />
      </div>
    </header>
  );
}
