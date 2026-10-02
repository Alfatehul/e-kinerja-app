"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import LoadingSpinner from "./LoadingSpinner";

interface SubmitButtonProps {
  label?: string;
  loadingLabel?: string;
  className?: string;
  variant?: "primary" | "danger" | "secondary" | "gold";
  disabled?: boolean;
  icon?: React.ReactNode;
  formAction?: React.ButtonHTMLAttributes<HTMLButtonElement>["formAction"];
}

export default function SubmitButton({
  label = "Simpan",
  loadingLabel = "Menyimpan...",
  className = "",
  variant = "primary",
  disabled = false,
  icon,
  formAction,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 shadow-sm";

  const variantStyles = {
    primary:
      "bg-[#0B5B35] text-white hover:bg-[#073B25] active:scale-[0.99] focus:ring-2 focus:ring-[#0B5B35]/20",
    danger:
      "bg-[#B42318] text-white hover:bg-[#912018] active:scale-[0.99] focus:ring-2 focus:ring-[#B42318]/20",
    secondary:
      "border border-[#DCE6DF] bg-white text-[#334A3C] hover:bg-[#F5F8F5] active:scale-[0.99]",
    gold:
      "bg-[#C49A45] text-[#073B25] hover:bg-[#b08738] active:scale-[0.99]",
  }[variant];

  const isDisabled = disabled || pending;

  return (
    <button
      type="submit"
      formAction={formAction}
      disabled={isDisabled}
      aria-busy={pending}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {pending ? (
        <>
          <LoadingSpinner size="sm" color="white" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          {icon}
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
