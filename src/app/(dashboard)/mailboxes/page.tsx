export const dynamic = "force-dynamic";

import {
  createMailboxAction,
  deleteMailboxAction,
  updateMailboxPasswordAction,
} from "@/app/(dashboard)/actions";
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
import { ConfirmDeleteAction } from "@/components/confirm-delete-action";
import { PasswordInput } from "@/components/password-input";
import { getMailAdminProvider } from "@/lib/mailadmin";
import { buildListHref, paginateItems, readListParams } from "@/lib/search-params";
import { formatBytes } from "@/lib/utils";
import { RotateCw } from "lucide-react";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const PAGE_SIZE = 10;

export default async function MailboxesPage({ searchParams }: Props) {
  const { success, error, domain, query, page } = await readListParams(searchParams);
  const mailAdminProvider = await getMailAdminProvider();
  const mailboxes = await mailAdminProvider.listMailboxes();
  const currentHref = buildListHref("/mailboxes", { domain, query, page });
  const domainOptions = Array.from(new Set(mailboxes.map((record) => record.domainName))).sort();
  const filteredMailboxes = mailboxes.filter((record) => {
    const matchesDomain = !domain || record.domainName === domain;
    const needle = query.toLowerCase();
    const matchesQuery =
      !needle ||
      record.email.toLowerCase().includes(needle) ||
      record.domainName.toLowerCase().includes(needle) ||
      record.localPart.toLowerCase().includes(needle);

    return matchesDomain && matchesQuery;
  });
  const paginated = paginateItems(filteredMailboxes, page, PAGE_SIZE);
  const buildHref = (nextPage: number) =>
    buildListHref("/mailboxes", { domain, query, page: nextPage });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mailboxes"
        title="Mailbox provisioning"
        description="Create mailbox identities, rotate passwords and inspect quotas. The primary sender ACL is created automatically."
      />

      {success ? <Notice tone="success">Action completed: {success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <Surface>
        <h2 className="text-lg font-semibold text-stone-950">Create mailbox</h2>
        <form
          action={createMailboxAction}
          className="mt-5 grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_220px]"
        >
          <input type="hidden" name="returnTo" value={currentHref} />
          <Field label="Email address" htmlFor="mailbox-email">
            <TextInput id="mailbox-email" name="email" type="email" placeholder="fabio@example.com" required />
          </Field>
          <Field label="Password" htmlFor="mailbox-password">
            <PasswordInput id="mailbox-password" name="password" placeholder="temporary password" required />
          </Field>
          <Field label="Quota bytes" htmlFor="mailbox-quota" hint="Leave empty for unlimited.">
            <TextInput id="mailbox-quota" name="quotaBytes" inputMode="numeric" placeholder="1073741824" />
          </Field>
          <FormActionSlot>
            <SubmitButton className="w-full">Create mailbox</SubmitButton>
          </FormActionSlot>
        </form>
      </Surface>

      <Surface className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-stone-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-stone-950">Mailbox catalog</h2>
            <p className="text-sm text-stone-500">{filteredMailboxes.length} filtered record(s)</p>
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
              <TextInput id="query-filter" name="q" defaultValue={query} placeholder="Filter by mailbox or local-part" />
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
                <th className="px-6 py-3 font-medium">Domain</th>
                <th className="px-6 py-3 font-medium">Quota</th>
                <th className="px-6 py-3 font-medium">Sender ACL</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Password</th>
                <th className="px-6 py-3 font-medium">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginated.items.map((mailbox) => (
                <tr key={mailbox.id} className="border-t border-stone-200 align-top transition-colors hover:bg-stone-50/80">
                  <td className="px-6 py-4 font-medium text-stone-900">{mailbox.email}</td>
                  <td className="px-6 py-4 text-stone-600">{mailbox.domainName}</td>
                  <td className="px-6 py-4 text-stone-600">{formatBytes(mailbox.quotaBytes)}</td>
                  <td className="px-6 py-4 text-stone-600">{mailbox.senderCount}</td>
                  <td className="px-6 py-4">
                    <StatusPill active={mailbox.active} />
                  </td>
                  <td className="px-6 py-4">
                    <form action={updateMailboxPasswordAction} className="flex min-w-60 gap-2">
                      <input type="hidden" name="returnTo" value={currentHref} />
                      <input type="hidden" name="email" value={mailbox.email} />
                      <PasswordInput
                        name="password"
                        placeholder="new password"
                        className="h-10 flex-1 rounded-xl"
                        required
                      />
                      <ActionIconButton label={`Rotate password for ${mailbox.email}`}>
                        <RotateCw className="size-4" />
                      </ActionIconButton>
                    </form>
                  </td>
                  <td className="px-6 py-4">
                    <ConfirmDeleteAction
                      action={deleteMailboxAction}
                      title={`Delete mailbox ${mailbox.email}?`}
                      description="This removes the mailbox from the panel and revokes its authenticated access."
                      confirmLabel="Delete mailbox"
                      fields={[
                        { name: "returnTo", value: currentHref },
                        { name: "email", value: mailbox.email },
                      ]}
                    />
                  </td>
                </tr>
              ))}
              {paginated.items.length === 0 ? (
                <tr className="border-t border-stone-200">
                  <td colSpan={7} className="px-6 py-10 text-center text-stone-500">
                    No mailboxes matched the current filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <PaginationNav
          pathname="/mailboxes"
          currentPage={paginated.currentPage}
          totalPages={paginated.totalPages}
          buildHref={buildHref}
        />
      </Surface>
    </div>
  );
}
