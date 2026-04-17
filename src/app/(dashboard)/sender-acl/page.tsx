export const dynamic = "force-dynamic";

import { createSenderAclAction, deleteSenderAclAction } from "@/app/(dashboard)/actions";
import { Field, Notice, PageHeader, StatusPill, SubmitButton, Surface, TextInput } from "@/components/ui";
import { mailAdminProvider } from "@/lib/mailadmin";
import { readSearchParams } from "@/lib/search-params";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SenderAclPage({ searchParams }: Props) {
  const { success, error } = await readSearchParams(searchParams);
  const [rules, mailboxes] = await Promise.all([
    mailAdminProvider.listSenderAcl(),
    mailAdminProvider.listMailboxes(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sender ACL"
        title="Outbound identity policy"
        description="Manage which addresses each mailbox is allowed to use in the MAIL FROM / From header path."
      />

      {success ? <Notice tone="success">Action completed: {success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <div className="grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
        <Surface>
          <h2 className="text-lg font-semibold text-stone-950">Allow send-as</h2>
          <form action={createSenderAclAction} className="mt-5 grid gap-4">
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
            <SubmitButton>Add sender rule</SubmitButton>
          </form>
        </Surface>

        <Surface className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-stone-950">Sender ACL rules</h2>
              <p className="text-sm text-stone-500">{rules.length} record(s)</p>
            </div>
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
                {rules.map((rule) => (
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
