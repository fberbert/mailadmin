export default function DashboardLoading() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Page header skeleton */}
      <div className="space-y-3 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="h-3 w-20 rounded" style={{ background: "var(--surface-muted)" }} />
        <div className="h-8 w-64 rounded" style={{ background: "var(--surface-muted)" }} />
        <div className="h-4 w-96 max-w-full rounded" style={{ background: "var(--surface-muted)" }} />
      </div>

      {/* Form card skeleton */}
      <div className="rounded-3xl border p-6" style={{ borderColor: "var(--border)", background: "var(--surface-raised)" }}>
        <div className="h-5 w-40 rounded" style={{ background: "var(--surface-muted)" }} />
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 rounded" style={{ background: "var(--surface-muted)" }} />
              <div className="h-11 rounded-2xl" style={{ background: "var(--surface-muted)" }} />
            </div>
          ))}
          <div className="self-end">
            <div className="h-11 rounded-2xl" style={{ background: "var(--surface-muted)" }} />
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="overflow-hidden rounded-3xl border" style={{ borderColor: "var(--border)", background: "var(--surface-raised)" }}>
        <div className="border-b px-6 py-5" style={{ borderColor: "var(--border)" }}>
          <div className="h-5 w-40 rounded" style={{ background: "var(--surface-muted)" }} />
          <div className="mt-2 h-3 w-24 rounded" style={{ background: "var(--surface-muted)" }} />
        </div>
        <div className="px-6 py-3" style={{ background: "var(--table-header-bg)" }}>
          <div className="flex gap-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 w-20 rounded" style={{ background: "var(--surface-muted)" }} />
            ))}
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-8 border-t px-6 py-4" style={{ borderColor: "var(--border)" }}>
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-4 w-24 rounded" style={{ background: "var(--surface-muted)" }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
