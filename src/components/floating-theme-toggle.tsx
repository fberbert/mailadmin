"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/lib/use-theme";

export function FloatingThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed right-5 top-5 z-50 inline-flex size-11 cursor-pointer items-center justify-center rounded-2xl border backdrop-blur transition hover:translate-y-[-1px]"
      style={{
        background: "var(--surface-overlay)",
        borderColor: "var(--border)",
        color: "var(--text-primary)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
