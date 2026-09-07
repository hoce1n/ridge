import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, rm, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { openVault } from "./vault.ts";
import { captureEvent } from "./capture.ts";
import {
  buildIndex,
  loadIndex,
  readIndexCache,
  writeIndexCache,
} from "./event-index.ts";

async function withVault<T>(
  fn: (root: string, vault: Awaited<ReturnType<typeof openVault>>) => Promise<T>,
): Promise<T> {
  const dir = await mkdtemp(join(tmpdir(), "ridge-index-"));
  try {
    await writeFile(
      join(dir, "ridge.yaml"),
      "format: 1\ndestination: \"\"\nnext_step: \"\"\nmilestone: \"\"\n",
    );
    const vault = await openVault(dir);
    return await fn(dir, vault);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe("Task 5 — deterministic event index", () => {
  it("buildIndex twice yields the same events and warnings", async () => {
    await withVault(async (_root, vault) => {
      await captureEvent(vault, {
        body: "built bun http server",
        now: new Date("2026-09-05T10:00:00.000Z"),
      });
      const a = await buildIndex(vault);
      const b = await buildIndex(vault);
      assert.deepEqual(a.events, b.events);
      assert.deepEqual(a.warnings, b.warnings);
    });
  });

  it("corrupt file appears in warnings not events and stays on disk", async () => {
    await withVault(async (root, vault) => {
      const dir = join(root, "events", "2026", "09");
      await mkdir(dir, { recursive: true });
      const badPath = join(dir, "2026-09-05-corrupt.md");
      await writeFile(badPath, "not an event\n");
      const index = await buildIndex(vault);
      assert.equal(index.events.length, 0);
      assert.ok(index.warnings.some((w) => w.path.includes("2026-09-05-corrupt.md")));
      assert.equal(existsSync(badPath), true);
    });
  });

  it("loadIndex includes a captured event", async () => {
    await withVault(async (_root, vault) => {
      const event = await captureEvent(vault, {
        body: "debugged Docker networking",
        now: new Date("2026-09-07T12:00:00.000Z"),
      });
      const index = await loadIndex(vault);
      assert.ok(index.events.some((e) => e.id === event.id));
    });
  });

  it("buildIndex and loadIndex do not change ridge.yaml bytes", async () => {
    await withVault(async (root, vault) => {
      const before = await readFile(join(root, "ridge.yaml"));
      await captureEvent(vault, { body: "learned linux" });
      await buildIndex(vault);
      await loadIndex(vault);
      const after = await readFile(join(root, "ridge.yaml"));
      assert.deepEqual(after, before);
    });
  });

  it("rebuilds when an event file is newer than the cache", async () => {
    await withVault(async (root, vault) => {
      const first = await captureEvent(vault, {
        body: "first event",
        now: new Date("2026-09-01T00:00:00.000Z"),
      });
      const index = await buildIndex(vault);
      await writeIndexCache(root, index);

      const second = await captureEvent(vault, {
        body: "second event",
        now: new Date("2026-09-02T00:00:00.000Z"),
      });
      const future = new Date(Date.now() + 60_000);
      await utimes(join(root, second.path), future, future);

      const loaded = await loadIndex(vault);
      assert.ok(loaded.events.some((e) => e.id === first.id));
      assert.ok(loaded.events.some((e) => e.id === second.id));
    });
  });

  it("reflection files are not in events", async () => {
    await withVault(async (root, vault) => {
      await captureEvent(vault, { body: "shipped bunmark" });
      await mkdir(join(root, "reflections"), { recursive: true });
      await writeFile(join(root, "reflections", "2026-q3.md"), "# Q3\nnot evidence\n");
      const index = await buildIndex(vault);
      assert.equal(index.events.length, 1);
      assert.ok(!index.events.some((e) => e.body.includes("not evidence")));
    });
  });

  it("readIndexCache returns null when missing", async () => {
    await withVault(async (root) => {
      assert.equal(await readIndexCache(root), null);
    });
  });
});
