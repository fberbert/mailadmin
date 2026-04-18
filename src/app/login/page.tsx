import Link from "next/link";
import { redirect } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";

import { loginAction } from "@/app/login/actions";
import { FloatingThemeToggle } from "@/components/floating-theme-toggle";
import { SubmitButton, TextInput } from "@/components/ui";
import { PageToast } from "@/components/page-toast";
import { PasswordInput } from "@/components/password-input";
import { getSession } from "@/lib/auth";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: Props) {
  const session = await getSession();
  if (session) {
    redirect("/");
  }

  const params = searchParams ? await searchParams : {};
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <FloatingThemeToggle />
      <div className="panel-reveal grid w-full max-w-5xl overflow-hidden rounded-[2rem] border lg:grid-cols-[1.1fr_0.9fr]" style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-login)" }}>
        <section className="relative hidden overflow-hidden px-10 py-12 text-white lg:block" style={{ background: "var(--sidebar-bg)" }}>
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at top left, rgba(251,191,36,0.28), transparent 28%), radial-gradient(circle at bottom right, rgba(251,191,36,0.18), transparent 24%)" }} />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-2xl"
                style={{ background: "var(--btn-primary-bg)", color: "var(--btn-primary-text)" }}
              >
                <KeyRound className="size-5" />
              </div>
              <div>
                <div className="text-lg font-semibold">mailadmin panel</div>
                <div className="text-sm" style={{ color: "var(--sidebar-muted)" }}>Control plane for your mailserver</div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em]" style={{ borderColor: "var(--sidebar-border)", background: "var(--sidebar-card)", color: "var(--sidebar-muted)" }}>
                <ShieldCheck className="size-4" />
                central mail operations
              </div>
              <h1 className="max-w-lg text-4xl font-semibold tracking-tight">
                Manage domains, inboxes and routing from one place.
              </h1>
              <p className="max-w-xl text-base leading-7" style={{ color: "var(--sidebar-muted)" }}>
                Use the panel to create mailboxes, manage aliases, control send-as permissions and
                keep your mail server organized without touching the shell.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 sm:px-10 sm:py-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <div className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: "var(--accent-text)" }}>
                Authentication
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
                Sign in to mailadmin
              </h2>
              <p className="mt-3 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                Access the control panel for domains, mailboxes, aliases and sending permissions.
              </p>
            </div>

            <PageToast error={error ? "Invalid credentials. Check your username and password and try again." : undefined} />

            <form action={loginAction} className="space-y-5">
              <div className="grid gap-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }} htmlFor="username">
                  Username
                </label>
                <TextInput id="username" name="username" placeholder="admin" autoComplete="username" required />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }} htmlFor="password">
                  Password
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              <SubmitButton className="w-full" pendingLabel="Entering...">
                Enter panel
              </SubmitButton>
            </form>

            <div className="mt-6 text-sm" style={{ color: "var(--text-secondary)" }}>
              Mailbox owner?{" "}
              <Link href="/account/password" className="font-medium transition hover:underline" style={{ color: "var(--accent-text)" }}>
                Change your password
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
