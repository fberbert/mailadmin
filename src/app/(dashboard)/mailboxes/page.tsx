export const dynamic = "force-dynamic";

import {
  createMailboxAction,
  deleteMailboxAction,
  updateMailboxPasswordAction,
} from "@/app/(dashboard)/actions";
import { Field, Notice, PageHeader, StatusPill, SubmitButton, Surface, TextInput } from "@/components/ui";
import { mailAdminProvider } from "@/lib/mailadmin";
import { readSearchParams } from "@/lib/search-params";
import { formatBytes } from "@/lib/utils";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function MailboxesPage({ searchParams }: Props) {
  const { success, error } = await readSearchParams(searchParams);
  const mailboxes = await mailAdminProvider.listMailboxes();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mailboxes"
        title="Mailbox provisioning"
        description="Create mailbox identities, rotate passwords and inspect quotas. The primary sender ACL is created automatically."
      />

      {success ? <Notice tone="success">Action completed: {success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Surface>
          <h2 className="text-lg font-semibold text-stone-950">Create mailbox</h2>
          <form action={createMailboxAction} className="mt-5 grid gap-4">
            <Field label="Email address" htmlFor="mailbox-email">
              <TextInput id="mailbox-email" name="email" type="email" placeholder="fabio@example.com" required />
            </Field>
            <Field label="Password" htmlFor="mailbox-password">
              <TextInput id="mailbox-password" name="password" type="password" placeholder="temporary password" required />
            </Field>
            <Field label="Quota bytes" htmlFor="mailbox-quota" hint="Leave empty for unlimited.">
              <TextInput id="mailbox-quota" name="quotaBytes" inputMode="numeric" placeholder="1073741824" />
            </Field>
            <SubmitButton>Create mailbox</SubmitButton>
          </form>
        </Surface>

        <Surface className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-stone-950">Mailbox catalog</h2>
              <p className="text-sm text-stone-500">{mailboxes.length} record(s)</p>
            </div>
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
                {mailboxes.map((mailbox) => (
                  <tr key={mailbox.id} className="border-t border-stone-200 align-top">
                    <td className="px-6 py-4 font-medium text-stone-900">{mailbox.email}</td>
                    <td className="px-6 py-4 text-stone-600">{mailbox.domainName}</td>
                    <td className="px-6 py-4 text-stone-600">{formatBytes(mailbox.quotaBytes)}</td>
                    <td className="px-6 py-4 text-stone-600">{mailbox.senderCount}</td>
                    <td className="px-6 py-4">
                      <StatusPill active={mailbox.active} />
                    </td>
                    <td className="px-6 py-4">
                      <form action={updateMailboxPasswordAction} className="flex min-w-60 gap-2">
                        <input type="hidden" name="email" value={mailbox.email} />
                        <TextInput
                          name="password"
                          type="password"
                          placeholder="new password"
                          className="h-10 flex-1 rounded-xl"
                          required
                        />
                        <SubmitButton className="h-10 rounded-xl px-3">Rotate</SubmitButton>
                      </form>
                    </td>
                    <td className="px-6 py-4">
                      <form action={deleteMailboxAction}>
                        <input type="hidden" name="email" value={mailbox.email} />
                        <SubmitButton variant="danger">Delete</SubmitButton>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      </div>
    </div>
  );
}
