import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatEventMarkdown, parseEventMarkdown } from "./serialize.ts";
import type { EventRecord } from "./types.ts";

const sample: EventRecord = {
  id: "evt_01JEXAMPLE0000000000000000",
  created: "2026-09-05T18:42:00Z",
  created_offset: "+03:30",
  interpretation: "pending",
  kinds: ["debugged"],
  concepts: [],
  projects: [],
  notes: "",
  body: "## Notes\n\nThis heading is body text.\n",
  path: "events/2026/09/2026-09-05-notes.md",
};

describe("serialize", () => {
  it("round-trips body byte-for-byte including ## Notes", () => {
    const md = formatEventMarkdown(sample);
    const parsed = parseEventMarkdown(md, sample.path);
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.event.body, sample.body);
    assert.equal(parsed.event.notes, "");
    assert.equal(parsed.event.interpretation, "pending");
    assert.equal(parsed.event.created, "2026-09-05T18:42:00Z");
    assert.equal(parsed.event.created_offset, "+03:30");
  });

  it("keeps notes in frontmatter off the body", () => {
    const md = formatEventMarkdown({ ...sample, notes: "later thought" });
    const parsed = parseEventMarkdown(md, sample.path);
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.event.body, sample.body);
    assert.equal(parsed.event.notes, "later thought");
  });

  it("rejects missing id as corrupt", () => {
    const parsed = parseEventMarkdown("---\ncreated: 2026-09-05T18:42:00Z\n---\nbody\n", "x.md");
    assert.equal(parsed.ok, false);
  });
});