import type { Kind } from "./kinds.ts";

export type Interpretation = "pending" | "confirmed";

export type EventRecord = {
    id: string;
    created: string;
    created_offset: string;
    interpretation: Interpretation;
    kinds: Kind[];
    concepts: string[];
    projects: string[];
    notes: string;
    body: string;
    path: string;
};

export type RidgeYaml = {
    format: 1;
    destination: string;
    next_step: string;
    milestone: string;
};

export type Proposal = {
    name: string;
    facet: "concept" | "project";
};

export type VaultWarning = {
    path: string;
    message: string;
};

export type ParseEventResult =
  | { ok: true; event: EventRecord }
  | { ok: false; warning: VaultWarning };