import Link from "next/link";
import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-stone-200/80 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950">{title}</h1>
        {description ? <p className="max-w-3xl text-sm leading-6 text-stone-600">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Surface({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_24px_80px_rgba(28,25,23,0.08)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <Surface className="p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-stone-950">{value}</div>
      {hint ? <div className="mt-2 text-sm text-stone-600">{hint}</div> : null}
    </Surface>
  );
}

export function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        active ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-700",
      )}
    >
      {active ? "active" : "inactive"}
    </span>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-stone-800" htmlFor={htmlFor}>
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs font-normal text-stone-500">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 rounded-2xl border border-stone-300 bg-stone-50 px-4 text-sm text-stone-950 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100",
        props.className,
      )}
    />
  );
}

export function SubmitButton({
  children,
  variant = "primary",
  className,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) {
  const variants = {
    primary: "bg-stone-950 text-white hover:bg-stone-800",
    secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200",
    danger: "bg-red-600 text-white hover:bg-red-500",
  };

  return (
    <button
      type="submit"
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Notice({
  tone = "info",
  children,
}: {
  tone?: "info" | "success" | "error";
  children: ReactNode;
}) {
  const tones = {
    info: "border-sky-200 bg-sky-50 text-sky-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-red-200 bg-red-50 text-red-900",
  };

  return (
    <div className={cn("rounded-2xl border px-4 py-3 text-sm", tones[tone])}>
      {children}
    </div>
  );
}

export function MiniLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-amber-700 transition hover:text-amber-800">
      {children}
    </Link>
  );
}
