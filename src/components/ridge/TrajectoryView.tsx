import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { TrajectoryView as TrajectoryData } from "@/lib/ridge/views";
import { postAcceptNext } from "@/lib/ridge/server";

type TrajectoryViewProps = {
  data: TrajectoryData;
  onChanged: () => void;
};

export function TrajectoryView({ data, onChanged }: TrajectoryViewProps) {
  const [dismissed, setDismissed] = useState(false);
  const [busy, setBusy] = useState(false);
  const recent = [...data.past].slice(-8).reverse();
  const showProposal = Boolean(data.proposed_next_step) && !data.next_step && !dismissed;

  async function acceptNext() {
    setBusy(true);
    try {
      await postAcceptNext();
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10">
      <header className="space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">Ridge</p>
        <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
          Where am I going?
        </h1>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Past</p>
          <ul className="mt-3 space-y-2">
            {recent.length === 0 ? (
              <li className="text-sm text-muted">No evidence yet.</li>
            ) : (
              recent.map((event) => (
                <li key={event.id} className="text-sm text-foreground">
                  <span className="text-faint">
                    {event.created.slice(0, 10)}
                    {event.interpretation === "pending" ? " · pending" : ""}
                  </span>
                  <div className="line-clamp-2">{event.body.split("\n")[0]}</div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-[var(--radius-md)] border border-accent bg-accent-soft p-4">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">You</p>
          <p className="mt-3 font-display text-xl text-foreground">{data.position.text}</p>
        </div>

        <div className="rounded-[var(--radius-md)] border border-border bg-surface p-4">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Future</p>
          <p className="mt-3 font-display text-xl text-foreground">
            {data.destination || "No destination declared."}
          </p>
          {data.milestone ? (
            <p className="mt-2 text-sm text-muted">{data.milestone}</p>
          ) : null}
          {data.next_step ? (
            <p className="mt-3 text-sm text-foreground">Next: {data.next_step}</p>
          ) : showProposal ? (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-muted">Proposed: {data.proposed_next_step}</p>
              <div className="flex gap-2">
                <Button size="sm" disabled={busy} onClick={() => void acceptNext()}>
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busy}
                  onClick={() => setDismissed(true)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">No next step confirmed.</p>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-[11px] tracking-[0.16em] text-faint uppercase">What changed</p>
        <p className="text-base text-foreground">{data.what_changed.interpretation}</p>
        {data.what_changed.by_kind.length > 0 ? (
          <p className="font-mono text-xs text-muted">
            {data.what_changed.by_kind
              .map((row) => `${row.kind} ${row.count}`)
              .join(" · ")}
          </p>
        ) : null}
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Knowledge</p>
          {data.knowledge.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No confirmed names yet.</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {data.knowledge.map((item) => (
                <li key={item.name}>
                  <Link
                    to={"/app/evidence/$name" as never}
                    params={{ name: item.name } as never}
                    className="text-sm text-foreground hover:text-accent"
                  >
                    {item.name}
                    <span className="ms-2 text-faint">{item.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Projects</p>
          {data.projects.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No confirmed projects yet.</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {data.projects.map((item) => (
                <li key={item.name}>
                  <Link
                    to={"/app/evidence/$name" as never}
                    params={{ name: item.name } as never}
                    className="text-sm text-foreground hover:text-accent"
                  >
                    {item.name}
                    <span className="ms-2 text-faint">{item.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <p className="border-t border-border pt-6 text-sm text-muted">
        Don't collect knowledge. Build evidence.
      </p>
    </div>
  );
}
