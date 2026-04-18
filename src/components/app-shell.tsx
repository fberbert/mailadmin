"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, Home, KeyRound, Mailbox, Menu, Moon, Send, Shield, Sun, Workflow, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

import { logoutAction } from "@/app/login/actions";
import { useTheme } from "@/lib/use-theme";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Overview", icon: Home },
  { href: "/domains", label: "Domains", icon: Globe2 },
  { href: "/mailboxes", label: "Mailboxes", icon: Mailbox },
  { href: "/aliases", label: "Aliases", icon: Workflow },
  { href: "/sender-acl", label: "Sender ACL", icon: Send },
  { href: "/settings", label: "Settings", icon: Shield },
];

function SidebarContent({
  username,
  pathname,
  theme,
  toggleTheme,
  onNavigate,
}: {
  username: string;
  pathname: string;
  theme: string;
  toggleTheme: () => void;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl text-[var(--text-primary)]" style={{ background: "var(--accent)" }}>
          <KeyRound className="size-5" />
        </div>
        <div className="flex-1">
          <div className="text-lg font-semibold">mailadmin panel</div>
          <div className="text-xs" style={{ color: "var(--sidebar-muted)" }}>domains, mailboxes and policy</div>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="inline-flex size-10 items-center justify-center rounded-xl transition"
          style={{ background: "var(--sidebar-card)", color: "var(--sidebar-text)" }}
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>

      <nav className="space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                active ? "text-[var(--text-primary)]" : "hover:text-white",
              )}
              style={
                active
                  ? { background: "var(--sidebar-active)", boxShadow: "var(--shadow-active)" }
                  : { color: "var(--sidebar-muted)" }
              }
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "var(--sidebar-hover)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div
        className="mt-10 rounded-2xl border p-4"
        style={{ borderColor: "var(--sidebar-border)", background: "var(--sidebar-card)" }}
      >
        <div className="text-xs uppercase tracking-[0.22em]" style={{ color: "var(--sidebar-muted)" }}>Session</div>
        <div className="mt-2 text-sm font-medium text-white">{username}</div>
        <form action={logoutAction} className="mt-4">
          <button className="inline-flex h-10 w-full items-center justify-center rounded-xl text-sm font-semibold text-white transition" style={{ background: "var(--sidebar-hover)" }}>
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}

export function AppShell({
  username,
  children,
}: {
  username: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDrawerOpen(false);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [drawerOpen]);

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-page)", color: "var(--text-primary)" }}>
      {/* Mobile header */}
      <header
        className="sticky top-0 z-40 flex items-center gap-3 border-b px-4 py-3 backdrop-blur lg:hidden"
        style={{ borderColor: "var(--border)", background: "var(--surface-overlay)" }}
      >
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex size-10 items-center justify-center rounded-xl transition"
          style={{ background: "var(--btn-secondary-bg)", color: "var(--text-primary)" }}
        >
          <Menu className="size-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-xl text-[var(--text-primary)]" style={{ background: "var(--accent)" }}>
            <KeyRound className="size-3.5" />
          </div>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>mailadmin panel</span>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen ? (
        <div
          className="fixed inset-0 z-50 lg:hidden animate-[fade-slide-in_180ms_ease-out]"
          style={{ background: "var(--modal-overlay)" }}
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            className="absolute inset-y-0 left-0 w-[300px] max-w-[85vw] overflow-y-auto border-r px-5 py-6 text-[var(--sidebar-text)] animate-[fade-slide-in_220ms_cubic-bezier(0.22,1,0.36,1)]"
            style={{
              background: "var(--sidebar-bg)",
              borderColor: "var(--sidebar-border)",
              boxShadow: "var(--shadow-sidebar)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setDrawerOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-xl transition"
                style={{ background: "var(--sidebar-card)", color: "var(--sidebar-text)" }}
              >
                <X className="size-5" />
              </button>
            </div>
            <SidebarContent
              username={username}
              pathname={pathname}
              theme={theme}
              toggleTheme={toggleTheme}
              onNavigate={() => setDrawerOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <div className="mx-auto grid min-h-screen max-w-[1680px] grid-cols-1 gap-6 p-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-6">
        {/* Desktop sidebar */}
        <aside
          className="hidden rounded-[2rem] border px-5 py-6 text-[var(--sidebar-text)] lg:sticky lg:top-6 lg:block lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto"
          style={{
            background: "var(--sidebar-bg)",
            borderColor: "var(--sidebar-border)",
            boxShadow: "var(--shadow-sidebar)",
          }}
        >
          <SidebarContent
            username={username}
            pathname={pathname}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </aside>

        <main
          className="overflow-hidden rounded-[2rem] border p-6 backdrop-blur xl:p-8"
          style={{
            borderColor: "var(--border-muted)",
            background: "var(--surface-overlay)",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
