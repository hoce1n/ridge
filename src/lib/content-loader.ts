import {
  docsConfig,
  docsHref,
  isLocale,
  type LocaleCode,
} from "@/config/docs.config";
import { parseDocSource } from "@/lib/content-parse";
import type {
  DocNeighbors,
  DocPage,
  DocSection,
  DocTree,
  SearchEntry,
} from "@/lib/content-model";

const rawModules = import.meta.glob("../../docs/**/*.mdx", {
  query: "?raw",
  eager: true,
  import: "default",
}) as Record<string, string>;

type FileEntry = {
  filePath: string;
  lang: LocaleCode;
  version: string;
  slug: string[];
  raw: string;
};

function normalizeGlobPath(key: string): string {
  return key.replace(/\\/g, "/").replace(/^\.\.\/\.\.\//, "");
}

function parseFilePath(filePath: string): FileEntry | null {
  const match = /^docs\/([^/]+)\/([^/]+)\/(.+)\.mdx$/.exec(filePath);
  if (!match) return null;
  const lang = match[1];
  const version = match[2];
  if (!isLocale(lang)) return null;
  const rest = match[3];
  const parts = rest.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  if (parts[parts.length - 1] === "index") parts.pop();
  return {
    filePath,
    lang,
    version,
    slug: parts,
    raw: "",
  };
}

function collectFiles(): FileEntry[] {
  const files: FileEntry[] = [];
  for (const [key, raw] of Object.entries(rawModules)) {
    const filePath = normalizeGlobPath(key);
    const parsed = parseFilePath(filePath);
    if (!parsed) continue;
    files.push({ ...parsed, raw });
  }
  return files;
}

function comparePages(a: DocPage, b: DocPage): number {
  if (a.order !== b.order) return a.order - b.order;
  return a.sidebarTitle.localeCompare(b.sidebarTitle);
}

function buildPages(): DocPage[] {
  return collectFiles().map((file) => {
    const parsed = parseDocSource(file.raw);
    const { frontmatter } = parsed;
    return {
      slug: file.slug,
      href: docsHref(file.lang, file.version, file.slug),
      lang: file.lang,
      version: file.version,
      filePath: file.filePath,
      title: frontmatter.title,
      description: frontmatter.description,
      sidebarTitle: frontmatter.sidebarTitle ?? frontmatter.title,
      order: frontmatter.order ?? 100,
      hidden: Boolean(frontmatter.hidden),
      body: parsed.body,
      raw: file.raw,
      toc: parsed.toc,
      headings: parsed.headings,
    };
  });
}

const allPages = buildPages();

function sectionTitle(lang: string, id: string): string {
  const locale: LocaleCode = isLocale(lang) ? lang : "en";
  return docsConfig.sectionTitles[locale][id] ?? id.replace(/-/g, " ");
}

function nestSections(lang: string, pages: DocPage[]): DocSection[] {
  const visible = pages.filter((page) => !page.hidden);
  const bySection = new Map<string, DocPage[]>();
  for (const page of visible) {
    const sectionId = page.slug[0] ?? "pages";
    const list = bySection.get(sectionId) ?? [];
    list.push(page);
    bySection.set(sectionId, list);
  }
  const ids = [
    ...docsConfig.sectionOrder.filter((id) => bySection.has(id)),
    ...[...bySection.keys()].filter(
      (id) => !docsConfig.sectionOrder.includes(id),
    ),
  ];
  return ids.map((id) => {
    const sectionPages = (bySection.get(id) ?? []).slice().sort(comparePages);
    const topLevel: DocPage[] = [];
    const nested = new Map<string, DocPage[]>();
    for (const page of sectionPages) {
      if (page.slug.length <= 2) {
        topLevel.push(page);
      } else {
        const nestedId = page.slug[1];
        const list = nested.get(nestedId) ?? [];
        list.push(page);
        nested.set(nestedId, list);
      }
    }
    const sections: DocSection[] = [...nested.entries()].map(
      ([nestedId, nestedPages]) => ({
        id: `${id}/${nestedId}`,
        title: nestedId.replace(/-/g, " "),
        pages: nestedPages.slice().sort(comparePages),
        sections: [],
      }),
    );
    return {
      id,
      title: sectionTitle(lang, id),
      pages: topLevel,
      sections,
    };
  });
}

const treeCache = new Map<string, DocTree>();

export function getAllDocs(): DocPage[] {
  return allPages;
}

export function getDocTree(lang: string, version: string): DocTree | null {
  const key = `${lang}:${version}`;
  const cached = treeCache.get(key);
  if (cached) return cached;
  const pages = allPages
    .filter((page) => page.lang === lang && page.version === version)
    .slice()
    .sort(comparePages);
  if (pages.length === 0) return null;
  const visible = pages.filter((page) => !page.hidden);
  const tree: DocTree = {
    lang,
    version,
    sections: nestSections(lang, pages),
    pages: visible,
  };
  treeCache.set(key, tree);
  return tree;
}

export function getDocPage(
  lang: string,
  version: string,
  slug: string[],
): DocPage | undefined {
  const normalized = slug.filter(Boolean);
  return allPages.find(
    (page) =>
      page.lang === lang &&
      page.version === version &&
      page.slug.length === normalized.length &&
      page.slug.every((part, i) => part === normalized[i]),
  );
}

export function getNeighbors(
  lang: string,
  version: string,
  slug: string[],
): DocNeighbors {
  const tree = getDocTree(lang, version);
  if (!tree) return { prev: null, next: null };
  const index = tree.pages.findIndex(
    (page) =>
      page.slug.length === slug.length &&
      page.slug.every((part, i) => part === slug[i]),
  );
  if (index === -1) return { prev: null, next: null };
  const toNeighbor = (page: DocPage | undefined) =>
    page
      ? {
          href: page.href,
          title: page.title,
          sidebarTitle: page.sidebarTitle,
        }
      : null;
  return {
    prev: toNeighbor(tree.pages[index - 1]),
    next: toNeighbor(tree.pages[index + 1]),
  };
}

export function getSearchIndex(): SearchEntry[] {
  return allPages
    .filter((page) => !page.hidden)
    .map((page) => {
      const parsed = parseDocSource(page.raw);
      const section = sectionTitle(page.lang, page.slug[0] ?? "");
      return {
        href: page.href,
        title: page.title,
        description: page.description,
        section,
        snippet: parsed.plainText.slice(0, 280),
        headings: page.headings.map((heading) => heading.text),
        lang: page.lang,
        version: page.version,
      };
    });
}

export function firstPageHref(lang: string, version: string): string | null {
  const tree = getDocTree(lang, version);
  return tree?.pages[0]?.href ?? null;
}

export function availableVersions(lang: string): string[] {
  const set = new Set(
    allPages.filter((page) => page.lang === lang).map((page) => page.version),
  );
  return docsConfig.versions.map((v) => v.id).filter((id) => set.has(id));
}

export function availableLocales(version: string): LocaleCode[] {
  const set = new Set(
    allPages
      .filter((page) => page.version === version)
      .map((page) => page.lang as LocaleCode),
  );
  return docsConfig.locales.map((l) => l.code).filter((code) => set.has(code));
}

export function switchVersionHref(
  page: DocPage | null,
  lang: string,
  nextVersion: string,
): string {
  if (page) {
    const match = getDocPage(lang, nextVersion, page.slug);
    if (match) return match.href;
    if (page.slug.length > 1) {
      const section = getDocPage(lang, nextVersion, [page.slug[0]]);
      if (section) return section.href;
    }
  }
  return firstPageHref(lang, nextVersion) ?? docsHref(lang, nextVersion);
}

export function switchLocaleHref(
  page: DocPage | null,
  nextLang: string,
  version: string,
): string {
  if (page) {
    const match = getDocPage(nextLang, version, page.slug);
    if (match) return match.href;
  }
  const fallbackVersion =
    getDocTree(nextLang, version)?.version ??
    availableVersions(nextLang)[0] ??
    docsConfig.defaultVersion;
  return (
    firstPageHref(nextLang, fallbackVersion) ??
    docsHref(nextLang, fallbackVersion)
  );
}
