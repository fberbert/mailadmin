export const dynamic = "force-dynamic";

import { Cpu, Database, TerminalSquare } from "lucide-react";

import { Breadcrumb, PageHeader, Surface } from "@/components/ui";
import { appEnv } from "@/lib/env";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Settings" }]} />}
        title="Runtime profile"
        description="Operational details of the current panel runtime. These values help when switching from local database mode to the future CLI mode on the mail host."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Surface>
          <div className="flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
            <div className="flex size-10 items-center justify-center rounded-2xl" style={{ background: "var(--accent-muted)", color: "var(--accent-text)" }}>
              <Cpu className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Application</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>Current runtime mode</div>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border px-4 py-3 font-mono text-sm" style={{ borderColor: "var(--border)", background: "var(--surface-muted)", color: "var(--text-primary)" }}>
            {appEnv.driver}
          </div>
        </Surface>

        <Surface>
          <div className="flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
            <div className="flex size-10 items-center justify-center rounded-2xl" style={{ background: "var(--accent-muted)", color: "var(--accent-text)" }}>
              <Database className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Data source</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>Back-end persistence path</div>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border px-4 py-3 font-mono text-sm" style={{ borderColor: "var(--border)", background: "var(--surface-muted)", color: "var(--text-primary)" }}>
            {appEnv.driver === "database" ? "Prisma -> MySQL" : "mailadmin CLI"}
          </div>
        </Surface>

        <Surface>
          <div className="flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
            <div className="flex size-10 items-center justify-center rounded-2xl" style={{ background: "var(--accent-muted)", color: "var(--accent-text)" }}>
              <TerminalSquare className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">CLI path</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>Used only in CLI mode</div>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border px-4 py-3 font-mono text-sm break-all" style={{ borderColor: "var(--border)", background: "var(--surface-muted)", color: "var(--text-primary)" }}>
            {appEnv.cliPrefix ? `${appEnv.cliPrefix} ` : ""}
            {appEnv.cliPath}
          </div>
        </Surface>
      </div>
    </div>
  );
}
