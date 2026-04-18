export const dynamic = "force-dynamic";

import { createSenderAclAction, deleteSenderAclAction } from "@/app/(dashboard)/actions";
import {
  Breadcrumb,
  EmptyState,
  Field,
  FormActionSlot,
  PageHeader,
  PaginationNav,
  SelectInput,
  StatusPill,
  SubmitButton,
  Surface,
  TextInput,
} from "@/components/ui";
import { ConfirmDeleteAction } from "@/components/confirm-delete-action";
import { getMailAdminProvider } from "@/lib/mailadmin";
import { buildListHref, paginateItems, readListParams } from "@/lib/search-params";
import { PageToast } from "@/components/page-toast";
import { Send } from "lucide-react";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 10;

export default async function SenderAclPage({ searchParams }: Props) {
  const { success, error, domain, query, page } = await readListParams(searchParams);
  const mailAdminProvider = await getMailAdminProvider();
  const [rules, mailboxes] = await Promise.all([
    mailAdminProvider.listSenderAcl(),
    mailAdminProvider.listMailboxes(),
  ]);
  const currentHref = buildListHref("/sender-acl", { domain, query, page });
  const domainOptions = Array.from(new Set(mailboxes.map((record) => record.domainName))).sort();
  const filteredRules = rules.filter((record) => {
    const mailboxDomain = record.mailboxEmail.split("@")[1] ?? "";
    const matchesDomain = !domain || mailboxDomain === domain;
    const needle = query.toLowerCase();
    const matchesQuery =
      !needle ||
      record.mailboxEmail.toLowerCase().includes(needle) ||
      record.allowedEmail.toLowerCase().includes(needle) ||
      mailboxDomain.toLowerCase().includes(needle);

    return matchesDomain && matchesQuery;
  });
  const paginated = paginateItems(filteredRules, page, PAGE_SIZE);
  const buildHref = (nextPage: number) =>
    buildListHref("/sender-acl", { domain, query, page: nextPage });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Sender ACL" }]} />}
        title="Outbound identity policy"
        description="Manage which addresses each mailbox is allowed to use in the MAIL FROM / From header path."
      />

      <PageToast success={success} error={error} />

      <Surface>
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Allow send-as</h2>
        <form action={createSenderAclAction} className="mt-5 grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]">
          <input type="hidden" name="returnTo" value={currentHref} />
          <Field label="Mailbox" htmlFor="mailboxEmail">
            <input
              id="mailboxEmail"
              name="mailboxEmail"
              list="mailbox-sender-options"
              className="h-11 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4"
              style={{
                background: "var(--input-bg)",
                borderColor: "var(--input-border)",
                color: "var(--text-primary)",
              }}
              placeholder="fabio@example.com"
              required
            />
            <datalist id="mailbox-sender-options">
              {mailboxes.map((mailbox) => (
                <option key={mailbox.id} value={mailbox.email} />
              ))}
            </datalist>
          </Field>
          <Field label="Allowed email" htmlFor="allowedEmail">
            <TextInput id="allowedEmail" name="allowedEmail" type="email" placeholder="postmaster@example.com" required />
          </Field>
          <FormActionSlot>
            <SubmitButton className="w-full">Add sender rule</SubmitButton>
          </FormActionSlot>
        </form>
      </Surface>

      <Surface className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b px-6 py-5" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Sender ACL rules</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{filteredRules.length} filtered record(s)</p>
          </div>
          <form className="grid items-start gap-4 md:grid-cols-[220px_minmax(0,1fr)_120px]">
            <Field label="Domain" htmlFor="domain-filter">
              <SelectInput id="domain-filter" name="domain" defaultValue={domain}>
                <option value="">All domains</option>
                {domainOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Search" htmlFor="query-filter">
              <TextInput id="query-filter" name="q" defaultValue={query} placeholder="Filter by mailbox or allowed email" />
            </Field>
            <FormActionSlot>
              <SubmitButton variant="secondary" className="w-full">
                Filter
              </SubmitButton>
            </FormActionSlot>
          </form>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm" data-striped>
            <thead style={{ background: "var(--table-header-bg)", color: "var(--table-header-text)" }}>
              <tr>
                <th className="px-6 py-3 font-semibold">Mailbox</th>
                <th className="px-6 py-3 font-semibold">Allowed email</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.items.map((rule) => (
                <tr key={rule.id} className="border-t transition-colors" style={{ borderColor: "var(--border)" }}>
                  <td className="px-6 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{rule.mailboxEmail}</td>
                  <td className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{rule.allowedEmail}</td>
                  <td className="px-6 py-4">
                    <StatusPill active={rule.active} />
                  </td>
                  <td className="px-6 py-4">
                    <ConfirmDeleteAction
                      action={deleteSenderAclAction}
                      title="Delete sender permission?"
                      description={`${rule.mailboxEmail} will no longer be allowed to send as ${rule.allowedEmail}.`}
                      confirmLabel="Delete rule"
                      fields={[
                        { name: "returnTo", value: currentHref },
                        { name: "mailboxEmail", value: rule.mailboxEmail },
                        { name: "allowedEmail", value: rule.allowedEmail },
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {paginated.items.length === 0 ? (
                <tr className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td colSpan={4}>
                    <EmptyState
                      icon={Send}
                      title="No sender rules found"
                      description="No sender ACL rules matched the current filters. Try adjusting your search or add a new rule above."
                    />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <PaginationNav
          pathname="/sender-acl"
          currentPage={paginated.currentPage}
          totalPages={paginated.totalPages}
          buildHref={buildHref}
        />
      </Surface>
    </div>
  );
}
