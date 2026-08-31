import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { parseDocSource } from "../src/lib/content-parse.ts";
import { validatePages, formatReport } from "../src/lib/validation.ts";
import type { DocPage } from "../src/lib/content-model.ts";

const ROOT = new URL("..", import.meta.url).pathname;
const DOCS = join(ROOT, "docs");

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(path);
    }
  }
  return files;
}

async function main() {
  const files = await walk(DOCS);
  const pages: DocPage[] = [];
  for (const abs of files) {
    const raw = await readFile(abs, "utf8");
    const rel = relative(ROOT, abs).replaceAll("\\", "/");
    const match = /^docs\/([^/]+)\/([^/]+)\/(.+)\.mdx$/.exec(rel);
    if (!match) {
      console.error(`skip unexpected path: ${rel}`);
      continue;
    }
    const lang = match[1];
    const version = match[2];
    const rest = match[3].split("/").filter(Boolean);
    if (rest[rest.length - 1] === "index") rest.pop();
    const parsed = parseDocSource(raw);
    const href = rest.length
      ? `/${lang}/docs/${version}/${rest.join("/")}`
      : `/${lang}/docs/${version}`;
    pages.push({
      slug: rest,
      href,
      lang,
      version,
      filePath: rel,
      title: parsed.frontmatter.title,
      description: parsed.frontmatter.description,
      sidebarTitle: parsed.frontmatter.sidebarTitle ?? parsed.frontmatter.title,
      order: parsed.frontmatter.order ?? 100,
      hidden: Boolean(parsed.frontmatter.hidden),
      body: parsed.body,
      raw,
      toc: parsed.toc,
      headings: parsed.headings,
    });
  }
  const report = validatePages(pages);
  console.log(formatReport(report));
  if (!report.ok) process.exit(1);
}

await main();
