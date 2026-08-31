import { parseDocSource, extractMarkdownLinks } from "./content-parse.ts";
import type { DocPage } from "./content-model.ts";

export type ValidationIssue = {
  severity: "error" | "warning";
  filePath: string;
  message: string;
};

export type ValidationReport = {
  pageCount: number;
  linkCount: number;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  ok: boolean;
};

const ASSET = /\.(svg|png|jpe?g|gif|webp|mp4|webm|avif)$/i;

function resolveInternal(
  href: string,
  page: DocPage,
  hrefSet: Set<string>,
  headingIds: Map<string, Set<string>>,
): { ok: boolean; reason?: string } {
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return { ok: true };
  }
  if (
    href.startsWith("/images/") ||
    href.startsWith("/videos/") ||
    href.startsWith("/assets/") ||
    ASSET.test(href)
  ) {
    return { ok: true };
  }
  if (href.startsWith("#")) {
    const id = decodeURIComponent(href.slice(1));
    if (headingIds.get(page.href)?.has(id)) return { ok: true };
    return { ok: false, reason: `missing heading #${id}` };
  }
  const [pathPart, hash] = href.split("#");
  let target = pathPart;
  if (!target.startsWith("/")) {
    const base = page.href.endsWith("/") ? page.href : `${page.href}/../`;
    target = new URL(target, `https://ridge.local${base}`).pathname;
  }
  target = target.replace(/\/$/, "") || "/";
  if (!hrefSet.has(target)) {
    return { ok: false, reason: `unresolved internal link ${href}` };
  }
  if (hash) {
    const id = decodeURIComponent(hash);
    if (!headingIds.get(target)?.has(id)) {
      return { ok: false, reason: `missing heading #${id} on ${target}` };
    }
  }
  return { ok: true };
}

export function validatePages(pages: DocPage[]): ValidationReport {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const hrefSet = new Set(pages.map((page) => page.href));
  const headingIds = new Map<string, Set<string>>();
  const seenHrefs = new Map<string, string>();
  let linkCount = 0;

  for (const page of pages) {
    const parsed = parseDocSource(page.raw);
    for (const err of parsed.errors) {
      errors.push({ severity: "error", filePath: page.filePath, message: err });
    }
    const ids = new Set<string>();
    for (const heading of parsed.headings) {
      if (ids.has(heading.id)) {
        errors.push({
          severity: "error",
          filePath: page.filePath,
          message: `duplicate heading id "${heading.id}"`,
        });
      }
      ids.add(heading.id);
    }
    headingIds.set(page.href, ids);

    const key = `${page.lang}:${page.version}:${page.slug.join("/")}`;
    const prev = seenHrefs.get(key);
    if (prev) {
      errors.push({
        severity: "error",
        filePath: page.filePath,
        message: `duplicate slug (conflicts with ${prev})`,
      });
    } else {
      seenHrefs.set(key, page.filePath);
    }

    if (!page.title) {
      errors.push({
        severity: "error",
        filePath: page.filePath,
        message: "missing title metadata",
      });
    }
    if (!page.description) {
      errors.push({
        severity: "error",
        filePath: page.filePath,
        message: "missing description metadata",
      });
    }
  }

  for (const page of pages) {
    const links = extractMarkdownLinks(page.body);
    linkCount += links.length;
    for (const link of links) {
      const result = resolveInternal(link.href, page, hrefSet, headingIds);
      if (!result.ok) {
        errors.push({
          severity: "error",
          filePath: page.filePath,
          message: `broken link "${link.text}" → ${link.href} (${result.reason})`,
        });
      }
    }
  }

  return {
    pageCount: pages.length,
    linkCount,
    errors,
    warnings,
    ok: errors.length === 0,
  };
}

export function formatReport(report: ValidationReport): string {
  const lines = [
    `pages: ${report.pageCount}`,
    `links: ${report.linkCount}`,
    `errors: ${report.errors.length}`,
    `warnings: ${report.warnings.length}`,
    `status: ${report.ok ? "PASS" : "FAIL"}`,
  ];
  for (const issue of [...report.errors, ...report.warnings]) {
    lines.push(`[${issue.severity}] ${issue.filePath}: ${issue.message}`);
  }
  return lines.join("\n");
}
