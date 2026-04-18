"use client";

import { Pencil, Settings2, X } from "lucide-react";
import { useCallback, useId, useState } from "react";

import { QuotaInput } from "@/components/quota-input";
import { SelectInput } from "@/components/ui";
import { useDialogA11y } from "@/lib/use-dialog-a11y";

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
  const close = useCallback(() => setOpen(false), []);
  const dialogRef = useDialogA11y(open, close);
  const titleId = useId();
  const quotaInputId = `quota-${email.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

  return (
    <>
      <button
        type="button"
        aria-label={`Edit mailbox ${email}`}
        title={`Edit mailbox ${email}`}
        onClick={() => setOpen(true)}
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl transition"
        style={{ background: "var(--btn-secondary-bg)", color: "var(--text-primary)" }}
      >
        <Pencil className="size-4" />
        <span className="sr-only">Edit mailbox {email}</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-[fade-slide-in_180ms_ease-out]"
          style={{ background: "var(--modal-overlay)" }}
          onClick={close}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-2xl rounded-[2rem] border p-6 animate-[scale-in-soft_220ms_cubic-bezier(0.22,1,0.36,1)]"
            style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-modal)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl" style={{ background: "var(--accent-muted)", color: "var(--accent-text)" }}>
                  <Settings2 className="size-5" />
                </div>
                <div>
                  <h3 id={titleId} className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Edit mailbox</h3>
                  <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>{email}</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close mailbox settings dialog"
                onClick={close}
                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl transition"
                style={{ background: "var(--btn-secondary-bg)", color: "var(--text-secondary)" }}
              >
                <X className="size-4" />
              </button>
            </div>

            <form action={action} className="mt-6 space-y-5">
              <input type="hidden" name="returnTo" value={returnTo} />
              <input type="hidden" name="email" value={email} />

              <div className="grid gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                <span>Status</span>
                <SelectInput name="active" defaultValue={active ? "true" : "false"}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </SelectInput>
                <span className="min-h-4 text-xs font-normal" style={{ color: "var(--text-muted)" }}>
                  Inactive mailboxes stop authenticating and stop local delivery.
                </span>
              </div>

              <div className="grid gap-2 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                <span>Quota</span>
                <QuotaInput id={quotaInputId} name="quotaBytes" initialBytes={quotaBytes} />
                <span className="min-h-4 text-xs font-normal" style={{ color: "var(--text-muted)" }}>
                  Leave empty to keep the mailbox unlimited.
                </span>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={close}
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl px-4 text-sm font-semibold transition"
                  style={{ background: "var(--btn-secondary-bg)", color: "var(--text-primary)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl px-4 text-sm font-semibold transition"
                  style={{ background: "var(--btn-primary-bg)", color: "var(--btn-primary-text)" }}
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
