import { createFileRoute, Link } from "@tanstack/react-router";

import { KINDS, isKind, type Kind } from "@/lib/ridge/kinds";
import { getTimeline } from "@/lib/ridge/server";
import type { EventRecord } from "@/lib/ridge/types";

type TimelineSearch = {
  kind?: Kind;
};

export const Route = createFileRoute("/app/timeline")({
  validateSearch: (search: Record<string, unknown>): TimelineSearch => {
    const raw = typeof search.kind === "string" ? search.kind : undefined;
    return { kind: raw && isKind(raw) ? raw : undefined };
  },
  loader: async () => {
    try {
      return await getTimeline();
    } catch (err) {
      return {
        events: [] as EventRecord[],
        warnings: [],
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
  head: () => ({
    meta: [{ title: "Timeline · Ridge" }],
  }),
  component: TimelinePage,
});

function TimelinePage() {
  const data = Route.useLoaderData();
  const { kind } = Route.useSearch();
  const events =
    "error" in data && data.error
      ? []
      : kind
        ? data.events.filter((event) => event.kinds.includes(kind))
        : data.events;
  const warnings = "warnings" in data ? data.warnings : [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">Evidence</p>
        <h1 className="font-display text-4xl tracking-tight">Timeline</h1>
      </header>

      {warnings.length > 0 ? (
        <div className="rounded-[var(--radius-md)] border border-danger/40 bg-surface p-4 text-sm">
          <p className="text-danger">Corrupt event files remain on disk.</p>
          <ul className="mt-2 space-y-1 text-muted">
            {warnings.map((warning) => (
              <li key={warning.path}>
                {warning.path}: {warning.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {"error" in data && data.error ? (
        <p className="text-sm text-danger">{data.error}</p>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        <Link
          to="/app/timeline"
          className={
            kind
              ? "rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted hover:text-foreground"
              : "rounded-full border border-accent bg-accent-soft px-2.5 py-0.5 text-[11px] text-foreground"
          }
        >
          all
        </Link>
        {KINDS.map((item) => (
          <Link
            key={item}
            to="/app/timeline"
            search={{ kind: item }}
            className={
              kind === item
                ? "rounded-full border border-accent bg-accent-soft px-2.5 py-0.5 text-[11px] text-foreground"
                : "rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted hover:text-foreground"
            }
          >
            {item}
          </Link>
        ))}
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-muted">No events yet.</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                to="/app/events/$id"
                params={{ id: event.id }}
                className="block rounded-[var(--radius-md)] border border-border bg-surface p-4 hover:border-accent"
              >
                <p className="font-mono text-[11px] text-faint">
                  {event.created.slice(0, 10)}
                  {event.interpretation === "pending" ? " · pending" : ""}
                  {event.kinds.length > 0 ? ` · ${event.kinds.join(", ")}` : ""}
                </p>
                <p className="mt-1 text-sm text-foreground">{event.body.split("\n")[0]}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
