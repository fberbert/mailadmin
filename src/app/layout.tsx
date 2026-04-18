import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ThemeHydrationScript, ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mailadmin panel",
  description: "Administrative panel for domains, mailboxes, aliases and sender ACLs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <ThemeHydrationScript />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: "var(--gradient-page)", color: "var(--foreground)" }}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
