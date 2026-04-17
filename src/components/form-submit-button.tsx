"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/utils";

export function FormSubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  pendingLabel?: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();

  const variants = {
    primary: "bg-stone-950 text-white hover:bg-stone-800",
    secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200",
    danger: "bg-red-600 text-white hover:bg-red-500",
  };

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
        variants[variant],
        className,
      )}
    >
      {pending ? pendingLabel ?? children : children}
    </button>
  );
}
