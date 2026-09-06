import { existsSync } from "node:fs";
import { mkdir, readFile, rename, unlink, writeFile, readdir } from "node:fs/promises";
import { basename, dirname, join, relative } from "node:path";
import parseYaml from "yaml";

import type { EventRecord, ParseEventResult, RidgeYaml, VaultWarning } from "./types.ts";
import { formatEventMarkdown, parseEventMarkdown } from "./serialize.ts";

export class Vault {
  public readonly root: string;

  constructor(root: string) {
    this.root = root;
  }

  // Internal helper for writing files, making it easy and clean to mock in tests
  async writeTextFile(filePath: string, contents: string, options: { encoding: string; flag: string }): Promise<void> {
    await writeFile(filePath, contents, options);
  }

  static async open(root: string): Promise<Vault> {
    const configPath = join(root, "ridge.yaml");
    if (!existsSync(configPath)) {
      throw new Error(`Vault not found at ${root}: missing ridge.yaml`);
    }
    return new Vault(root);
  }

  async readConfig(): Promise<RidgeYaml> {
    const configPath = join(this.root, "ridge.yaml");
    const content = await readFile(configPath, "utf8");
    const parsed = parseYaml.parse(content) || {};
    return {
      format: 1,
      destination: parsed.destination || "",
      next_step: parsed.next_step || "",
      milestone: parsed.milestone || "",
    };
  }

  async writeConfig(next: RidgeYaml): Promise<void> {
    const configPath = join(this.root, "ridge.yaml");
    const yamlStr = parseYaml.stringify(next);
    await writeFile(configPath, yamlStr, "utf8");
  }

  async uniqueEventPath(createdIso: string, slug: string): Promise<string> {
    const date = new Date(createdIso);
    const yyyy = date.getUTCFullYear().toString();
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");

    const baseRel = join("events", yyyy, mm, `${yyyy}-${mm}-${dd}-${slug}.md`);
    let candidateRel = baseRel;
    let counter = 2;

    while (existsSync(join(this.root, candidateRel))) {
      candidateRel = join("events", yyyy, mm, `${yyyy}-${mm}-${dd}-${slug}-${counter}.md`);
      counter++;
    }

    return candidateRel;
  }

  async createEventFile(event: EventRecord, destRelPath: string): Promise<EventRecord> {
    const destAbs = join(this.root, destRelPath);
    const contents = formatEventMarkdown(event);

    if (existsSync(destAbs)) {
      throw new Error(`refusing to overwrite ${destAbs}`);
    }

    const dir = dirname(destAbs);
    await mkdir(dir, { recursive: true });
    const tmp = join(dir, `.${basename(destAbs)}.${process.pid}.${Date.now()}.tmp`);

    try {
      await this.writeTextFile(tmp, contents, { encoding: "utf8", flag: "wx" });
      if (existsSync(destAbs)) {
        throw new Error(`refusing to overwrite ${destAbs}`);
      }
      await rename(tmp, destAbs);
    } catch (err) {
      await unlink(tmp).catch(() => {});
      throw err;
    }

    return { ...event, path: destRelPath };
  }

  async readAllEvents(): Promise<{ events: EventRecord[]; warnings: VaultWarning[] }> {
    const eventsDir = join(this.root, "events");
    const events: EventRecord[] = [];
    const warnings: VaultWarning[] = [];

    if (!existsSync(eventsDir)) {
      return { events, warnings };
    }

    const walk = async (dir: string) => {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          const relPath = relative(this.root, fullPath);
          try {
            const content = await readFile(fullPath, "utf8");
            const res: ParseEventResult = parseEventMarkdown(content, relPath);
            if (res.ok) {
              events.push(res.event);
            } else {
              warnings.push(res.warning);
            }
          } catch (err) {
            warnings.push({
              path: relPath,
              message: `Read error: ${err instanceof Error ? err.message : String(err)}`,
            });
          }
        }
      }
    };

    await walk(eventsDir);
    return { events, warnings };
  }

  async updateEventFrontmatter(
    id: string,
    patch: Partial<Pick<EventRecord, "interpretation" | "kinds" | "concepts" | "projects" | "notes">>
  ): Promise<EventRecord> {
    const { events } = await this.readAllEvents();
    const target = events.find((e) => e.id === id);
    if (!target) {
      throw new Error(`Event with id ${id} not found`);
    }

    const updated: EventRecord = {
      ...target,
      ...patch,
      body: target.body,
      created: target.created,
      id: target.id,
    };

    const absPath = join(this.root, target.path);
    const contents = formatEventMarkdown(updated);
    await writeFile(absPath, contents, "utf8");
    return updated;
  }
}

export async function openVault(root: string): Promise<Vault> {
  return Vault.open(root);
}