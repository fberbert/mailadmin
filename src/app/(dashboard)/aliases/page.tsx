export const dynamic = "force-dynamic";

import { createAliasAction, deleteAliasAction } from "@/app/(dashboard)/actions";
import { Field, Notice, PageHeader, StatusPill, SubmitButton, Surface, TextInput } from "@/components/ui";
import { mailAdminProvider } from "@/lib/mailadmin";
import { readSearchParams } from "@/lib/search-params";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AliasesPage({ searchParams }: Props) {
  const { success, error } = await readSearchParams(searchParams);
  const [aliases, mailboxes] = await Promise.all([
    mailAdminProvider.listAliases(),
    mailAdminProvider.listMailboxes(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Aliases"
        title="Inbound alias routing"
        description="Manage source addresses and delivery targets. Optionally add the alias as an extra send-as identity for a mailbox."
      />

      {success ? <Notice tone="success">Action completed: {success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <div className="grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
        <Surface>
          <h2 className="text-lg font-semibold text-stone-950">Create alias</h2>
          <form action={createAliasAction} className="mt-5 grid gap-4">
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
                className="h-11 rounded-2xl border border-stone-300 bg-stone-50 px-4 text-sm text-stone-950 outline-none transition focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-100"
                placeholder="fabio@example.com"
              />
              <datalist id="mailbox-options">
                {mailboxes.map((mailbox) => (
                  <option key={mailbox.id} value={mailbox.email} />
                ))}
              </datalist>
            </Field>
            <SubmitButton>Create alias</SubmitButton>
          </form>
        </Surface>

        <Surface className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-stone-950">Alias catalog</h2>
              <p className="text-sm text-stone-500">{aliases.length} record(s)</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Source</th>
                  <th className="px-6 py-3 font-medium">Destination</th>
                  <th className="px-6 py-3 font-medium">Domain</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {aliases.map((alias) => (
                  <tr key={alias.id} className="border-t border-stone-200">
                    <td className="px-6 py-4 font-medium text-stone-900">{alias.sourceEmail}</td>
                    <td className="px-6 py-4 text-stone-600">{alias.destination}</td>
                    <td className="px-6 py-4 text-stone-600">{alias.domainName}</td>
                    <td className="px-6 py-4">
                      <StatusPill active={alias.active} />
                    </td>
                    <td className="px-6 py-4">
                      <form action={deleteAliasAction}>
                        <input type="hidden" name="sourceEmail" value={alias.sourceEmail} />
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
