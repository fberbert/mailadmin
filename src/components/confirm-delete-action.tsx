"use client";

import { TriangleAlert, Trash2, X } from "lucide-react";
import { useCallback, useId, useState } from "react";

import { useDialogA11y } from "@/lib/use-dialog-a11y";

type HiddenField = {
  name: string;
  value: string;
};

export function ConfirmDeleteAction({
  action,
  title,
  description,
  fields,
  confirmLabel = "Delete",
}: {
  action: (formData: FormData) => void | Promise<void>;
  title: string;
  description: string;
  fields: HiddenField[];
  confirmLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const dialogRef = useDialogA11y(open, close);
  const titleId = useId();

  return (
    <>
      <button
        type="button"
        aria-label={confirmLabel}
        title={confirmLabel}
        onClick={() => setOpen(true)}
        className="btn-ghost-danger"
      >
        <Trash2 className="size-4" />
        <span className="sr-only">{confirmLabel}</span>
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
            className="w-full max-w-md rounded-[2rem] border p-6 animate-[scale-in-soft_220ms_cubic-bezier(0.22,1,0.36,1)]"
            style={{ borderColor: "var(--border)", background: "var(--surface)", boxShadow: "var(--shadow-modal)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl" style={{ background: "var(--danger-bg)", color: "var(--danger)" }}>
                  <TriangleAlert className="size-5" />
                </div>
                <div>
                  <h3 id={titleId} className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{title}</h3>
                  <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>{description}</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close confirmation dialog"
                onClick={close}
                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-xl transition"
                style={{ background: "var(--btn-secondary-bg)", color: "var(--text-secondary)" }}
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={close}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl px-4 text-sm font-semibold transition"
                style={{ background: "var(--btn-secondary-bg)", color: "var(--text-primary)" }}
              >
                Cancel
              </button>
              <form action={action}>
                {fields.map((field) => (
                  <input key={`${field.name}:${field.value}`} type="hidden" name={field.name} value={field.value} />
                ))}
                <button
                  type="submit"
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-2xl px-4 text-sm font-semibold text-white transition"
                  style={{ background: "var(--danger)" }}
                >
                  {confirmLabel}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
