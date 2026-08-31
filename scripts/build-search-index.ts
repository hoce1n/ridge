import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { parseDocSource } from "../src/lib/content-parse.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const DOCS = join(ROOT, "docs");

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if (entry.name.endsWith(".mdx")) files.push(path);
  }
  return files;
}

async function main() {
  const files = await walk(DOCS);
  const entries = [];
  for (const abs of files) {
    const raw = await readFile(abs, "utf8");
    const rel = relative(ROOT, abs).replaceAll("\\", "/");
    const match = /^docs\/([^/]+)\/([^/]+)\/(.+)\.mdx$/.exec(rel);
    if (!match) continue;
    const parsed = parseDocSource(raw);
    if (parsed.frontmatter.hidden) continue;
    const rest = match[3].split("/").filter(Boolean);
    if (rest[rest.length - 1] === "index") rest.pop();
    const lang = match[1];
    const version = match[2];
    const href = rest.length
      ? `/${lang}/docs/${version}/${rest.join("/")}`
      : `/${lang}/docs/${version}`;
    entries.push({
      href,
      title: parsed.frontmatter.title,
      description: parsed.frontmatter.description,
      section: rest[0] ?? "",
      snippet: parsed.plainText.slice(0, 280),
      headings: parsed.headings.map((h) => h.text),
      lang,
      version,
    });
  }
  const outDir = join(ROOT, "public");
  await mkdir(outDir, { recursive: true });
  const out = join(outDir, "search-index.json");
  await writeFile(out, JSON.stringify(entries, null, 2) + "\n");
  console.log(`wrote ${entries.length} entries to public/search-index.json`);
}

await main();
