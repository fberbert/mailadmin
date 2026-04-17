"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Home, KeyRound, Mailbox, Send, Shield, Workflow } from "lucide-react";
import type { ReactNode } from "react";

import { logoutAction } from "@/app/login/actions";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/domains", label: "Domains", icon: Globe2 },
  { href: "/mailboxes", label: "Mailboxes", icon: Mailbox },
  { href: "/aliases", label: "Aliases", icon: Workflow },
  { href: "/sender-acl", label: "Sender ACL", icon: Send },
  { href: "/settings", label: "Settings", icon: Shield },
];

export function AppShell({
  username,
  children,
}: {
  username: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.18),_transparent_24%),linear-gradient(180deg,_#fafaf9,_#f5f5f4)] text-stone-950">
      <div className="mx-auto grid min-h-screen max-w-[1680px] grid-cols-1 gap-6 p-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-6">
        <aside className="rounded-[2rem] border border-stone-200 bg-stone-950 px-5 py-6 text-stone-100 shadow-2xl shadow-stone-950/15">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-400 text-stone-950">
              <KeyRound className="size-5" />
            </div>
            <div>
              <div className="text-lg font-semibold">mailadmin panel</div>
              <div className="text-xs text-stone-400">domains, mailboxes and policy</div>
            </div>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-white text-stone-950 shadow-lg shadow-black/20"
                      : "text-stone-300 hover:bg-white/8 hover:text-white",
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-stone-400">Session</div>
            <div className="mt-2 text-sm font-medium text-white">{username}</div>
            <form action={logoutAction} className="mt-4">
              <button className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-white/10 text-sm font-semibold text-white transition hover:bg-white/20">
                Sign out
              </button>
            </form>
          </div>
        </aside>

        <main className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 backdrop-blur xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
