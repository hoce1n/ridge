import Fuse from "fuse.js";
import { getSearchIndex } from "@/lib/content-loader";
import type { SearchEntry } from "@/lib/content-model";

let fuse: Fuse<SearchEntry> | null = null;

function getFuse(): Fuse<SearchEntry> {
  if (!fuse) {
    fuse = new Fuse(getSearchIndex(), {
      includeMatches: true,
      threshold: 0.38,
      ignoreLocation: true,
      minMatchCharLength: 2,
      keys: [
        { name: "title", weight: 0.45 },
        { name: "headings", weight: 0.25 },
        { name: "description", weight: 0.2 },
        { name: "snippet", weight: 0.1 },
      ],
    });
  }
  return fuse;
}

export type SearchHit = {
  entry: SearchEntry;
  score: number;
};

export function searchDocs(
  query: string,
  lang: string,
  version: string,
  limit = 8,
): SearchHit[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  return getFuse()
    .search(trimmed)
    .map((result) => ({
      entry: result.item,
      score: result.score ?? 1,
    }))
    .filter(
      (hit) => hit.entry.lang === lang && hit.entry.version === version,
    )
    .slice(0, limit);
}

export { getSearchIndex };
