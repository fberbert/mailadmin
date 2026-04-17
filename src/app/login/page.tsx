import { redirect } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";

import { loginAction } from "@/app/login/actions";
import { Notice, SubmitButton, TextInput } from "@/components/ui";
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
      <div className="panel-reveal grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-[0_40px_120px_rgba(28,25,23,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="relative hidden overflow-hidden bg-stone-950 px-10 py-12 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.28),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.18),_transparent_24%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500 text-stone-950">
                <KeyRound className="size-5" />
              </div>
              <div>
                <div className="text-lg font-semibold">mailadmin panel</div>
                <div className="text-sm text-stone-400">Control plane for your mailserver</div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-stone-300">
                <ShieldCheck className="size-4" />
                central mail operations
              </div>
              <h1 className="max-w-lg text-4xl font-semibold tracking-tight">
                Manage domains, inboxes and routing from one place.
              </h1>
              <p className="max-w-xl text-base leading-7 text-stone-300">
                Use the panel to create mailboxes, manage aliases, control send-as permissions and
                keep your mail server organized without touching the shell.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-8 sm:px-10 sm:py-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                Authentication
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
                Sign in to mailadmin
              </h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Access the control panel for domains, mailboxes, aliases and sending permissions.
              </p>
            </div>

            {error ? (
              <div className="mb-6">
                <Notice tone="error">Invalid credentials. Check your username and password and try again.</Notice>
              </div>
            ) : null}

            <form action={loginAction} className="space-y-5">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-stone-800" htmlFor="username">
                  Username
                </label>
                <TextInput id="username" name="username" placeholder="admin" autoComplete="username" required />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-stone-800" htmlFor="password">
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
          </div>
        </section>
      </div>
    </main>
  );
}
