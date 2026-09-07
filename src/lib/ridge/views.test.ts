import { describe, it } from "node:test";
import assert from "node:assert/strict";

import type { EventIndex } from "./event-index.ts";
import type { EventRecord, RidgeYaml } from "./types.ts";
import {
  evidenceStackView,
  proposeNextStep,
  timelineView,
  trajectoryView,
  whatChangedView,
} from "./views.ts";

function event(partial: Partial<EventRecord> & Pick<EventRecord, "id" | "body">): EventRecord {
  return {
    created: "2026-09-05T12:00:00.000Z",
    created_offset: "+00:00",
    interpretation: "pending",
    kinds: [],
    concepts: [],
    projects: [],
    notes: "",
    path: `events/${partial.id}.md`,
    ...partial,
  };
}

const pendingDocker = event({
  id: "evt_pending_docker",
  body: "trying docker",
  interpretation: "pending",
  concepts: [],
});

const confirmedDockerBuilt = event({
  id: "evt_docker_built",
  body: "built postgres in docker",
  created: "2026-09-06T12:00:00.000Z",
  interpretation: "confirmed",
  kinds: ["built"],
  concepts: ["docker"],
});

const confirmedNetworking = event({
  id: "evt_net_debugged",
  body: "debugged networking",
  created: "2026-09-07T12:00:00.000Z",
  interpretation: "confirmed",
  kinds: ["debugged"],
  concepts: ["networking"],
});

const emptyConfig: RidgeYaml = {
  format: 1,
  destination: "",
  next_step: "",
  milestone: "",
};

const index: EventIndex = {
  vault_mtime_ms: 1,
  events: [pendingDocker, confirmedDockerBuilt, confirmedNetworking],
  warnings: [{ path: "events/bad.md", message: "corrupt" }],
};

describe("Task 6 — views", () => {
  it("timeline includes pending and confirmed events plus warnings", () => {
    const view = timelineView(index);
    assert.equal(view.events.length, 3);
    assert.ok(view.events.some((e) => e.id === pendingDocker.id));
    assert.ok(view.events.some((e) => e.id === confirmedDockerBuilt.id));
    assert.deepEqual(view.warnings, index.warnings);
  });

  it("evidence stack includes only confirmed docker, not pending", () => {
    const stack = evidenceStackView(index, "docker");
    const ids = stack.groups.flatMap((g) => g.events.map((e) => e.id));
    assert.deepEqual(ids, [confirmedDockerBuilt.id]);
    assert.ok(!ids.includes(pendingDocker.id));
  });

  it("position with one confirmed event is conservative", () => {
    const thin: EventIndex = {
      vault_mtime_ms: 1,
      events: [confirmedDockerBuilt],
      warnings: [],
    };
    const traj = trajectoryView(thin, emptyConfig, new Date("2026-09-07T00:00:00.000Z"));
    assert.match(traj.position.text, /exploring|Not enough/i);
    assert.equal(/engineer/i.test(traj.position.text), false);
    assert.ok(traj.position.event_ids.includes(confirmedDockerBuilt.id));
  });

  it("empty destination yields null proposed next step", () => {
    const traj = trajectoryView(index, emptyConfig, new Date("2026-09-07T00:00:00.000Z"));
    assert.equal(traj.proposed_next_step, null);
    assert.equal(proposeNextStep(index, emptyConfig), null);
  });

  it("whatChanged mentions built and lists that event id", () => {
    const changed = whatChangedView(
      index,
      new Date("2026-09-07T12:00:00.000Z"),
      90,
    );
    assert.match(changed.interpretation, /built/i);
    assert.ok(changed.event_ids.includes(confirmedDockerBuilt.id));
    const built = changed.by_kind.find((k) => k.kind === "built");
    assert.ok(built);
    assert.ok(built.event_ids.includes(confirmedDockerBuilt.id));
  });

  it("views do not require a vault write", () => {
    timelineView(index);
    evidenceStackView(index, "docker");
    whatChangedView(index, new Date("2026-09-07T00:00:00.000Z"));
    trajectoryView(index, emptyConfig, new Date("2026-09-07T00:00:00.000Z"));
  });
});
