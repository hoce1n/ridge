import { createFileRoute, Link } from "@tanstack/react-router";

import { getStack } from "@/lib/ridge/server";
import type { EvidenceStackView } from "@/lib/ridge/views";

export const Route = createFileRoute("/app/evidence/$name")({
  loader: async ({ params }) => {
    try {
      const stack = await getStack({ data: { name: params.name } });
      return { stack, error: null as string | null };
    } catch (err) {
      return {
        stack: { name: params.name, groups: [] } as EvidenceStackView,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  },
  head: ({ params }) => ({
    meta: [{ title: `${params.name} · Evidence · Ridge` }],
  }),
  component: EvidencePage,
});

function EvidencePage() {
  const { stack, error } = Route.useLoaderData();
  const empty = stack.groups.every((group) => group.events.length === 0);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10">
      <header className="space-y-2">
        <p className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
          Evidence stack
        </p>
        <h1 className="font-display text-4xl tracking-tight">{stack.name}</h1>
      </header>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      {empty ? (
        <p className="text-sm text-muted">
          This name has no evidentiary weight without linked evidence.
        </p>
      ) : (
        <div className="space-y-8">
          {stack.groups.map((group) => (
            <section key={group.kind} className="space-y-3">
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{group.kind}</p>
              <ul className="space-y-2">
                {group.events.map((event) => (
                  <li key={event.id}>
                    <Link
                      to="/app/events/$id"
                      params={{ id: event.id }}
                      className="block rounded-[var(--radius-md)] border border-border bg-surface p-4 hover:border-accent"
                    >
                      <p className="font-mono text-[11px] text-faint">
                        {event.created.slice(0, 10)}
                      </p>
                      <p className="mt-1 text-sm text-foreground">{event.body.split("\n")[0]}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
