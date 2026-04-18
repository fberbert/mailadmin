"use client";

import type { ReactNode } from "react";
import { useTheme } from "@/lib/use-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  useTheme();
  return <>{children}</>;
}

export function ThemeHydrationScript() {
  const script = `(function(){try{var t=localStorage.getItem("mailadmin-theme");if(t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme:dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})()`;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
