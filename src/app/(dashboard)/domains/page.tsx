export const dynamic = "force-dynamic";

import { createDomainAction, deleteDomainAction } from "@/app/(dashboard)/actions";
import {
  ActionIconButton,
  Field,
  FormActionSlot,
  Notice,
  PageHeader,
  PaginationNav,
  SelectInput,
  StatusPill,
  SubmitButton,
  Surface,
  TextInput,
} from "@/components/ui";
import { getMailAdminProvider } from "@/lib/mailadmin";
import { buildListHref, paginateItems, readListParams } from "@/lib/search-params";
import { Trash2 } from "lucide-react";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 10;

export default async function DomainsPage({ searchParams }: Props) {
  const { success, error, domain, query, page } = await readListParams(searchParams);
  const mailAdminProvider = await getMailAdminProvider();
  const domains = await mailAdminProvider.listDomains();
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
        eyebrow="Domains"
        title="Hosted domains"
        description="Add, reactivate and retire hosted domains. In CLI mode this panel can delegate to the existing mailadmin utility."
      />

      {success ? <Notice tone="success">Action completed: {success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <Surface>
        <h2 className="text-lg font-semibold text-stone-950">Add a domain</h2>
        <form action={createDomainAction} className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <Field label="Domain name" htmlFor="domain-name" hint="Example: mestrefabio.com">
            <TextInput id="domain-name" name="name" placeholder="example.com" required />
          </Field>
          <FormActionSlot>
            <SubmitButton className="w-full">Create or reactivate</SubmitButton>
          </FormActionSlot>
        </form>
      </Surface>

      <Surface className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-stone-200 px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-stone-950">Current domains</h2>
              <p className="text-sm text-stone-500">{filteredDomains.length} filtered record(s)</p>
            </div>
          </div>
          <form className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)_120px]">
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
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="px-6 py-3 font-medium">Domain</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Mailboxes</th>
                <th className="px-6 py-3 font-medium">Aliases</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.items.map((record) => (
                <tr key={record.id} className="border-t border-stone-200">
                  <td className="px-6 py-4 font-medium text-stone-900">{record.name}</td>
                  <td className="px-6 py-4">
                    <StatusPill active={record.active} />
                  </td>
                  <td className="px-6 py-4 text-stone-600">{record.mailboxCount}</td>
                  <td className="px-6 py-4 text-stone-600">{record.aliasCount}</td>
                  <td className="px-6 py-4">
                    <form action={deleteDomainAction}>
                      <input type="hidden" name="name" value={record.name} />
                      <ActionIconButton variant="danger" label={`Delete domain ${record.name}`}>
                        <Trash2 className="size-4" />
                      </ActionIconButton>
                    </form>
                  </td>
                </tr>
              ))}
              {paginated.items.length === 0 ? (
                <tr className="border-t border-stone-200">
                  <td colSpan={5} className="px-6 py-10 text-center text-stone-500">
                    No domains matched the current filters.
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
