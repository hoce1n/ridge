export type LocaleCode = "en" | "fa";

export type LocaleConfig = {
  code: LocaleCode;
  name: string;
  localName: string;
  dir: "ltr" | "rtl";
};

export type VersionConfig = {
  id: string;
  label: string;
  badge?: "latest" | "legacy";
};

export type DocsConfig = {
  name: string;
  tagline: string;
  description: string;
  siteUrl: string;
  github: {
    repo: string;
    branch: string;
    docsPath: string;
  };
  defaultLocale: LocaleCode;
  locales: LocaleConfig[];
  defaultVersion: string;
  versions: VersionConfig[];
  sectionOrder: string[];
  sectionTitles: Record<LocaleCode, Record<string, string>>;
};

export const docsConfig: DocsConfig = {
  name: "Ridge",
  tagline: "The package manager that stays out of your way.",
  description:
    "Ridge is a content-addressable package manager for JavaScript. Deterministic installs, nested workspaces, and a store that never duplicates a byte.",
  siteUrl: "https://ridge.dev",
  github: {
    repo: "ridge-hq/ridge",
    branch: "main",
    docsPath: "docs",
  },
  defaultLocale: "en",
  locales: [
    { code: "en", name: "English", localName: "English", dir: "ltr" },
    { code: "fa", name: "Persian", localName: "فارسی", dir: "rtl" },
  ],
  defaultVersion: "v2",
  versions: [
    { id: "v2", label: "v2.4", badge: "latest" },
    { id: "v1", label: "v1.9", badge: "legacy" },
  ],
  sectionOrder: ["getting-started", "concepts", "guides", "reference"],
  sectionTitles: {
    en: {
      "getting-started": "Getting Started",
      concepts: "Concepts",
      guides: "Guides",
      reference: "Reference",
    },
    fa: {
      "getting-started": "شروع کار",
      concepts: "مفاهیم",
      guides: "راهنماها",
      reference: "مرجع",
    },
  },
};

export function isLocale(value: string): value is LocaleCode {
  return docsConfig.locales.some((locale) => locale.code === value);
}

export function getLocale(code: string): LocaleConfig {
  return (
    docsConfig.locales.find((locale) => locale.code === code) ??
    docsConfig.locales[0]
  );
}

export function isVersion(value: string): boolean {
  return docsConfig.versions.some((version) => version.id === value);
}

export function getVersion(id: string): VersionConfig {
  return (
    docsConfig.versions.find((version) => version.id === id) ??
    docsConfig.versions[0]
  );
}

export function docsHref(
  lang: string,
  version: string,
  slug: string[] = [],
): string {
  const rest = slug.filter(Boolean).join("/");
  return rest
    ? `/${lang}/docs/${version}/${rest}`
    : `/${lang}/docs/${version}`;
}

export function githubEditUrl(filePath: string): string {
  const { repo, branch } = docsConfig.github;
  return `https://github.com/${repo}/edit/${branch}/${filePath}`;
}

export function githubBlobUrl(filePath: string): string {
  const { repo, branch } = docsConfig.github;
  return `https://github.com/${repo}/blob/${branch}/${filePath}`;
}

export function githubRepoUrl(): string {
  return `https://github.com/${docsConfig.github.repo}`;
}

export function chatgptUrl(pageUrl: string): string {
  const prompt = `Read ${pageUrl} and help me understand this documentation. Answer questions about it clearly, citing the relevant sections.`;
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
}
