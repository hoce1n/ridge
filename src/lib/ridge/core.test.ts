import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createCore } from "./core.ts";
import type { ProposeFn } from "./interpret.ts";

async function withCore<T>(
  fn: (root: string, core: Awaited<ReturnType<typeof createCore>>) => Promise<T>,
): Promise<T> {
  const dir = await mkdtemp(join(tmpdir(), "ridge-core-"));
  try {
    await writeFile(
      join(dir, "ridge.yaml"),
      "format: 1\ndestination: \"\"\nnext_step: \"\"\nmilestone: \"\"\n",
    );
    const core = await createCore(dir);
    return await fn(dir, core);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe("Task 7 — core facade", () => {
  it("capture still saves when propose throws", async () => {
    await withCore(async (_root, core) => {
      const throwing: ProposeFn = () => {
        throw new Error("unavailable");
      };
      const { event, proposals } = await core.capture(
        { body: "debugged Docker networking" },
        throwing,
      );
      assert.equal(event.body, "debugged Docker networking");
      assert.equal(event.interpretation, "pending");
      assert.deepEqual(proposals, []);
    });
  });

  it("trajectory destination stays empty until setDestination", async () => {
    await withCore(async (root, core) => {
      const before = await core.trajectory();
      assert.equal(before.destination, "");
      const yamlBefore = await readFile(join(root, "ridge.yaml"), "utf8");
      await core.setDestination("Software Engineer");
      const after = await core.trajectory();
      assert.equal(after.destination, "Software Engineer");
      const yamlAfter = await readFile(join(root, "ridge.yaml"), "utf8");
      assert.notEqual(yamlAfter, yamlBefore);
    });
  });

  it("acceptProposedNextStep with empty destination leaves yaml unchanged", async () => {
    await withCore(async (root, core) => {
      const before = await readFile(join(root, "ridge.yaml"));
      const config = await core.acceptProposedNextStep();
      assert.equal(config.next_step, "");
      const after = await readFile(join(root, "ridge.yaml"));
      assert.deepEqual(after, before);
    });
  });

  it("saveReflection creates a narrative file that is not evidence", async () => {
    await withCore(async (root, core) => {
      await core.capture({ body: "built bunmark" });
      const path = await core.saveReflection("2026-q3.md", "# Q3\n");
      assert.equal(path, "reflections/2026-q3.md");
      assert.equal(existsSync(join(root, path)), true);
      const timeline = await core.timeline();
      assert.equal(timeline.events.length, 1);
      assert.ok(!timeline.events.some((e) => e.body.includes("# Q3")));
    });
  });

  it("stack is empty until names are confirmed", async () => {
    await withCore(async (_root, core) => {
      const { event } = await core.capture({ body: "debugged Docker networking" });
      const empty = await core.stack("docker");
      assert.equal(empty.groups.flatMap((g) => g.events).length, 0);
      await core.confirm(event.id, { concepts: ["docker"], projects: [] });
      const stacked = await core.stack("docker");
      const ids = stacked.groups.flatMap((g) => g.events.map((e) => e.id));
      assert.deepEqual(ids, [event.id]);
    });
  });

  it("createCore throws when vault is missing", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-core-missing-"));
    try {
      await assert.rejects(createCore(dir), /Vault not found/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
