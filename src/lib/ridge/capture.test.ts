import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { openVault } from "./vault.ts";
import { captureEvent } from "./capture.ts";

describe("Task 3 — Capture Pipeline Invariants", () => {
  // Test 1: Basic capture persists event to events/ with pending status and empty concepts/projects
  it("captures event to events/YYYY/MM/*.md with pending status and empty metadata", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-"));
    try {
      await writeFile(join(dir, "ridge.yaml"), "format: 1\n");
      const vault = await openVault(dir);

      const now = new Date("2026-09-07T12:30:00.000Z");
      const event = await captureEvent(vault, {
        body: "  debugged Docker networking  ",
        kinds: ["debugged"],
        now,
        offset: "+03:30",
      });

      // Verify returned EventRecord
      assert.equal(event.body, "debugged Docker networking");
      assert.equal(event.created, "2026-09-07T12:30:00.000Z");
      assert.equal(event.created_offset, "+03:30");
      assert.equal(event.interpretation, "pending");
      assert.deepEqual(event.kinds, ["debugged"]);
      assert.deepEqual(event.concepts, []);
      assert.deepEqual(event.projects, []);
      assert.equal(event.notes, "");

      // Verify filesystem storage
      assert.ok(event.path.startsWith("events/2026/09/"));
      const fullPath = join(dir, event.path);
      assert.ok(existsSync(fullPath));

      const fileContent = await readFile(fullPath, "utf8");
      assert.ok(fileContent.includes("interpretation: pending"));
      assert.ok(fileContent.includes("debugged Docker networking"));
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  // Test 2: Reject empty or whitespace-only bodies
  it("rejects empty or whitespace-only body and throws an error", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-"));
    try {
      await writeFile(join(dir, "ridge.yaml"), "format: 1\n");
      const vault = await openVault(dir);

      await assert.rejects(
        captureEvent(vault, { body: "     \n\t  " }),
        /event body cannot be empty/
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  // Test 3: Multiple identical captures get unique IDs and unique path suffixes (-2)
  it("assigns unique IDs and resolves path collisions for identical captures", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-"));
    try {
      await writeFile(join(dir, "ridge.yaml"), "format: 1\n");
      const vault = await openVault(dir);

      const now = new Date("2026-09-07T12:30:00Z");
      const eventA = await captureEvent(vault, { body: "debugged Docker networking", now });
      const eventB = await captureEvent(vault, { body: "debugged Docker networking", now });

      assert.notEqual(eventA.id, eventB.id);
      assert.notEqual(eventA.path, eventB.path);
      assert.ok(eventB.path.endsWith("-2.md"));
      assert.ok(existsSync(join(dir, eventA.path)));
      assert.ok(existsSync(join(dir, eventB.path)));
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  // Test 4: Does not create semantic skill folders (e.g., docker/ must not exist)
  it("does not create semantic skill folders in vault root", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-"));
    try {
      await writeFile(join(dir, "ridge.yaml"), "format: 1\n");
      const vault = await openVault(dir);

      await captureEvent(vault, { body: "debugged Docker networking" });

      assert.equal(existsSync(join(dir, "docker")), false);
      assert.equal(existsSync(join(dir, "networking")), false);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

// Test 5: Invariant checks — ensures no interpretation, no extra files, and ridge.yaml untouched
  it("does not trigger interpretation or create extra files/side-effects besides the captured event", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-"));
    try {
      const initialConfig = "format: 1\ndestination: Senior Engineer\n";
      await writeFile(join(dir, "ridge.yaml"), initialConfig);
      const vault = await openVault(dir);

      const event = await captureEvent(vault, { body: "Side-effect verification event" });

      // 1. Verify ridge.yaml remains untouched
      const configAfter = await readFile(join(dir, "ridge.yaml"), "utf8");
      assert.equal(configAfter, initialConfig);

      // 2. Strict file tree inspection: verify ONLY ridge.yaml and events/ directory exist in root
      const rootEntries = await readdir(dir);
      assert.deepEqual(rootEntries.sort(), ["events", "ridge.yaml"].sort());

      // 3. Inspect events/ directory depth: ensure exactly 1 event file was written
      const { events } = await vault.readAllEvents();
      assert.equal(events.length, 1);
      assert.equal(events[0].id, event.id);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});