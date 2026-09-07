import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { openVault } from "./vault.ts";
import { captureEvent } from "./capture.ts";
import {
  defaultPropose,
  proposeMeaning,
  confirmMeaning,
  renameName,
} from "./interpret.ts";

describe("Task 4: Interpret & Confirm", () => {
  test("defaultPropose extracts valid tokens as concepts and drops stopwords", () => {
    const proposals = defaultPropose("debugged Docker networking with an app");
    const names = proposals.map((p) => p.name);
    assert.deepEqual(names, ["debugged", "docker", "networking", "app"]);
    assert.ok(proposals.every((p) => p.facet === "concept"));
  });

  test("proposeMeaning returns [] when propose function throws or rejects", async () => {
    const throwingPropose = () => {
      throw new Error("Provider unavailable");
    };
    const proposals = await proposeMeaning("debugged Docker", throwingPropose);
    assert.deepEqual(proposals, []);
  });

  test("confirmMeaning updates frontmatter to confirmed and sets names without changing body", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-interpret-"));
    try {
      await writeFile(join(dir, "ridge.yaml"), "format: 1\n");
      const vault = await openVault(dir);
      const event = await captureEvent(vault, {
        body: "debugged Docker networking",
      });

      assert.equal(event.interpretation, "pending");
      assert.deepEqual(event.concepts, []);

      const confirmed = await confirmMeaning(vault, event.id, {
        concepts: ["docker", "networking"],
        projects: [],
      });

      assert.equal(confirmed.id, event.id);
      assert.equal(confirmed.interpretation, "confirmed");
      assert.deepEqual(confirmed.concepts, ["docker", "networking"]);
      assert.deepEqual(confirmed.projects, []);
      assert.equal(confirmed.body, "debugged Docker networking");

      // Verify on disk via vault re-read
      const { events } = await vault.readAllEvents();
      const readEvent = events.find((e) => e.id === event.id);
      assert.ok(readEvent);
      assert.equal(readEvent.interpretation, "confirmed");
      assert.deepEqual(readEvent.concepts, ["docker", "networking"]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("pending event with no confirm stays pending with empty concepts (capture-only)", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-pending-"));
    try {
      await writeFile(join(dir, "ridge.yaml"), "format: 1\n");
      const vault = await openVault(dir);
      const event = await captureEvent(vault, {
        body: "learned WebAssembly basics",
      });

      const { events } = await vault.readAllEvents();
      assert.equal(events[0].interpretation, "pending");
      assert.deepEqual(events[0].concepts, []);
      assert.deepEqual(events[0].projects, []);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("renameName updates matching concept/project frontmatter across events and returns updated count", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-rename-"));
    try {
      await writeFile(join(dir, "ridge.yaml"), "format: 1\n");
      const vault = await openVault(dir);
      const e1 = await captureEvent(vault, { body: "event 1" });
      const e2 = await captureEvent(vault, { body: "event 2" });

      await confirmMeaning(vault, e1.id, {
        concepts: ["docker", "linux"],
        projects: [],
      });
      await confirmMeaning(vault, e2.id, {
        concepts: ["docker"],
        projects: [],
      });

      const updatedCount = await renameName(
        vault,
        "concept",
        "docker",
        "Docker"
      );
      assert.equal(updatedCount, 2);

      const { events } = await vault.readAllEvents();
      const readE1 = events.find((e) => e.id === e1.id);
      const readE2 = events.find((e) => e.id === e2.id);

      assert.deepEqual(readE1?.concepts, ["Docker", "linux"]);
      assert.deepEqual(readE2?.concepts, ["Docker"]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});