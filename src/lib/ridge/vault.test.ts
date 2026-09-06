import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { openVault } from "./vault.ts";
import { createdStamp } from "./time.ts";
import { newEventId } from "./ulid.ts";
import type { EventRecord } from "./types.ts";

describe("Vault", () => {
  // Case 1: openVault on empty dir throws (does not write ridge.yaml)
  it("openVault throws on empty dir", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-"));
    try {
      await assert.rejects(openVault(dir), /Vault not found/);
      assert.equal(existsSync(join(dir, "ridge.yaml")), false);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  // Case 2: createEventFile writes readable file; duplicate path throws
  it("atomic create and non-overwrite", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-"));
    try {
      await writeFile(join(dir, "ridge.yaml"), "format: 1\n");
      const vault = await openVault(dir);

      const stamp = createdStamp();
      const event: EventRecord = {
        id: newEventId(),
        created: stamp.created,
        created_offset: stamp.created_offset,
        interpretation: "pending",
        kinds: ["built"],
        concepts: [],
        projects: [],
        notes: "",
        body: "Build test",
        path: "",
      };

      const relPath = await vault.uniqueEventPath(event.created, "build-test");
      await vault.createEventFile(event, relPath);

      await assert.rejects(vault.createEventFile(event, relPath), /refusing to overwrite/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  // Case 3: uniqueEventPath suffix collision (-2)
  it("uniqueEventPath resolves collisions", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-"));
    try {
      await writeFile(join(dir, "ridge.yaml"), "format: 1\n");
      const vault = await openVault(dir);

      const stamp = createdStamp(new Date("2026-09-05T10:00:00Z"));
      const p1 = await vault.uniqueEventPath(stamp.created, "bun");
      await vault.createEventFile(
        {
          id: newEventId(),
          created: stamp.created,
          created_offset: "+00:00",
          interpretation: "pending",
          kinds: [],
          concepts: [],
          projects: [],
          notes: "",
          body: "bun 1",
          path: p1,
        },
        p1
      );

      const p2 = await vault.uniqueEventPath(stamp.created, "bun");
      assert.ok(p2.endsWith("2026-09-05-bun-2.md"));
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  // Case 4: Simulated failed create using mock.method — ensures no .tmp files remain and dest is unchanged
  it("failed create leaves no .tmp files and leaves existing files intact when write fails", async (t) => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-"));
    try {
      await writeFile(join(dir, "ridge.yaml"), "format: 1\n");
      const vault = await openVault(dir);

      const stamp = createdStamp();
      const event: EventRecord = {
        id: newEventId(),
        created: stamp.created,
        created_offset: stamp.created_offset,
        interpretation: "pending",
        kinds: [],
        concepts: [],
        projects: [],
        notes: "",
        body: "Simulated write failure test",
        path: "",
      };

      const relPath = await vault.uniqueEventPath(event.created, "mock-fail-test");
      const destAbs = join(dir, relPath);
      const targetDir = dirname(destAbs);

      // Prepare target directory and create pre-existing file
      await mkdir(targetDir, { recursive: true });
      const existingFile = join(targetDir, "existing.md");
      await writeFile(existingFile, "Pre-existing Data");

      // Mock writeTextFile on the vault instance to simulate an I/O write error
      t.mock.method(vault, "writeTextFile", async () => {
        throw new Error("Simulated Disk Write Error");
      });

      // Attempt creation; expected to fail with the mocked error
      await assert.rejects(
        vault.createEventFile(event, relPath),
        /Simulated Disk Write Error/
      );

      // Verify no temporary files were left behind
      const files = await readdir(targetDir);
      const tmpFiles = files.filter((f) => f.endsWith(".tmp"));
      assert.equal(tmpFiles.length, 0);

      // Verify pre-existing file remains untouched
      const content = await readFile(existingFile, "utf8");
      assert.equal(content, "Pre-existing Data");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
  // Case 5: readAllEvents skips corrupt file with warning
  it("readAllEvents skips corrupt file with warning", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-"));
    try {
      await writeFile(join(dir, "ridge.yaml"), "format: 1\n");
      const vault = await openVault(dir);

      const corruptRel = "events/2026/09/corrupt.md";
      await vault.createEventFile(
        {
          id: "",
          created: "2026-09-05T10:00:00Z",
          created_offset: "+00:00",
          interpretation: "pending",
          kinds: [],
          concepts: [],
          projects: [],
          notes: "",
          body: "Corrupt",
          path: corruptRel,
        },
        corruptRel
      );

      const { events, warnings } = await vault.readAllEvents();
      assert.equal(events.length, 0);
      assert.equal(warnings.length, 1);
      assert.equal(warnings[0].path, corruptRel);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  // Case 6: updateEventFrontmatter changes metadata without altering body or created date
  it("updateEventFrontmatter updates metadata without changing body or created", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-"));
    try {
      await writeFile(join(dir, "ridge.yaml"), "format: 1\n");
      const vault = await openVault(dir);

      const stamp = createdStamp(new Date("2026-09-05T12:00:00Z"));
      const initial: EventRecord = {
        id: newEventId(),
        created: stamp.created,
        created_offset: "+00:00",
        interpretation: "pending",
        kinds: ["debugged"],
        concepts: [],
        projects: [],
        notes: "",
        body: "Immutable Body Text",
        path: "",
      };

      const relPath = await vault.uniqueEventPath(initial.created, "update-test");
      await vault.createEventFile(initial, relPath);

      const updated = await vault.updateEventFrontmatter(initial.id, {
        concepts: ["docker", "networking"],
        interpretation: "confirmed",
      });

      assert.deepEqual(updated.concepts, ["docker", "networking"]);
      assert.equal(updated.interpretation, "confirmed");
      assert.equal(updated.body, "Immutable Body Text");
      assert.equal(updated.created, stamp.created);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  // Case 7: writeConfig updates configuration state correctly
  it("writeConfig is the only way to update destination and config state", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-test-"));
    try {
      await writeFile(join(dir, "ridge.yaml"), "format: 1\n");
      const vault = await openVault(dir);

      const initialConfig = await vault.readConfig();
      assert.equal(initialConfig.destination, "");

      await vault.writeConfig({
        format: 1,
        destination: "Principal Runtime Engineer",
        next_step: "Master Bun HTTP Core",
        milestone: "Ship Ridge v1",
      });

      const updatedConfig = await vault.readConfig();
      assert.equal(updatedConfig.destination, "Principal Runtime Engineer");
      assert.equal(updatedConfig.next_step, "Master Bun HTTP Core");
      assert.equal(updatedConfig.milestone, "Ship Ridge v1");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});