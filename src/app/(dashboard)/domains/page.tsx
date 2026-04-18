export const dynamic = "force-dynamic";

import { createDomainAction, deleteDomainAction } from "@/app/(dashboard)/actions";
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
import { Globe2 } from "lucide-react";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 10;

export default async function DomainsPage({ searchParams }: Props) {
  const { success, error, domain, query, page } = await readListParams(searchParams);
  const mailAdminProvider = await getMailAdminProvider();
  const domains = await mailAdminProvider.listDomains();
  const currentHref = buildListHref("/domains", { domain, query, page });
  const filteredDomains = domains.filter((record) => {
    const matchesDomain = !domain || record.name === domain;
    const needle = query.toLowerCase();
    const matchesQuery =
      !needle ||
      record.name.toLowerCase().includes(needle) ||
      String(record.mailboxCount).includes(needle) ||
      String(record.aliasCount).includes(needle);

    return matchesDomain && matchesQuery;
  });
  const paginated = paginateItems(filteredDomains, page, PAGE_SIZE);
  const domainOptions = domains.map((record) => record.name);
  const buildHref = (nextPage: number) =>
    buildListHref("/domains", { domain, query, page: nextPage });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Domains" }]} />}
        title="Hosted domains"
        description="Add, reactivate and retire hosted domains. In CLI mode this panel can delegate to the existing mailadmin utility."
      />

      <PageToast success={success} error={error} />

      <Surface>
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Add a domain</h2>
        <form action={createDomainAction} className="mt-5 grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <input type="hidden" name="returnTo" value={currentHref} />
          <Field label="Domain name" htmlFor="domain-name" hint="Example: mestrefabio.com">
            <TextInput id="domain-name" name="name" placeholder="example.com" required />
          </Field>
          <FormActionSlot>
            <SubmitButton className="w-full">Create or reactivate</SubmitButton>
          </FormActionSlot>
        </form>
      </Surface>

      <Surface className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b px-6 py-5" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Current domains</h2>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>{filteredDomains.length} filtered record(s)</p>
            </div>
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
              <TextInput
                id="query-filter"
                name="q"
                defaultValue={query}
                placeholder="Filter by name or counts"
              />
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
                <th className="px-6 py-3 font-semibold">Domain</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Mailboxes</th>
                <th className="px-6 py-3 font-semibold">Aliases</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.items.map((record) => (
                <tr key={record.id} className="border-t transition-colors" style={{ borderColor: "var(--border)" }}>
                  <td className="px-6 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{record.name}</td>
                  <td className="px-6 py-4">
                    <StatusPill active={record.active} />
                  </td>
                  <td className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{record.mailboxCount}</td>
                  <td className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{record.aliasCount}</td>
                  <td className="px-6 py-4">
                    <ConfirmDeleteAction
                      action={deleteDomainAction}
                      title={`Delete domain ${record.name}?`}
                      description="This removes the hosted domain from the panel. Use this only when the domain is no longer managed here."
                      confirmLabel="Delete domain"
                      fields={[
                        { name: "returnTo", value: currentHref },
                        { name: "name", value: record.name },
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {paginated.items.length === 0 ? (
                <tr className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td colSpan={5}>
                    <EmptyState
                      icon={Globe2}
                      title="No domains found"
                      description="No domains matched the current filters. Try adjusting your search or add a new domain above."
                    />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <PaginationNav
          pathname="/domains"
          currentPage={paginated.currentPage}
          totalPages={paginated.totalPages}
          buildHref={buildHref}
        />
      </Surface>
    </div>
  );
}
