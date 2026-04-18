"use client";

import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export function PasswordInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const buttonId = useId();

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(
          "h-11 w-full rounded-2xl border px-4 pr-12 text-sm outline-none transition focus:ring-4",
          props.className,
        )}
        style={{
          background: "var(--input-bg)",
          borderColor: "var(--input-border)",
          color: "var(--text-primary)",
          ...({ "--tw-ring-color": "var(--ring)" } as React.CSSProperties),
        }}
      />
      <button
        id={buttonId}
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        title={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center transition"
        style={{ color: "var(--text-muted)" }}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
