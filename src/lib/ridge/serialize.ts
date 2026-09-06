import parseYaml from "yaml";
import type { EventRecord, ParseEventResult } from "./types.ts";
import { isKind } from "./kinds.ts";

export function parseEventMarkdown(text: string, path: string): ParseEventResult {
  const normalized = text.trimStart();
  if (!normalized.startsWith("---")) {
    return {
      ok: false,
      warning: { path, message: "Missing frontmatter opening delimiter" },
    };
  }

  const closeIndex = normalized.indexOf("\n---", 3);
  if (closeIndex === -1) {
    return {
      ok: false,
      warning: { 
        path, 
        message: "Missing frontmatter closing delimiter" 
      },
    };
  }

  const yamlText = normalized.slice(3, closeIndex).trim();
  const bodyIndex = closeIndex + 4;
  let body = normalized.slice(bodyIndex);
  
  if (body.startsWith("\r\n")) {
    body = body.slice(2);
  } else if (body.startsWith("\n")) {
    body = body.slice(1);
  }

  try {
    const data = parseYaml.parse(yamlText);
    if (!data || typeof data !== "object") {
      return { ok: false, warning: { path, message: "Invalid YAML frontmatter" } };
    }

    if (!data.id || typeof data.id !== "string") {
      return { ok: false, warning: { path, message: "Missing or invalid 'id'" } };
    }

    if (!data.created || typeof data.created !== "string") {
      return { ok: false, warning: { path, message: "Missing or invalid 'created'" } };
    }

    const kinds = Array.isArray(data.kinds)
      ? data.kinds.filter((k: unknown): k is string => typeof k === "string" && isKind(k))
      : [];

    const concepts = Array.isArray(data.concepts)
      ? data.concepts.filter((c: unknown): c is string => typeof c === "string")
      : [];

    const projects = Array.isArray(data.projects)
      ? data.projects.filter((p: unknown): p is string => typeof p === "string")
      : [];

    const event: EventRecord = {
      id: data.id,
      created: data.created,
      created_offset: typeof data.created_offset === "string" ? data.created_offset : "+00:00",
      interpretation: data.interpretation === "confirmed" ? "confirmed" : "pending",
      kinds,
      concepts,
      projects,
      notes: typeof data.notes === "string" ? data.notes : "",
      body,
      path,
    };

    return { ok: true, event };
  } catch (err) {
    return {
      ok: false,
      warning: {
        path,
        message: `YAML parse error: ${err instanceof Error ? err.message : String(err)}`,
      },
    };
  }
}

export function formatEventMarkdown(event: EventRecord): string {
  const frontmatterObj: Record<string, unknown> = {
    id: event.id,
    created: event.created,
    created_offset: event.created_offset,
    interpretation: event.interpretation,
    kinds: event.kinds,
    concepts: event.concepts,
    projects: event.projects,
  };

  if (event.notes) {
    frontmatterObj.notes = event.notes;
  }

  const yamlStr = parseYaml.stringify(frontmatterObj).trim();
  return `---\n${yamlStr}\n---\n${event.body}`;
}