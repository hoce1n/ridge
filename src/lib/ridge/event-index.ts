import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { EventRecord, VaultWarning } from "./types.ts";
import type { Vault } from "./vault.ts";

export type EventIndex = {
  vault_mtime_ms: number;
  events: EventRecord[];
  warnings: VaultWarning[];
};

function sortEvents(events: EventRecord[]): EventRecord[] {
  return [...events].sort((a, b) => {
    if (a.created < b.created) return -1;
    if (a.created > b.created) return 1;
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });
}

async function walkMarkdownMtimes(dir: string, times: number[]): Promise<void> {
  if (!existsSync(dir)) return;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkMarkdownMtimes(fullPath, times);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const info = await stat(fullPath);
      times.push(info.mtimeMs);
    }
  }
}

export async function vaultMtimeMs(vault: Vault): Promise<number> {
  const times: number[] = [];
  const configPath = join(vault.root, "ridge.yaml");
  if (existsSync(configPath)) {
    times.push((await stat(configPath)).mtimeMs);
  }
  await walkMarkdownMtimes(join(vault.root, "events"), times);
  return times.length === 0 ? 0 : Math.max(...times);
}

export async function buildIndex(vault: Vault): Promise<EventIndex> {
  const { events, warnings } = await vault.readAllEvents();
  return {
    vault_mtime_ms: await vaultMtimeMs(vault),
    events: sortEvents(events),
    warnings: [...warnings].sort((a, b) => a.path.localeCompare(b.path)),
  };
}

function cachePath(vaultRoot: string): string {
  return join(vaultRoot, ".ridge", "index.json");
}

export async function writeIndexCache(
  vaultRoot: string,
  index: EventIndex,
): Promise<void> {
  const dir = join(vaultRoot, ".ridge");
  await mkdir(dir, { recursive: true });
  await writeFile(cachePath(vaultRoot), JSON.stringify(index), "utf8");
}

export async function readIndexCache(
  vaultRoot: string,
): Promise<EventIndex | null> {
  const path = cachePath(vaultRoot);
  if (!existsSync(path)) return null;
  try {
    const raw = await readFile(path, "utf8");
    const parsed = JSON.parse(raw) as EventIndex;
    if (!parsed || !Array.isArray(parsed.events) || !Array.isArray(parsed.warnings)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function loadIndex(vault: Vault): Promise<EventIndex> {
  const mtime = await vaultMtimeMs(vault);
  const cached = await readIndexCache(vault.root);
  if (cached && cached.vault_mtime_ms >= mtime) {
    return cached;
  }
  const built = await buildIndex(vault);
  await writeIndexCache(vault.root, built);
  return built;
}
