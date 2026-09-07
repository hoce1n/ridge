import { KINDS, type Kind } from "./kinds.ts";
import type { EventIndex } from "./event-index.ts";
import type { EventRecord, RidgeYaml, VaultWarning } from "./types.ts";

export type TimelineView = {
  events: EventRecord[];
  warnings: VaultWarning[];
};

export type EvidenceStackView = {
  name: string;
  groups: { kind: Kind | "untyped"; events: EventRecord[] }[];
};

export type WhatChangedView = {
  window_days: number;
  interpretation: string;
  by_kind: { kind: Kind; count: number; event_ids: string[] }[];
  event_ids: string[];
};

export type TrajectoryView = {
  past: EventRecord[];
  position: { text: string; event_ids: string[] };
  destination: string;
  next_step: string;
  proposed_next_step: string | null;
  milestone: string;
  knowledge: { name: string; count: number }[];
  projects: { name: string; count: number }[];
  what_changed: WhatChangedView;
};

function confirmedEvents(index: EventIndex): EventRecord[] {
  return index.events.filter((e) => e.interpretation === "confirmed");
}

function countNames(events: EventRecord[], facet: "concepts" | "projects"): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const event of events) {
    for (const name of event[facet]) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function timelineView(index: EventIndex): TimelineView {
  return {
    events: [...index.events],
    warnings: [...index.warnings],
  };
}

export function evidenceStackView(index: EventIndex, name: string): EvidenceStackView {
  const linked = confirmedEvents(index).filter(
    (e) => e.concepts.includes(name) || e.projects.includes(name),
  );
  const groups: EvidenceStackView["groups"] = [];
  for (const kind of KINDS) {
    const events = linked.filter((e) => e.kinds.includes(kind));
    if (events.length > 0) {
      groups.push({ kind, events });
    }
  }
  const untyped = linked.filter((e) => e.kinds.length === 0);
  if (untyped.length > 0) {
    groups.push({ kind: "untyped", events: untyped });
  }
  return { name, groups };
}

export function whatChangedView(
  index: EventIndex,
  now: Date,
  windowDays = 90,
): WhatChangedView {
  const windowMs = windowDays * 24 * 60 * 60 * 1000;
  const start = now.getTime() - windowMs;
  const inWindow = index.events.filter((e) => {
    const t = Date.parse(e.created);
    return Number.isFinite(t) && t >= start && t <= now.getTime();
  });
  const event_ids = inWindow.map((e) => e.id);
  const by_kind: WhatChangedView["by_kind"] = [];
  for (const kind of KINDS) {
    const ids = inWindow.filter((e) => e.kinds.includes(kind)).map((e) => e.id);
    if (ids.length > 0) {
      by_kind.push({ kind, count: ids.length, event_ids: ids });
    }
  }
  let interpretation = "No evidence in this window.";
  if (by_kind.length > 0) {
    interpretation = by_kind
      .map((row, i) => {
        const label = i === 0 ? capitalize(row.kind) : row.kind;
        return `${label} ${row.count}`;
      })
      .join(", ") + ".";
  }
  return { window_days: windowDays, interpretation, by_kind, event_ids };
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function proposeNextStep(index: EventIndex, config: RidgeYaml): string | null {
  if (!config.destination) return null;
  const confirmed = confirmedEvents(index);
  const names = countNames(confirmed, "concepts");
  for (const { name } of names) {
    const shipped = confirmed.some(
      (e) => e.concepts.includes(name) && e.kinds.includes("shipped"),
    );
    if (!shipped) return name;
  }
  return null;
}

function positionText(confirmed: EventRecord[]): { text: string; event_ids: string[] } {
  const event_ids = confirmed.map((e) => e.id);
  const names = countNames(confirmed, "concepts");
  if (confirmed.length < 5) {
    if (names.length > 0) {
      return {
        text: `Currently exploring ${names[0].name}.`,
        event_ids,
      };
    }
    return {
      text: "Not enough evidence to name a position.",
      event_ids,
    };
  }
  if (names.length > 0) {
    return {
      text: `Currently exploring ${names[0].name}.`,
      event_ids,
    };
  }
  return {
    text: "Not enough evidence to name a position.",
    event_ids,
  };
}

export function trajectoryView(
  index: EventIndex,
  config: RidgeYaml,
  now: Date,
): TrajectoryView {
  const confirmed = confirmedEvents(index);
  return {
    past: [...index.events],
    position: positionText(confirmed),
    destination: config.destination,
    next_step: config.next_step,
    proposed_next_step: proposeNextStep(index, config),
    milestone: config.milestone,
    knowledge: countNames(confirmed, "concepts"),
    projects: countNames(confirmed, "projects"),
    what_changed: whatChangedView(index, now),
  };
}
