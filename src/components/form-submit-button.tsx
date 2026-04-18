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
    primary: { background: "var(--btn-primary-bg)", color: "var(--btn-primary-text)" },
    secondary: { background: "var(--btn-secondary-bg)", color: "var(--btn-secondary-text)" },
    danger: { background: "var(--danger)", color: "#fff" },
  };

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
      style={variants[variant]}
    >
      {pending ? pendingLabel ?? children : children}
    </button>
  );
}
