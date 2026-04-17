export const dynamic = "force-dynamic";

import { ArrowRight, Mail, Send, Shield, Globe2 } from "lucide-react";

import { MiniLink, PageHeader, StatCard, Surface } from "@/components/ui";
import { mailAdminProvider } from "@/lib/mailadmin";

export default async function DashboardPage() {
  const [metrics, domains, mailboxes, aliases, senderRules] = await Promise.all([
    mailAdminProvider.getDashboardMetrics(),
    mailAdminProvider.listDomains(),
    mailAdminProvider.listMailboxes(),
    mailAdminProvider.listAliases(),
    mailAdminProvider.listSenderAcl(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title="Operational control surface"
        description="This panel manages the same concepts handled by the mailadmin utility: local domains, mailboxes, aliases and sender ACL rules."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Domains" value={metrics.domainCount} hint="Hosted domains currently onboarded." />
        <StatCard label="Mailboxes" value={metrics.mailboxCount} hint="Authenticable mailboxes with storage backing." />
        <StatCard label="Aliases" value={metrics.aliasCount} hint="Inbound rewrite and delivery aliases." />
        <StatCard label="Sender ACL" value={metrics.senderRuleCount} hint="Allowed send-as identities per mailbox." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Surface>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-stone-950">Recent domains</h2>
            <MiniLink href="/domains">Manage domains</MiniLink>
          </div>
          <div className="mt-6 space-y-3">
            {domains.slice(0, 6).map((domain) => (
              <div
                key={domain.id}
                className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-amber-700 shadow-sm">
                    <Globe2 className="size-4" />
                  </div>
                  <div>
                    <div className="font-medium text-stone-900">{domain.name}</div>
                    <div className="text-sm text-stone-500">
                      {domain.mailboxCount} mailbox(es), {domain.aliasCount} alias(es)
                    </div>
                  </div>
                </div>
                <ArrowRight className="size-4 text-stone-400" />
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="space-y-5">
          <h2 className="text-lg font-semibold text-stone-950">Operational notes</h2>
          <div className="grid gap-4">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                <Mail className="size-4 text-amber-700" />
                Mailboxes
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Provisioning a mailbox should also create its primary sender ACL entry. This panel mirrors that behavior in database mode.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                <Send className="size-4 text-amber-700" />
                Send-as policy
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Sender ACL is intentionally separate from aliases. Input routing and outbound identity are different controls.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-stone-900">
                <Shield className="size-4 text-amber-700" />
                Driver mode
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Local development runs against Prisma/MySQL. Production can switch to the CLI adapter and drive the real utility on the mail host.
              </p>
            </div>
          </div>
        </Surface>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Surface>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Newest mailboxes</h2>
            <MiniLink href="/mailboxes">Open mailbox catalog</MiniLink>
          </div>
          <div className="mt-5 space-y-3">
            {mailboxes.slice(0, 5).map((mailbox) => (
              <div key={mailbox.id} className="rounded-2xl border border-stone-200 px-4 py-3">
                <div className="font-medium text-stone-900">{mailbox.email}</div>
                <div className="text-sm text-stone-500">{mailbox.domainName}</div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Aliases</h2>
            <MiniLink href="/aliases">Open alias catalog</MiniLink>
          </div>
          <div className="mt-5 space-y-3">
            {aliases.slice(0, 5).map((alias) => (
              <div key={alias.id} className="rounded-2xl border border-stone-200 px-4 py-3">
                <div className="font-medium text-stone-900">{alias.sourceEmail}</div>
                <div className="text-sm text-stone-500">{alias.destination}</div>
              </div>
            ))}
          </div>
        </Surface>

        <Surface>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sender ACL</h2>
            <MiniLink href="/sender-acl">Open sender rules</MiniLink>
          </div>
          <div className="mt-5 space-y-3">
            {senderRules.slice(0, 5).map((rule) => (
              <div key={rule.id} className="rounded-2xl border border-stone-200 px-4 py-3">
                <div className="font-medium text-stone-900">{rule.allowedEmail}</div>
                <div className="text-sm text-stone-500">{rule.mailboxEmail}</div>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}
