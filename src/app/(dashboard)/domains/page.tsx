export const dynamic = "force-dynamic";

import { createDomainAction, deleteDomainAction } from "@/app/(dashboard)/actions";
import { Field, Notice, PageHeader, StatusPill, SubmitButton, Surface, TextInput } from "@/components/ui";
import { mailAdminProvider } from "@/lib/mailadmin";
import { readSearchParams } from "@/lib/search-params";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DomainsPage({ searchParams }: Props) {
  const { success, error } = await readSearchParams(searchParams);
  const domains = await mailAdminProvider.listDomains();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Domains"
        title="Hosted domains"
        description="Add, reactivate and retire hosted domains. In CLI mode this panel can delegate to the existing mailadmin utility."
      />

      {success ? <Notice tone="success">Action completed: {success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Surface>
          <h2 className="text-lg font-semibold text-stone-950">Add a domain</h2>
          <form action={createDomainAction} className="mt-5 grid gap-4">
            <Field label="Domain name" htmlFor="domain-name" hint="Example: mestrefabio.com">
              <TextInput id="domain-name" name="name" placeholder="example.com" required />
            </Field>
            <SubmitButton>Create or reactivate</SubmitButton>
          </form>
        </Surface>

        <Surface className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-stone-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-stone-950">Current domains</h2>
              <p className="text-sm text-stone-500">{domains.length} record(s)</p>
            </div>
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
                {domains.map((domain) => (
                  <tr key={domain.id} className="border-t border-stone-200">
                    <td className="px-6 py-4 font-medium text-stone-900">{domain.name}</td>
                    <td className="px-6 py-4">
                      <StatusPill active={domain.active} />
                    </td>
                    <td className="px-6 py-4 text-stone-600">{domain.mailboxCount}</td>
                    <td className="px-6 py-4 text-stone-600">{domain.aliasCount}</td>
                    <td className="px-6 py-4">
                      <form action={deleteDomainAction}>
                        <input type="hidden" name="name" value={domain.name} />
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
