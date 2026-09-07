import { mkdir, rename, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";

import { captureEvent, type CaptureInput } from "./capture.ts";
import { loadIndex } from "./event-index.ts";
import {
  confirmMeaning,
  proposeMeaning,
  renameName,
  type ProposeFn,
} from "./interpret.ts";
import type { EventRecord, Proposal, RidgeYaml } from "./types.ts";
import { openVault, type Vault } from "./vault.ts";
import {
  evidenceStackView,
  proposeNextStep,
  timelineView,
  trajectoryView,
  whatChangedView,
  type EvidenceStackView,
  type TimelineView,
  type TrajectoryView,
} from "./views.ts";

const REFLECTION_NAME = /^[0-9]{4}-[a-z0-9-]+\.md$/;

async function atomicWrite(destAbs: string, contents: string): Promise<void> {
  const dir = dirname(destAbs);
  await mkdir(dir, { recursive: true });
  const tmp = join(dir, `.${basename(destAbs)}.${process.pid}.${Date.now()}.tmp`);
  try {
    await writeFile(tmp, contents, { encoding: "utf8", flag: "wx" });
    await rename(tmp, destAbs);
  } catch (err) {
    await unlink(tmp).catch(() => {});
    throw err;
  }
}

export type Core = {
  capture: (
    input: CaptureInput,
    propose?: ProposeFn,
  ) => Promise<{ event: EventRecord; proposals: Proposal[] }>;
  confirm: (
    id: string,
    accepted: { concepts: string[]; projects: string[] },
  ) => Promise<EventRecord>;
  rename: (
    facet: "concept" | "project",
    from: string,
    to: string,
  ) => Promise<number>;
  timeline: () => Promise<TimelineView>;
  stack: (name: string) => Promise<EvidenceStackView>;
  trajectory: (now?: Date) => Promise<TrajectoryView>;
  setDestination: (text: string) => Promise<RidgeYaml>;
  setNextStep: (text: string) => Promise<RidgeYaml>;
  setMilestone: (text: string) => Promise<RidgeYaml>;
  acceptProposedNextStep: () => Promise<RidgeYaml>;
  draftReflection: (now?: Date) => Promise<string>;
  saveReflection: (filename: string, markdown: string) => Promise<string>;
  event: (id: string) => Promise<EventRecord>;
};

async function patchConfig(
  vault: Vault,
  patch: Partial<Pick<RidgeYaml, "destination" | "next_step" | "milestone">>,
): Promise<RidgeYaml> {
  const current = await vault.readConfig();
  const next: RidgeYaml = { ...current, ...patch, format: 1 };
  await vault.writeConfig(next);
  return next;
}

export async function createCore(vaultRoot: string): Promise<Core> {
  const vault = await openVault(vaultRoot);

  async function indexNow() {
    return loadIndex(vault);
  }

  return {
    async capture(input, propose) {
      const event = await captureEvent(vault, input);
      const proposals = await proposeMeaning(event.body, propose);
      return { event, proposals };
    },

    confirm(id, accepted) {
      return confirmMeaning(vault, id, accepted);
    },

    rename(facet, from, to) {
      return renameName(vault, facet, from, to);
    },

    async timeline() {
      return timelineView(await indexNow());
    },

    async stack(name) {
      return evidenceStackView(await indexNow(), name);
    },

    async trajectory(now = new Date()) {
      const index = await indexNow();
      const config = await vault.readConfig();
      return trajectoryView(index, config, now);
    },

    setDestination(text) {
      return patchConfig(vault, { destination: text });
    },

    setNextStep(text) {
      return patchConfig(vault, { next_step: text });
    },

    setMilestone(text) {
      return patchConfig(vault, { milestone: text });
    },

    async acceptProposedNextStep() {
      const index = await indexNow();
      const config = await vault.readConfig();
      const proposed = proposeNextStep(index, config);
      if (!proposed) return config;
      return patchConfig(vault, { next_step: proposed });
    },

    async draftReflection(now = new Date()) {
      const index = await indexNow();
      const changed = whatChangedView(index, now);
      const lines = [
        `# Reflection`,
        ``,
        changed.interpretation,
        ``,
        ...index.events.map((e) => `- ${e.created} ${e.id} ${e.body.split("\n")[0]}`),
        ``,
      ];
      return lines.join("\n");
    },

    async saveReflection(filename, markdown) {
      if (!REFLECTION_NAME.test(filename)) {
        throw new Error(`invalid reflection filename: ${filename}`);
      }
      const rel = join("reflections", filename);
      const dest = join(vault.root, rel);
      await atomicWrite(dest, markdown);
      return rel.replaceAll("\\", "/");
    },

    async event(id) {
      const { events } = await vault.readAllEvents();
      const found = events.find((e) => e.id === id);
      if (!found) throw new Error(`Event with id ${id} not found`);
      return found;
    },
  };
}
