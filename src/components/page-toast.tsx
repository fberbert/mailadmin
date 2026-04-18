"use client";

import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type ToastItem = {
  id: string;
  tone: "success" | "error";
  message: string;
};

function humanizeToken(value: string) {
  return value.replace(/[-_]+/g, " ");
}

export function PageToast({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const initialItems = useMemo(() => {
    const result: ToastItem[] = [];

    if (success) {
      result.push({
        id: `success:${success}`,
        tone: "success",
        message: humanizeToken(success),
      });
    }

    if (error) {
      result.push({
        id: `error:${error}`,
        tone: "error",
        message: error,
      });
    }

    return result;
  }, [success, error]);

  const items = useMemo(
    () => initialItems.filter((item) => !dismissedIds.includes(item.id)),
    [dismissedIds, initialItems],
  );

  useEffect(() => {
    if (!initialItems.length) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setDismissedIds(initialItems.map((item) => item.id));
      const params = new URLSearchParams(searchParams.toString());
      params.delete("success");
      params.delete("error");
      const search = params.toString();
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    }, 4200);

    return () => window.clearTimeout(timeout);
  }, [initialItems, pathname, router, searchParams]);

  if (!items.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-50 flex w-full max-w-sm flex-col gap-3">
      {items.map((item) => {
        const toneStyle =
          item.tone === "success"
            ? { background: "var(--success-bg)", color: "var(--success-text)", borderColor: "var(--success-border)" }
            : { background: "var(--danger-bg)", color: "var(--danger-text)", borderColor: "var(--danger-border)" };

        return (
          <div
            key={item.id}
            className="pointer-events-auto panel-reveal rounded-2xl border px-4 py-3"
            style={{ ...toneStyle, boxShadow: "var(--shadow-hover)" }}
          >
            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                {item.tone === "success" ? (
                  <CheckCircle2 className="size-5" />
                ) : (
                  <CircleAlert className="size-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">
                  {item.tone === "success" ? "Action completed" : "Action failed"}
                </div>
                <div className="mt-1 text-sm leading-6">{item.message}</div>
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => setDismissedIds((current) => [...current, item.id])}
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-xl transition hover:opacity-70"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
