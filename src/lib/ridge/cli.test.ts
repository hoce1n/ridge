import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { runCli } from "./cli.ts";

async function collect(
  argv: string[],
  env: NodeJS.ProcessEnv,
): Promise<{ code: number; log: string; err: string }> {
  const logs: string[] = [];
  const errs: string[] = [];
  const code = await runCli(argv, env, {
    log: (s) => logs.push(s),
    err: (s) => errs.push(s),
  });
  return { code, log: logs.join("\n"), err: errs.join("\n") };
}

describe("Task 8 — CLI", () => {
  it("add then timeline prints the captured body", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-cli-"));
    try {
      await writeFile(
        join(dir, "ridge.yaml"),
        "format: 1\ndestination: \"\"\nnext_step: \"\"\nmilestone: \"\"\n",
      );
      const env = { RIDGE_VAULT: dir };
      const added = await collect(["add", "debugged Docker networking"], env);
      assert.equal(added.code, 0);
      const listed = await collect(["timeline"], env);
      assert.equal(listed.code, 0);
      assert.match(listed.log, /debugged Docker networking/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("missing vault exits 2", async () => {
    const dir = await mkdtemp(join(tmpdir(), "ridge-cli-missing-"));
    try {
      const result = await collect(["timeline", "--vault", dir], {});
      assert.equal(result.code, 2);
      assert.match(result.err, /Vault not found/);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it("unknown command exits 1", async () => {
    const result = await collect(["nope"], {});
    assert.equal(result.code, 1);
  });
});
