export const dynamic = "force-dynamic";

import { Cpu, Database, TerminalSquare } from "lucide-react";

import { PageHeader, Surface } from "@/components/ui";
import { appEnv } from "@/lib/env";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Runtime profile"
        description="Operational details of the current panel runtime. These values help when switching from local database mode to the future CLI mode on the mail host."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Surface>
          <div className="flex items-center gap-3 text-stone-900">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Cpu className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Application</div>
              <div className="text-xs text-stone-500">Current runtime mode</div>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm">
            {appEnv.driver}
          </div>
        </Surface>

        <Surface>
          <div className="flex items-center gap-3 text-stone-900">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <Database className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Data source</div>
              <div className="text-xs text-stone-500">Back-end persistence path</div>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm">
            {appEnv.driver === "database" ? "Prisma -> MySQL" : "mailadmin CLI"}
          </div>
        </Surface>

        <Surface>
          <div className="flex items-center gap-3 text-stone-900">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <TerminalSquare className="size-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">CLI path</div>
              <div className="text-xs text-stone-500">Used only in CLI mode</div>
            </div>
          </div>
          <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 font-mono text-sm break-all">
            {appEnv.cliPrefix ? `${appEnv.cliPrefix} ` : ""}
            {appEnv.cliPath}
          </div>
        </Surface>
      </div>
    </div>
  );
}
