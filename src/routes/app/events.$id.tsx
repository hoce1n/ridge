import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { defaultPropose } from "@/lib/ridge/interpret";
import { getEvent, postConfirm } from "@/lib/ridge/server";
import type { EventRecord } from "@/lib/ridge/types";

export const Route = createFileRoute("/app/events/$id")({
  loader: async ({ params }) => {
    try {
      const event = await getEvent({ data: { id: params.id } });
      return { event, error: null as string | null };
    } catch (err) {
      return {
        event: null as EventRecord | null,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
  head: ({ params }) => ({
    meta: [{ title: `${params.id} · Event · Ridge` }],
  }),
  component: EventPage,
});

function EventPage() {
  const { event, error } = Route.useLoaderData();
  const router = useRouter();
  const guessed = useMemo(
    () => (event ? defaultPropose(event.body).map((proposal) => proposal.name) : []),
    [event],
  );
  const [kept, setKept] = useState<string[]>(event?.concepts ?? []);
  const [busy, setBusy] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  if (error || !event) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-display text-3xl">Event</h1>
        <p className="mt-3 text-sm text-danger">{error ?? "Event not found"}</p>
      </div>
    );
  }

  const record = event;

  function toggle(name: string) {
    setKept((current) =>
      current.includes(name) ? current.filter((n) => n !== name) : [...current, name],
    );
  }

  async function confirm() {
    setBusy(true);
    setConfirmError(null);
    try {
      await postConfirm({
        data: { id: record.id, concepts: kept, projects: record.projects },
      });
      await router.invalidate();
    } catch (err) {
      setConfirmError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
          {event.created}
          {event.interpretation === "pending" ? " · pending" : " · confirmed"}
        </p>
        <h1 className="font-display text-3xl tracking-tight">{event.id}</h1>
        {event.kinds.length > 0 ? (
          <p className="text-sm text-muted">{event.kinds.join(" · ")}</p>
        ) : null}
      </header>

      <section className="space-y-2">
        <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Body</p>
        <pre className="whitespace-pre-wrap rounded-[var(--radius-md)] border border-border bg-surface p-4 font-sans text-sm text-foreground">
          {event.body}
        </pre>
      </section>

      <section className="space-y-2">
        <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Notes</p>
        <p className="text-sm text-muted">{event.notes || "No notes."}</p>
      </section>

      <section className="space-y-3">
        <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Names</p>
        <div className="flex flex-wrap gap-2">
          {guessed.map((name) => {
            const on = kept.includes(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggle(name)}
                className={
                  on
                    ? "rounded-full border border-accent bg-accent-soft px-3 py-1 text-xs text-foreground"
                    : "rounded-full border border-border px-3 py-1 text-xs text-muted hover:text-foreground"
                }
              >
                {name}
              </button>
            );
          })}
        </div>
        {event.projects.length > 0 ? (
          <p className="text-sm text-muted">Projects: {event.projects.join(", ")}</p>
        ) : null}
        {confirmError ? <p className="text-sm text-danger">{confirmError}</p> : null}
        <Button size="sm" disabled={busy} onClick={() => void confirm()}>
          Confirm
        </Button>
      </section>

      <Link to="/app/timeline" className="text-sm text-muted hover:text-foreground">
        Back to timeline
      </Link>
    </div>
  );
}
