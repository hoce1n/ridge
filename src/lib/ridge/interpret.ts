import type { EventRecord, Proposal } from "./types.ts";
import type { Vault } from "./vault.ts";

export type ProposeFn = (body: string) => Proposal[] | Promise<Proposal[]>;

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "i",
  "to",
  "and",
  "of",
  "in",
  "on",
  "for",
  "with",
  "from",
]);

/**
 * Deterministic v1 heuristic proposal extraction.
 * Splits body on non-letters, removes stopwords, keeps length >= 3,
 * lowercases names, and sets facet to "concept".
 */
export function defaultPropose(body: string): Proposal[] {
  // Split on non-letter characters (Unicode letter class / non-alphabetic)
  const tokens = body.split(/[^a-zA-Z]+/);
  const proposals: Proposal[] = [];
  const seen = new Set<string>();

  for (const rawToken of tokens) {
    const token = rawToken.toLowerCase();
    if (token.length >= 3 && !STOPWORDS.has(token) && !seen.has(token)) {
      seen.add(token);
      proposals.push({
        facet: "concept",
        name: token,
      });
    }
  }

  return proposals;
}

/**
 * Runs proposal provider safely.
 * Returns empty array [] if provider throws or rejects.
 */
export async function proposeMeaning(
  body: string,
  propose: ProposeFn = defaultPropose
): Promise<Proposal[]> {
  try {
    const res = await propose(body);
    return res;
  } catch {
    return [];
  }
}

/**
 * Sets explicit confirmation for concepts/projects and changes interpretation to "confirmed".
 * Does not mutate body or created timestamp.
 */
export async function confirmMeaning(
  vault: Vault,
  id: string,
  accepted: { concepts: string[]; projects: string[] }
): Promise<EventRecord> {
  return vault.updateEventFrontmatter(id, {
    interpretation: "confirmed",
    concepts: accepted.concepts,
    projects: accepted.projects,
  });
}

/**
 * Renames a concept or project name across matching frontmatter in all events.
 * Returns count of updated events. Never touches bodies.
 */
export async function renameName(
  vault: Vault,
  facet: "concept" | "project",
  from: string,
  to: string
): Promise<number> {
  const { events } = await vault.readAllEvents();
  let updatedCount = 0;

  for (const event of events) {
    const listKey = facet === "concept" ? "concepts" : "projects";
    const currentList = event[listKey];

    if (currentList.includes(from)) {
      const newList = currentList.map((item) => (item === from ? to : item));
      await vault.updateEventFrontmatter(event.id, {
        [listKey]: newList,
      });
      updatedCount++;
    }
  }

  return updatedCount;
}