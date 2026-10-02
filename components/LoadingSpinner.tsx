import React from "react";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  color?: "current" | "brand" | "white";
}

const sizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

export default function LoadingSpinner({
  size = "md",
  className = "",
  color = "current",
}: LoadingSpinnerProps) {
  const colorClass =
    color === "brand"
      ? "text-[#0B5B35]"
      : color === "white"
        ? "text-white"
        : "text-current";

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${colorClass} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v3.5a4.5 4.5 0 00-4.5 4.5H4z"
      />
    </svg>
  );
}
