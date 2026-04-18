export const dynamic = "force-dynamic";

import { createAliasAction, deleteAliasAction } from "@/app/(dashboard)/actions";
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
import { Workflow } from "lucide-react";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 10;

export default async function AliasesPage({ searchParams }: Props) {
  const { success, error, domain, query, page } = await readListParams(searchParams);
  const mailAdminProvider = await getMailAdminProvider();
  const [aliases, mailboxes] = await Promise.all([
    mailAdminProvider.listAliases(),
    mailAdminProvider.listMailboxes(),
  ]);
  const currentHref = buildListHref("/aliases", { domain, query, page });
  const domainOptions = Array.from(
    new Set([...aliases.map((record) => record.domainName), ...mailboxes.map((record) => record.domainName)]),
  ).sort();
  const filteredAliases = aliases.filter((record) => {
    const matchesDomain = !domain || record.domainName === domain;
    const needle = query.toLowerCase();
    const matchesQuery =
      !needle ||
      record.sourceEmail.toLowerCase().includes(needle) ||
      record.destination.toLowerCase().includes(needle) ||
      record.domainName.toLowerCase().includes(needle);

    return matchesDomain && matchesQuery;
  });
  const paginated = paginateItems(filteredAliases, page, PAGE_SIZE);
  const buildHref = (nextPage: number) =>
    buildListHref("/aliases", { domain, query, page: nextPage });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Aliases" }]} />}
        title="Inbound alias routing"
        description="Manage source addresses and delivery targets. Optionally add the alias as an extra send-as identity for a mailbox."
      />

      <PageToast success={success} error={error} />

      <Surface>
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Create alias</h2>
        <form action={createAliasAction} className="mt-5 grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_220px]">
          <input type="hidden" name="returnTo" value={currentHref} />
          <Field label="Source email" htmlFor="source-email">
            <TextInput id="source-email" name="sourceEmail" type="email" placeholder="contato@example.com" required />
          </Field>
          <Field label="Destination" htmlFor="destination" hint="Single destination is enough for the first version.">
            <TextInput id="destination" name="destination" placeholder="fabio@example.com" required />
          </Field>
          <Field label="Also allow send-as" htmlFor="allow-send" hint="Optional mailbox email for sender ACL insertion.">
            <input
              id="allow-send"
              name="allowSendMailbox"
              list="mailbox-options"
              className="h-11 rounded-2xl border px-4 text-sm outline-none transition focus:ring-4"
              style={{
                background: "var(--input-bg)",
                borderColor: "var(--input-border)",
                color: "var(--text-primary)",
              }}
              placeholder="fabio@example.com"
            />
            <datalist id="mailbox-options">
              {mailboxes.map((mailbox) => (
                <option key={mailbox.id} value={mailbox.email} />
              ))}
            </datalist>
          </Field>
          <FormActionSlot>
            <SubmitButton className="w-full">Create alias</SubmitButton>
          </FormActionSlot>
        </form>
      </Surface>

      <Surface className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b px-6 py-5" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Alias catalog</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{filteredAliases.length} filtered record(s)</p>
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
              <TextInput id="query-filter" name="q" defaultValue={query} placeholder="Filter by source or destination" />
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
                <th className="px-6 py-3 font-semibold">Source</th>
                <th className="px-6 py-3 font-semibold">Destination</th>
                <th className="px-6 py-3 font-semibold">Domain</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.items.map((alias) => (
                <tr key={alias.id} className="border-t transition-colors" style={{ borderColor: "var(--border)" }}>
                  <td className="px-6 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{alias.sourceEmail}</td>
                  <td className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{alias.destination}</td>
                  <td className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{alias.domainName}</td>
                  <td className="px-6 py-4">
                    <StatusPill active={alias.active} />
                  </td>
                  <td className="px-6 py-4">
                    <ConfirmDeleteAction
                      action={deleteAliasAction}
                      title={`Delete alias ${alias.sourceEmail}?`}
                      description={`Incoming mail for ${alias.sourceEmail} will stop routing to ${alias.destination}.`}
                      confirmLabel="Delete alias"
                      fields={[
                        { name: "returnTo", value: currentHref },
                        { name: "sourceEmail", value: alias.sourceEmail },
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {paginated.items.length === 0 ? (
                <tr className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td colSpan={5}>
                    <EmptyState
                      icon={Workflow}
                      title="No aliases found"
                      description="No aliases matched the current filters. Try adjusting your search or create a new alias above."
                    />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <PaginationNav
          pathname="/aliases"
          currentPage={paginated.currentPage}
          totalPages={paginated.totalPages}
          buildHref={buildHref}
        />
      </Surface>
    </div>
  );
}
