"use client";

import { Pencil, Settings2, X } from "lucide-react";
import { useState } from "react";

import { QuotaInput } from "@/components/quota-input";
import { SelectInput } from "@/components/ui";

export function EditMailboxAction({
  action,
  email,
  active,
  quotaBytes,
  returnTo,
}: {
  action: (formData: FormData) => void | Promise<void>;
  email: string;
  active: boolean;
  quotaBytes: bigint | null;
  returnTo: string;
}) {
  const [open, setOpen] = useState(false);
  const quotaInputId = `quota-${email.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

  return (
    <>
      <button
        type="button"
        aria-label={`Edit mailbox ${email}`}
        title={`Edit mailbox ${email}`}
        onClick={() => setOpen(true)}
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl bg-stone-100 text-stone-900 transition hover:bg-stone-200"
      >
        <Pencil className="size-4" />
        <span className="sr-only">Edit mailbox {email}</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm animate-[fade-slide-in_180ms_ease-out]">
          <div className="w-full max-w-2xl rounded-[2rem] border border-stone-200 bg-white p-6 shadow-2xl animate-[scale-in-soft_220ms_cubic-bezier(0.22,1,0.36,1)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                  <Settings2 className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-950">Edit mailbox</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{email}</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close mailbox settings dialog"
                onClick={() => setOpen(false)}
                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl bg-stone-100 text-stone-700 transition hover:bg-stone-200"
              >
                <X className="size-4" />
              </button>
            </div>

            <form action={action} className="mt-6 space-y-5">
              <input type="hidden" name="returnTo" value={returnTo} />
              <input type="hidden" name="email" value={email} />

              <div className="grid gap-2 text-sm font-medium text-stone-800">
                <span>Status</span>
                <SelectInput name="active" defaultValue={active ? "true" : "false"}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </SelectInput>
                <span className="min-h-4 text-xs font-normal text-stone-500">
                  Inactive mailboxes stop authenticating and stop local delivery.
                </span>
              </div>

              <div className="grid gap-2 text-sm font-medium text-stone-800">
                <span>Quota</span>
                <QuotaInput id={quotaInputId} name="quotaBytes" initialBytes={quotaBytes} />
                <span className="min-h-4 text-xs font-normal text-stone-500">
                  Leave empty to keep the mailbox unlimited.
                </span>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl bg-stone-100 px-4 text-sm font-semibold text-stone-900 transition hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl bg-stone-950 px-4 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Save mailbox
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
