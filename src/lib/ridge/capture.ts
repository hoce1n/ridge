import type { EventRecord } from "./types.ts";
import type { Kind } from "./kinds.ts";
import type { Vault } from "./vault.ts";
import { newEventId } from "./ulid.ts";
import { slugFromBody } from "./slug.ts";
import { createdStamp } from "./time.ts";

export type CaptureInput = {
  body: string;
  kinds?: Kind[];
  now?: Date;
  offset?: string;
};

export async function captureEvent(
  vault: Vault,
  input: CaptureInput
): Promise<EventRecord> {
  // 1. Trim body
  const body = input.body.trim();

  // 2. Reject empty body
  if (!body) {
    throw new Error("event body cannot be empty");
  }

  // 3. Extract canonical UTC ISO timestamp and timezone offset using createdStamp
  const now = input.now ?? new Date();
  const stamp = createdStamp(now, input.offset);

  // 4. Generate ULID and filename slug
  const id = newEventId();
  const slug = slugFromBody(body);

  // 5. Determine unique relative file path via Vault
  const relPath = await vault.uniqueEventPath(stamp.created, slug);

  // 6. Construct clean initial EventRecord with pending status and empty collections
  const record: EventRecord = {
    id,
    created: stamp.created,
    created_offset: stamp.created_offset,
    interpretation: "pending",
    kinds: input.kinds ?? [],
    concepts: [],
    projects: [],
    notes: "",
    body,
    path: relPath,
  };

  // 7. Persist atomically through Vault
  return await vault.createEventFile(record, relPath);
}