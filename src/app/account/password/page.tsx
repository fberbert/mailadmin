import Link from "next/link";
import { KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";

import { changeOwnPasswordAction } from "@/app/account/password/actions";
import { FloatingThemeToggle } from "@/components/floating-theme-toggle";
import { PageToast } from "@/components/page-toast";
import { PasswordInput } from "@/components/password-input";
import { SubmitButton, TextInput } from "@/components/ui";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AccountPasswordPage({ searchParams }: Props) {
  const params = searchParams ? await searchParams : {};
  const success = getParam(params.success);
  const error = getParam(params.error);

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <FloatingThemeToggle />
      <div
        className="panel-reveal grid w-full max-w-5xl overflow-hidden rounded-[2rem] border lg:grid-cols-[1.05fr_0.95fr]"
        style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-login)" }}
      >
        <section className="relative hidden overflow-hidden px-10 py-12 text-white lg:block" style={{ background: "var(--sidebar-bg)" }}>
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(circle at top left, rgba(251,191,36,0.28), transparent 28%), radial-gradient(circle at bottom right, rgba(251,191,36,0.18), transparent 24%)" }}
          />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-2xl"
                style={{ background: "var(--btn-primary-bg)", color: "var(--btn-primary-text)" }}
              >
                <KeyRound className="size-5" />
              </div>
              <div>
                <div className="text-lg font-semibold">mailadmin account</div>
                <div className="text-sm" style={{ color: "var(--sidebar-muted)" }}>self-service password update</div>
              </div>
            </div>

            <div className="space-y-6">
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em]"
                style={{ borderColor: "var(--sidebar-border)", background: "var(--sidebar-card)", color: "var(--sidebar-muted)" }}
              >
                <ShieldCheck className="size-4" />
                mailbox security
              </div>
              <h1 className="max-w-lg text-4xl font-semibold tracking-tight">
                Change your mailbox password without the admin panel.
              </h1>
              <p className="max-w-xl text-base leading-7" style={{ color: "var(--sidebar-muted)" }}>
                Confirm your current password, choose a new one and save the update directly against your mailbox account.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 sm:px-10 sm:py-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <div className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--accent-text)" }}>
                Self-service
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Update mailbox password
              </h2>
              <p className="mt-3 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                This page only changes the password for the mailbox you authenticate with. It does not grant access to the admin panel.
              </p>
            </div>

            <PageToast
              success={success ? "password-updated" : undefined}
              error={error}
            />

            <form action={changeOwnPasswordAction} className="space-y-5">
              <div className="grid gap-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }} htmlFor="email">
                  Mailbox email
                </label>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="fabio@example.com"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }} htmlFor="current-password">
                  Current password
                </label>
                <PasswordInput
                  id="current-password"
                  name="currentPassword"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }} htmlFor="new-password">
                  New password
                </label>
                <PasswordInput
                  id="new-password"
                  name="newPassword"
                  placeholder="choose a new password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }} htmlFor="confirm-password">
                  Confirm new password
                </label>
                <PasswordInput
                  id="confirm-password"
                  name="confirmPassword"
                  placeholder="repeat the new password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <SubmitButton className="w-full" pendingLabel="Saving...">
                Save new password
              </SubmitButton>
            </form>

            <div className="mt-6 flex items-center justify-between gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              <div className="inline-flex items-center gap-2">
                <LockKeyhole className="size-4" />
                Changes apply to IMAP and SMTP logins.
              </div>
              <Link href="/login" className="font-medium transition hover:underline" style={{ color: "var(--accent-text)" }}>
                Admin login
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
