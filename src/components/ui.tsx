import Link from "next/link";
import type { InputHTMLAttributes, ReactNode } from "react";

import { FormSubmitButton } from "@/components/form-submit-button";
import { cn } from "@/lib/utils";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.24em]">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {i > 0 ? (
            <span aria-hidden style={{ color: "var(--text-faint)" }}>/</span>
          ) : null}
          {item.href ? (
            <Link
              href={item.href}
              className="transition hover:underline"
              style={{ color: "var(--text-muted)" }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "var(--accent-text)" }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="space-y-2">
        {eyebrow ? (
          <div className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--accent-text)" }}>
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-3xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>{title}</h1>
        {description ? <p className="max-w-3xl text-sm leading-6" style={{ color: "var(--text-secondary)" }}>{description}</p> : null}
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
        "panel-reveal rounded-3xl border p-6",
        className,
      )}
      style={{
        borderColor: "var(--border)",
        background: "var(--surface-raised)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {children}
    </section>
  );
}

export function FormActionSlot({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid self-start gap-2 text-sm font-medium", className)} style={{ color: "var(--text-secondary)" }}>
      <span className="invisible select-none">Action</span>
      {children}
      <span className="min-h-4 text-xs font-normal invisible">helper text</span>
    </div>
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
    <Surface className="card-hover p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>{label}</div>
      <div className="mt-3 text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>{value}</div>
      {hint ? <div className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>{hint}</div> : null}
    </Surface>
  );
}

export function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
      style={
        active
          ? { background: "var(--success-bg)", color: "var(--success-text)", border: "1px solid var(--success-border)" }
          : { background: "var(--surface-muted)", color: "var(--text-muted)", border: "1px solid var(--border)" }
      }
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
    <label className="grid gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }} htmlFor={htmlFor}>
      <span>{label}</span>
      {children}
      <span className={cn("min-h-4 text-xs font-normal", hint ? "" : "invisible")} style={{ color: "var(--text-muted)" }}>
        {hint ?? "helper text"}
      </span>
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4",
        props.className,
      )}
      style={{
        background: "var(--input-bg)",
        borderColor: "var(--input-border)",
        color: "var(--text-primary)",
        ...({ "--tw-ring-color": "var(--ring)" } as React.CSSProperties),
      }}
    />
  );
}

export function SelectInput({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      {...props}
      className={cn(
        "h-11 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4",
        className,
      )}
      style={{
        background: "var(--input-bg)",
        borderColor: "var(--input-border)",
        color: "var(--text-primary)",
        ...({ "--tw-ring-color": "var(--ring)" } as React.CSSProperties),
      }}
    >
      {children}
    </select>
  );
}

export function SubmitButton({
  children,
  variant = "primary",
  className,
  pendingLabel,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  pendingLabel?: ReactNode;
}) {
  return (
    <FormSubmitButton variant={variant} className={className} pendingLabel={pendingLabel}>
      {children}
    </FormSubmitButton>
  );
}

export function ActionIconButton({
  children,
  label,
  variant = "secondary",
  className,
}: {
  children: ReactNode;
  label: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) {
  const variants = {
    primary: { background: "var(--btn-primary-bg)", color: "var(--btn-primary-text)" },
    secondary: { background: "var(--btn-secondary-bg)", color: "var(--text-primary)" },
    danger: { background: "var(--danger)", color: "#fff" },
  };

  return (
    <button
      type="submit"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-10 cursor-pointer items-center justify-center rounded-xl text-sm font-semibold transition disabled:cursor-not-allowed",
        className,
      )}
      style={variants[variant]}
    >
      {children}
      <span className="sr-only">{label}</span>
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
    info: { background: "var(--info-bg)", color: "var(--info-text)", borderColor: "var(--info-border)" },
    success: { background: "var(--success-bg)", color: "var(--success-text)", borderColor: "var(--success-border)" },
    error: { background: "var(--danger-bg)", color: "var(--danger-text)", borderColor: "var(--danger-border)" },
  };

  return (
    <div className="rounded-2xl border px-4 py-3 text-sm" style={tones[tone]}>
      {children}
    </div>
  );
}

export function MiniLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="cursor-pointer text-sm font-medium transition" style={{ color: "var(--accent-text)" }}>
      {children}
    </Link>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div
        className="flex size-12 items-center justify-center rounded-2xl"
        style={{ background: "var(--surface-muted)", color: "var(--text-faint)" }}
      >
        <Icon className="size-5" />
      </div>
      <div className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{title}</div>
      {description ? <p className="max-w-sm text-sm leading-6" style={{ color: "var(--text-muted)" }}>{description}</p> : null}
      {action}
    </div>
  );
}

function buildPageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "ellipsis")[] = [1];

  if (current <= 4) {
    pages.push(2, 3, 4, 5, "ellipsis", total);
  } else if (current >= total - 3) {
    pages.push("ellipsis", total - 4, total - 3, total - 2, total - 1, total);
  } else {
    pages.push("ellipsis", current - 1, current, current + 1, "ellipsis", total);
  }

  return pages;
}

export function PaginationNav({
  pathname,
  currentPage,
  totalPages,
  buildHref,
}: {
  pathname: string;
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = buildPageRange(currentPage, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4" style={{ borderColor: "var(--border)" }}>
      <div className="text-sm" style={{ color: "var(--text-muted)" }}>
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildHref(Math.max(1, currentPage - 1))}
          className={cn(
            "inline-flex h-10 items-center justify-center rounded-xl px-3 text-sm font-medium transition",
            currentPage === 1 ? "pointer-events-none" : "cursor-pointer",
          )}
          style={
            currentPage === 1
              ? { background: "var(--btn-secondary-bg)", color: "var(--text-faint)" }
              : { background: "var(--btn-secondary-bg)", color: "var(--text-primary)" }
          }
        >
          Previous
        </Link>
        {pages.map((page, idx) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${idx}`}
              className="inline-flex h-10 min-w-10 items-center justify-center text-sm"
              style={{ color: "var(--text-faint)" }}
            >
              &hellip;
            </span>
          ) : (
            <Link
              key={`${pathname}-${page}`}
              href={buildHref(page)}
              className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-sm font-medium transition"
              style={
                page === currentPage
                  ? { background: "var(--btn-primary-bg)", color: "var(--btn-primary-text)" }
                  : { background: "var(--btn-secondary-bg)", color: "var(--text-primary)" }
              }
            >
              {page}
            </Link>
          ),
        )}
        <Link
          href={buildHref(Math.min(totalPages, currentPage + 1))}
          className={cn(
            "inline-flex h-10 items-center justify-center rounded-xl px-3 text-sm font-medium transition",
            currentPage === totalPages ? "pointer-events-none" : "cursor-pointer",
          )}
          style={
            currentPage === totalPages
              ? { background: "var(--btn-secondary-bg)", color: "var(--text-faint)" }
              : { background: "var(--btn-secondary-bg)", color: "var(--text-primary)" }
          }
        >
          Next
        </Link>
      </div>
    </div>
  );
}
