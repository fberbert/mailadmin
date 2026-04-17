"use client";

import { TriangleAlert, Trash2, X } from "lucide-react";
import { useState } from "react";

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

  return (
    <>
      <button
        type="button"
        aria-label={confirmLabel}
        title={confirmLabel}
        onClick={() => setOpen(true)}
        className="inline-flex size-10 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-500"
      >
        <Trash2 className="size-4" />
        <span className="sr-only">{confirmLabel}</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-stone-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                  <TriangleAlert className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{description}</p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close confirmation dialog"
                onClick={() => setOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-xl bg-stone-100 text-stone-700 transition hover:bg-stone-200"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-stone-100 px-4 text-sm font-semibold text-stone-900 transition hover:bg-stone-200"
              >
                Cancel
              </button>
              <form action={action}>
                {fields.map((field) => (
                  <input key={`${field.name}:${field.value}`} type="hidden" name={field.name} value={field.value} />
                ))}
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500"
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
