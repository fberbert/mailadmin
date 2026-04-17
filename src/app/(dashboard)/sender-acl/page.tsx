export const dynamic = "force-dynamic";

import { createSenderAclAction, deleteSenderAclAction } from "@/app/(dashboard)/actions";
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

export default async function SenderAclPage({ searchParams }: Props) {
  const { success, error, domain, query, page } = await readListParams(searchParams);
  const mailAdminProvider = await getMailAdminProvider();
  const [rules, mailboxes] = await Promise.all([
    mailAdminProvider.listSenderAcl(),
    mailAdminProvider.listMailboxes(),
  ]);
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
        eyebrow="Sender ACL"
        title="Outbound identity policy"
        description="Manage which addresses each mailbox is allowed to use in the MAIL FROM / From header path."
      />

      {success ? <Notice tone="success">Action completed: {success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <Surface>
        <h2 className="text-lg font-semibold text-stone-950">Allow send-as</h2>
        <form action={createSenderAclAction} className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]">
          <Field label="Mailbox" htmlFor="mailboxEmail">
            <input
              id="mailboxEmail"
              name="mailboxEmail"
              list="mailbox-sender-options"
              className="h-11 rounded-2xl border border-stone-300 bg-stone-50 px-4 text-sm text-stone-950 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
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
        <div className="flex flex-col gap-4 border-b border-stone-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-stone-950">Sender ACL rules</h2>
            <p className="text-sm text-stone-500">{filteredRules.length} filtered record(s)</p>
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
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th className="px-6 py-3 font-medium">Mailbox</th>
                <th className="px-6 py-3 font-medium">Allowed email</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.items.map((rule) => (
                <tr key={rule.id} className="border-t border-stone-200">
                  <td className="px-6 py-4 font-medium text-stone-900">{rule.mailboxEmail}</td>
                  <td className="px-6 py-4 text-stone-600">{rule.allowedEmail}</td>
                  <td className="px-6 py-4">
                    <StatusPill active={rule.active} />
                  </td>
                  <td className="px-6 py-4">
                    <form action={deleteSenderAclAction}>
                      <input type="hidden" name="mailboxEmail" value={rule.mailboxEmail} />
                      <input type="hidden" name="allowedEmail" value={rule.allowedEmail} />
                      <ActionIconButton
                        variant="danger"
                        label={`Delete sender rule ${rule.allowedEmail} for ${rule.mailboxEmail}`}
                      >
                        <Trash2 className="size-4" />
                      </ActionIconButton>
                    </form>
                  </td>
                </tr>
              ))}
              {paginated.items.length === 0 ? (
                <tr className="border-t border-stone-200">
                  <td colSpan={4} className="px-6 py-10 text-center text-stone-500">
                    No sender ACL rules matched the current filters.
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
