export const dynamic = "force-dynamic";

import {
  createMailboxAction,
  deleteMailboxAction,
  updateMailboxAction,
  updateMailboxPasswordAction,
} from "@/app/(dashboard)/actions";
import {
  ActionIconButton,
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
import { EditMailboxAction } from "@/components/edit-mailbox-action";
import { PageToast } from "@/components/page-toast";
import { PasswordInput } from "@/components/password-input";
import { QuotaInput } from "@/components/quota-input";
import { getMailAdminProvider } from "@/lib/mailadmin";
import { buildListHref, paginateItems, readListParams } from "@/lib/search-params";
import { formatBytes } from "@/lib/utils";
import { Mailbox, RotateCw } from "lucide-react";

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
        eyebrow={<Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Mailboxes" }]} />}
        title="Mailbox provisioning"
        description="Create mailbox identities, rotate passwords and inspect quotas. The primary sender ACL is created automatically."
      />

      <PageToast success={success} error={error} />

      <Surface>
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Create mailbox</h2>
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
          <Field label="Quota" htmlFor="mailbox-quota" hint="Leave empty for unlimited. Saved internally in bytes.">
            <QuotaInput id="mailbox-quota" name="quotaBytes" />
          </Field>
          <FormActionSlot>
            <SubmitButton className="w-full">Create mailbox</SubmitButton>
          </FormActionSlot>
        </form>
      </Surface>

      <Surface className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b px-6 py-5" style={{ borderColor: "var(--border)" }}>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Mailbox catalog</h2>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>{filteredMailboxes.length} filtered record(s)</p>
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
          <table className="min-w-full text-left text-sm" data-striped>
            <thead style={{ background: "var(--table-header-bg)", color: "var(--table-header-text)" }}>
              <tr>
                <th className="px-6 py-3 font-semibold">Mailbox</th>
                <th className="px-6 py-3 font-semibold">Domain</th>
                <th className="px-6 py-3 font-semibold">Quota</th>
                <th className="px-6 py-3 font-semibold">Sender ACL</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.items.map((mailbox) => (
                <tr key={mailbox.id} className="border-t align-top transition-colors" style={{ borderColor: "var(--border)" }}>
                  <td className="px-6 py-4 font-medium" style={{ color: "var(--text-primary)" }}>{mailbox.email}</td>
                  <td className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{mailbox.domainName}</td>
                  <td className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{formatBytes(mailbox.quotaBytes)}</td>
                  <td className="px-6 py-4" style={{ color: "var(--text-secondary)" }}>{mailbox.senderCount}</td>
                  <td className="px-6 py-4">
                    <StatusPill active={mailbox.active} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap items-start gap-2">
                      <EditMailboxAction
                        action={updateMailboxAction}
                        email={mailbox.email}
                        active={mailbox.active}
                        quotaBytes={mailbox.quotaBytes}
                        returnTo={currentHref}
                      />
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
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.items.length === 0 ? (
                <tr className="border-t" style={{ borderColor: "var(--border)" }}>
                  <td colSpan={6}>
                    <EmptyState
                      icon={Mailbox}
                      title="No mailboxes found"
                      description="No mailboxes matched the current filters. Try adjusting your search or create a new mailbox above."
                    />
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
