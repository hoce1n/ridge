import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";

import { vaultRoot } from "./paths.ts";

describe("Task 9 — vaultRoot", () => {
  it("uses RIDGE_VAULT when set", () => {
    assert.equal(vaultRoot({ RIDGE_VAULT: "/tmp/my-vault" }, "/workspace"), "/tmp/my-vault");
  });

  it("defaults to data/vault under cwd", () => {
    assert.equal(vaultRoot({}, "/workspace"), join("/workspace", "data/vault"));
  });
});
