# Documentation System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, professional-grade documentation website (modeled on pnpm's docs) with a custom Next.js implementation: sidebar navigation, TOC scroll-spy, anchors, Open In panel, Edit on GitHub, search + command menu, dark mode, responsive layout, versioning, i18n/RTL, MDX components, SEO, and quality tooling.

**Architecture:** A custom Next.js 15 (App Router) + React + TypeScript app. Content lives as `.mdx` files under `docs/`. A build-time content loader (`src/lib/content-loader.ts`) parses frontmatter, headings, and folder structure into a typed model used to generate the sidebar, TOC, prev/next, and search index. The UI shell (sidebar, TOC, search, theme) is hand-built; the raw MDX parsing chain uses established libraries (`@mdx-js/mdx`, remark/rehype plugins, `next-mdx-remote/rsc`).

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, pnpm, `@mdx-js/mdx`, `next-mdx-remote`, `gray-matter`, `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`, `shiki`, `fuse.js`, `cmdk`, `lucide-react`, `vitest`.

## Global Constraints

- TypeScript throughout; no `any` leaks in the content model.
- pnpm is the only package manager.
- Content files are `.mdx` with `title` and `description` frontmatter required, located in the repository root `docs/` directory.
- **CRITICAL:** The content loader MUST ignore the `superpowers` directory (used for specs/plans), `node_modules`, and hidden dot-directories. Content is parsed from `docs/` but `docs/superpowers/` is NOT doc content.
- GitHub integration is configurable via `src/config/docs.config.ts` — never hardcode repo paths in components.
- UI chrome strings (labels like "On This Page", "Search", "Copy MD") are in a single `src/lib/i18n.ts` dictionary so i18n can swap them later.
- The site must remain usable after Phase 2 while later phases are added incrementally.
- Dark mode uses Tailwind's `class` strategy (system / light / dark).
- No emojis in code or docs unless user asks. No comments in code unless the step explicitly shows them.
- Each task ends with an independently verifiable deliverable (tests pass, `pnpm build` passes, or both).

---

## Phase 0 — Scaffold

### Task 1: Scaffold Next.js App

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Create: `vitest.config.ts`
- Create: `.gitignore` (extend existing)
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/lib/utils.ts`
- Create: `src/config/docs.config.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: project scaffold, `cn()` utility, `docsConfig`, `getGitHubUrls()` helpers used by all later tasks.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "docs-system",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "validate-docs": "tsx scripts/validate-docs.ts",
    "build-search-index": "tsx scripts/build-search-index.ts"
  },
  "dependencies": {
    "@mdx-js/mdx": "^3.1.0",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "fuse.js": "^7.0.0",
    "github-slugger": "^2.0.0",
    "gray-matter": "^4.0.3",
    "lucide-react": "^0.468.0",
    "next": "15.1.6",
    "next-mdx-remote": "^5.0.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "rehype-autolink-headings": "^7.1.0",
    "rehype-pretty-code": "^0.14.0",
    "rehype-slug": "^6.0.0",
    "remark-gfm": "^4.0.0",
    "shiki": "^1.26.2",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.15",
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Write `next.config.ts`**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

- [ ] **Step 4: Write `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        border: 'hsl(var(--border))',
      },
    },
  },
  plugins: [typography],
};

export default config;
```

- [ ] **Step 5: Write `postcss.config.mjs`**

```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

- [ ] **Step 6: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
});
```

- [ ] **Step 7: Write `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
  }

  body {
    @apply bg-background text-foreground antialiased;
  }

  h2[id], h3[id], h4[id] {
    scroll-margin-top: 5rem;
  }

  .anchor-link {
    @apply ml-2 text-muted-foreground opacity-0 no-underline;
  }
  h2:hover .anchor-link, h3:hover .anchor-link, h4:hover .anchor-link {
    @apply opacity-100;
  }

  /* Code block chrome */
  [data-rehype-pretty-code-figure] {
    @apply my-4 overflow-hidden rounded-lg border;
  }
  [data-rehype-pretty-code-figure] figcaption {
    @apply border-b bg-muted px-4 py-2 text-sm text-muted-foreground;
  }
  [data-rehype-pretty-code-figure] pre {
    @apply overflow-x-auto p-4 text-sm;
  }
  [data-rehype-pretty-code-figure] code {
    @apply grid;
  }
  [data-line] {
    @apply px-4;
  }
  [data-highlighted-line] {
    @apply bg-accent;
  }
}
```

- [ ] **Step 8: Write `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import './globals.css';
import { docsConfig } from '@/config/docs.config';

export const metadata: Metadata = {
  title: {
    default: docsConfig.projectName,
    template: `%s | ${docsConfig.projectName}`,
  },
  description: 'Documentation site built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 9: Write `src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 10: Write `src/config/docs.config.ts`**

```ts
export const docsConfig = {
  projectName: 'Docs',
  siteUrl: 'https://docs.example.com',
  github: {
    owner: 'your-org',
    repo: 'your-repo',
    branch: 'main',
  },
  contentDir: 'docs',
  versions: ['latest', 'v10', 'v9'],
  locales: ['en', 'fa'],
} as const;

export function githubRepoUrl(): string {
  const { owner, repo } = docsConfig.github;
  return `https://github.com/${owner}/${repo}`;
}

export function githubEditUrl(relativePath: string): string {
  const { owner, repo, branch } = docsConfig.github;
  return `https://github.com/${owner}/${repo}/edit/${branch}/${relativePath}`;
}

export function githubBlobUrl(relativePath: string): string {
  const { owner, repo, branch } = docsConfig.github;
  return `https://github.com/${owner}/${repo}/blob/${branch}/${relativePath}`;
}
```

- [ ] **Step 11: Verify scaffold builds**

Run: `pnpm install && pnpm build`
Expected: exit 0; `.next` is generated.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "chore: scaffold next.js docs site"
```

---

## Phase 1 — Core Shell

### Task 2: Content Loader with Tests

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/content-loader.ts`
- Create: `tests/content-loader.test.ts`

**Interfaces:**
- Consumes: `docsConfig` (for content dir), `cn` (not here).
- Produces: `Frontmatter`, `TocItem`, `DocPage`, `DocSection`, `DocTree`, `getAllDocs`, `getPage`, `getFlatPages` — used by every later task.

- [ ] **Step 1: Write the failing test**

```ts
// tests/content-loader.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { getAllDocs, getPage, getFlatPages } from '@/lib/content-loader';

const fixtures = [
  ['docs/getting-started/introduction.mdx', 'getting-started/introduction'],
  ['docs/getting-started/installation.mdx', 'getting-started/installation'],
  ['docs/concepts/workspaces.mdx', 'concepts/workspaces'],
];

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'docs-test-'));
  const content = `---
title: Introduction
description: Start here
order: 1
---

# Introduction

## Getting Started

Some text.
`;
  fs.mkdirSync(path.join(tmpDir, 'docs/getting-started'), { recursive: true });
  fs.mkdirSync(path.join(tmpDir, 'docs/concepts'), { recursive: true });
  fs.writeFileSync(path.join(tmpDir, 'docs/getting-started/introduction.mdx'), content);
  fs.writeFileSync(
    path.join(tmpDir, 'docs/getting-started/installation.mdx'),
    `---
title: Installation
description: Install it
order: 2
---

# Installation
`
  );
  fs.writeFileSync(
    path.join(tmpDir, 'docs/concepts/workspaces.mdx'),
    `---
title: Workspaces
description: About workspaces
---

# Workspaces
`
  );
});

describe('getAllDocs', () => {
  it('builds sections from folder structure', () => {
    const tree = getAllDocs({ docsDir: tmpDir + '/docs' });
    expect(tree.sections.map((s) => s.key)).toEqual(['getting-started', 'concepts']);
    expect(tree.sections[0].pages.map((p) => p.slug)).toEqual([
      'getting-started/introduction',
      'getting-started/installation',
    ]);
  });

  it('generates urls and toc', () => {
    const tree = getAllDocs({ docsDir: tmpDir + '/docs' });
    const intro = tree.pages[0];
    expect(intro.url).toBe('/docs/getting-started/introduction');
    expect(intro.toc).toEqual([
      { id: 'introduction', text: 'Introduction', level: 1 },
      { id: 'getting-started', text: 'Getting Started', level: 2 },
    ]);
  });

  it('respects order frontmatter', () => {
    const tree = getAllDocs({ docsDir: tmpDir + '/docs' });
    const first = tree.sections[0].pages[0];
    expect(first.slug).toBe('getting-started/introduction');
  });
});

describe('getPage / getFlatPages', () => {
  it('finds page by slug', () => {
    const page = getPage('concepts/workspaces', { docsDir: tmpDir + '/docs' });
    expect(page?.frontmatter.title).toBe('Workspaces');
  });

  it('flattens all pages in order', () => {
    const tree = getAllDocs({ docsDir: tmpDir + '/docs' });
    const flat = getFlatPages(tree);
    expect(flat.map((p) => p.slug)).toEqual(fixtures.map((f) => f[1]));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/content-loader.test.ts`
Expected: FAIL with "Failed to resolve import '@/lib/content-loader'".

- [ ] **Step 3: Write `src/lib/types.ts`**

```ts
export interface Frontmatter {
  title: string;
  description: string;
  sidebarTitle?: string;
  order?: number;
  hidden?: boolean;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface DocPage {
  slug: string;
  url: string;
  frontmatter: Frontmatter;
  toc: TocItem[];
  source: string;
  content: string;
  section: string;
}

export interface DocSection {
  key: string;
  title: string;
  pages: DocPage[];
}

export interface DocTree {
  sections: DocSection[];
  pages: DocPage[];
}

export interface SearchEntry {
  title: string;
  url: string;
  section: string;
  description: string;
  content: string;
}
```

- [ ] **Step 4: Write `src/lib/content-loader.ts`**

```ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';
import type { DocTree, DocPage, DocSection, Frontmatter, TocItem } from '@/lib/types';

const DEFAULT_DOCS_DIR = path.join(process.cwd(), 'docs');
const IGNORED_DIRS = new Set(['superpowers', 'node_modules', '.git', '.next']);

export function getSectionTitle(key: string): string {
  return key
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function extractTocFromSource(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  const lines = source.split('\n');
  let inCode = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (m) {
      toc.push({ id: slugger.slug(m[2].trim()), text: m[2].trim(), level: m[1].length });
    }
  }
  return toc;
}

function readSectionMeta(dirPath: string): { title?: string } {
  const metaPath = path.join(dirPath, '_meta.json');
  if (!fs.existsSync(metaPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    return {};
  }
}

function walk(dir: string, baseDir: string, pages: DocPage[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      walk(fullPath, baseDir, pages);
      continue;
    }
    if (!/\.mdx?$/.test(entry.name)) continue;
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);
    const relative = path.relative(baseDir, fullPath);
    const slug = relative.replace(/\.mdx?$/, '').replace(/\\/g, '/');
    const sectionKey = slug.split('/')[0];
    const frontmatter: Frontmatter = {
      title: String(data.title ?? ''),
      description: String(data.description ?? ''),
      sidebarTitle: data.sidebarTitle ? String(data.sidebarTitle) : undefined,
      order: typeof data.order === 'number' ? data.order : undefined,
      hidden: Boolean(data.hidden),
    };
    pages.push({
      slug,
      url: `/docs/${slug}`,
      frontmatter,
      toc: extractTocFromSource(content),
      source: raw,
      content,
      section: sectionKey,
    });
  }
}

export function getAllDocs(options?: { docsDir?: string }): DocTree {
  const baseDir = options?.docsDir ?? DEFAULT_DOCS_DIR;
  const allPages: DocPage[] = [];
  walk(baseDir, baseDir, allPages);

  const visible = allPages.filter((p) => !p.frontmatter.hidden);
  const bySection = new Map<string, DocPage[]>();
  for (const page of visible) {
    if (!bySection.has(page.section)) bySection.set(page.section, []);
    bySection.get(page.section)!.push(page);
  }

  const sections: DocSection[] = [];
  for (const [key, pages] of bySection) {
    const meta = readSectionMeta(path.join(baseDir, key));
    pages.sort((a, b) => {
      const ao = a.frontmatter.order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.frontmatter.order ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return a.frontmatter.title.localeCompare(b.frontmatter.title);
    });
    sections.push({ key, title: meta.title ?? getSectionTitle(key), pages });
  }
  sections.sort((a, b) => a.title.localeCompare(b.title));

  return { sections, pages: visible };
}

export function getPage(slug: string, options?: { docsDir?: string }) {
  return getAllDocs(options).pages.find((p) => p.slug === slug);
}

export function getFlatPages(tree: DocTree): DocPage[] {
  return tree.sections.flatMap((s) => s.pages);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run tests/content-loader.test.ts`
Expected: PASS, 4 tests green.

- [ ] **Step 6: Commit**

```bash
git add src/lib/types.ts src/lib/content-loader.ts tests/content-loader.test.ts
git commit -m "feat: add typed content loader with tests"
```

---

### Task 3: Sample Content + MDX Renderer

**Files:**
- Create: `docs/getting-started/introduction.mdx`
- Create: `docs/getting-started/installation.mdx`
- Create: `docs/getting-started/quick-start.mdx`
- Create: `docs/concepts/workspaces.mdx`
- Create: `docs/concepts/packages.mdx`
- Create: `docs/concepts/dependencies.mdx`
- Create: `docs/reference/cli.mdx`
- Create: `docs/reference/configuration.mdx`
- Create: `docs/getting-started/_meta.json`, `docs/concepts/_meta.json`, `docs/reference/_meta.json`
- Create: `src/lib/mdx.ts`
- Create: `src/components/mdx/MdxComponents.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/(docs)/layout.tsx`
- Create: `src/app/(docs)/docs/[[...slug]]/page.tsx`

**Interfaces:**
- Consumes: `getAllDocs`, `getPage`, `getFlatPages` (Task 2); `cn` (Task 1).
- Produces: `renderMdx(source)` (returns RSC-rendered MDX), `mdxComponents` map, docs layout, dynamic route.

- [ ] **Step 1: Write sample content files**

`docs/getting-started/_meta.json`:
```json
{ "title": "Getting Started" }
```
`docs/concepts/_meta.json`:
```json
{ "title": "Core Concepts" }
```
`docs/reference/_meta.json`:
```json
{ "title": "API Reference" }
```

`docs/getting-started/introduction.mdx`:
```mdx
---
title: Introduction
description: Welcome to the documentation.
order: 1
---

# Introduction

This is a modern documentation system built with Next.js.

## Why a documentation system?

Documentation matters. A good docs site makes a product usable.

## Features

- Markdown / MDX content
- Sidebar navigation
- Table of contents
- Dark mode
```

`docs/getting-started/installation.mdx`:
```mdx
---
title: Installation
description: Install the package on your system.
order: 2
---

# Installation

## Requirements

- Node.js 18 or newer
- pnpm 8 or newer

## Installing

```bash
pnpm install
```
```

`docs/getting-started/quick-start.mdx`:
```mdx
---
title: Quick Start
description: Get up and running in minutes.
order: 3
---

# Quick Start

Create your first page in under a minute.

```ts
const hello = 'world';
console.log(hello);
```
```

`docs/concepts/workspaces.mdx`:
```mdx
---
title: Workspaces
description: Monorepo workspaces explained.
---

# Workspaces

A workspace is a collection of packages in a single repository.

## Benefits

- Single lockfile
- Atomic commits
- Shared tooling
```

`docs/concepts/packages.mdx`:
```mdx
---
title: Packages
description: How packages are structured.
---

# Packages

Every package has a `package.json` manifest.
```

`docs/concepts/dependencies.mdx`:
```mdx
---
title: Dependencies
description: Managing dependencies across packages.
---

# Dependencies

Dependencies are installed in a virtual store.
```

`docs/reference/cli.mdx`:
```mdx
---
title: CLI
description: Command line reference.
---

# CLI

## `install`

Installs dependencies.

```bash
pnpm install
```
```

`docs/reference/configuration.mdx`:
```mdx
---
title: Configuration
description: Configuration file reference.
---

# Configuration

The configuration file is `pnpm-workspace.yaml`.
```

- [ ] **Step 2: Write `src/lib/mdx.ts`**

```ts
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'append', properties: { className: ['anchor-link'], ariaHidden: true } }],
  ],
};

export async function renderMdx(source: string, components: Record<string, React.ComponentType<any>>) {
  const mdx = await MDXRemote({ source, components, options: { mdxOptions } });
  return mdx;
}
```

- [ ] **Step 3: Write `src/components/mdx/MdxComponents.tsx`**

```tsx
export const mdxComponents: Record<string, React.ComponentType<any>> = {};
```

- [ ] **Step 4: Write `src/app/page.tsx`**

```tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/docs/getting-started/introduction');
}
```

- [ ] **Step 5: Write `src/app/(docs)/layout.tsx`**

```tsx
import { getAllDocs } from '@/lib/content-loader';
import Sidebar from '@/components/layout/Sidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const tree = getAllDocs();
  return (
    <div className="flex">
      <Sidebar tree={tree} />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
```

- [ ] **Step 6: Write `src/app/(docs)/docs/[[...slug]]/page.tsx`**

```tsx
import { notFound } from 'next/navigation';
import { getPage, getFlatPages, getAllDocs } from '@/lib/content-loader';
import { renderMdx } from '@/lib/mdx';
import { mdxComponents } from '@/components/mdx/MdxComponents';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export async function generateStaticParams() {
  const tree = getAllDocs();
  return tree.pages.map((page) => ({ slug: page.slug.split('/') }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getPage(slug?.join('/') ?? '');
  return { title: page?.frontmatter.title ?? 'Not Found' };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const slugStr = slug?.join('/') ?? '';
  const page = getPage(slugStr);
  if (!page) notFound();

  const mdx = await renderMdx(page.content, mdxComponents);

  return (
    <article className="prose prose-slate dark:prose-invert max-w-3xl px-8 py-12">
      <h1>{page.frontmatter.title}</h1>
      {mdx}
    </article>
  );
}
```

- [ ] **Step 7: Verify typography is configured**

`@tailwindcss/typography` is already in `devDependencies` (Task 1) and registered as the `typography` plugin in `tailwind.config.ts`. No action needed — this enables the `prose` classes used in Step 6. Run `pnpm install` to confirm the lockfile is current.

- [ ] **Step 8: Write `src/components/layout/Sidebar.tsx`**

```tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { DocTree } from '@/lib/types';

export default function Sidebar({ tree }: { tree: DocTree }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r p-6 md:block">
      <nav>
        {tree.sections.map((section) => (
          <div key={section.key} className="mb-6">
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{section.title}</h3>
            <ul className="space-y-1">
              {section.pages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={page.url}
                    className={cn(
                      'block rounded px-2 py-1 text-sm hover:bg-accent',
                      pathname === page.url && 'font-medium text-accent-foreground'
                    )}
                  >
                    {page.frontmatter.sidebarTitle ?? page.frontmatter.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 9: Verify build and routing**

Run: `pnpm build`
Expected: exit 0; routes `/docs/getting-started/introduction` etc. are statically generated.

Run: `pnpm dev` (background) and `curl -s http://localhost:3000/docs/getting-started/introduction | grep -c Introduction`
Expected: output ≥ 1.

- [ ] **Step 10: Commit**

```bash
git add docs/ src/lib/mdx.ts src/components src/app
git commit -m "feat: render markdown content with sidebar navigation"
```

---

### Task 4: TOC with Scroll Spy

**Files:**
- Create: `src/components/layout/TableOfContents.tsx`
- Create: `src/hooks/useScrollSpy.ts`
- Create: `src/lib/i18n.ts`
- Modify: `src/app/(docs)/docs/[[...slug]]/page.tsx`

**Interfaces:**
- Consumes: `DocPage`/`TocItem` types, `cn`.
- Produces: `TableOfContents({ toc })` client component; `t` dictionary function.

- [ ] **Step 1: Write `src/lib/i18n.ts`**

```ts
export const t = {
  onThisPage: 'On This Page',
  searchPlaceholder: 'Search documentation...',
  copyMd: 'Copy MD',
  copyLink: 'Copy Link',
  chatgpt: 'ChatGPT',
  github: 'GitHub',
  openIn: 'Open In',
  editOnGithub: 'Edit on GitHub',
  previous: 'Previous',
  next: 'Next',
  toggleTheme: 'Toggle theme',
  copyPageAsMarkdown: 'Copy page as Markdown',
  openOnGithub: 'Open on GitHub',
} as const;
```

- [ ] **Step 2: Write `src/hooks/useScrollSpy.ts`**

```ts
'use client';
import { useEffect, useState } from 'react';

export function useScrollSpy(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids.join(',')]);

  return activeId;
}
```

- [ ] **Step 3: Write `src/components/layout/TableOfContents.tsx`**

```tsx
'use client';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import type { TocItem } from '@/lib/types';

export default function TableOfContents({ toc }: { toc: TocItem[] }) {
  const ids = toc.map((item) => item.id);
  const activeId = useScrollSpy(ids);

  if (toc.length === 0) return null;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-l p-6 lg:block">
      <p className="mb-3 text-sm font-semibold text-muted-foreground">{t.onThisPage}</p>
      <nav>
        <ul className="space-y-1">
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={cn(
                  'block text-sm text-muted-foreground hover:text-foreground',
                  item.level === 3 && 'pl-3',
                  activeId === item.id && 'font-medium text-foreground'
                )}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
```

- [ ] **Step 4: Modify `src/app/(docs)/docs/[[...slug]]/page.tsx`**

Add import and render the TOC beside the article:

```tsx
import TableOfContents from '@/components/layout/TableOfContents';
```

Change the return to:

```tsx
  return (
    <div className="flex">
      <article className="min-w-0 flex-1 px-8 py-12">
        <h1 className="mb-6 text-4xl font-bold">{page.frontmatter.title}</h1>
        <div className="prose prose-slate dark:prose-invert max-w-3xl">{mdx}</div>
      </article>
      <TableOfContents toc={page.toc} />
    </div>
  );
```

- [ ] **Step 5: Verify build**

Run: `pnpm build`
Expected: exit 0.

Run: `pnpm dev` (background) and `curl -s http://localhost:3000/docs/getting-started/introduction | grep -c "On This Page"`
Expected: output ≥ 1.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/TableOfContents.tsx src/hooks/useScrollSpy.ts src/lib/i18n.ts src/app
git commit -m "feat: add table of contents with scroll spy"
```

---

### Task 5: Prev / Next Navigation

**Files:**
- Create: `src/components/layout/PrevNext.tsx`
- Modify: `src/app/(docs)/docs/[[...slug]]/page.tsx`

**Interfaces:**
- Consumes: `getFlatPages`, `getPage`, `DocPage`.
- Produces: `PrevNext({ prev, next })` server component.

- [ ] **Step 1: Write `src/components/layout/PrevNext.tsx`**

```tsx
import Link from 'next/link';
import { t } from '@/lib/i18n';
import type { DocPage } from '@/lib/types';

export default function PrevNext({ prev, next }: { prev?: DocPage; next?: DocPage }) {
  return (
    <div className="mt-12 flex justify-between border-t pt-6">
      {prev ? (
        <Link href={prev.url} className="group max-w-[45%]">
          <span className="text-sm text-muted-foreground">← {t.previous}</span>
          <span className="block font-medium group-hover:underline">{prev.frontmatter.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.url} className="group max-w-[45%] text-right">
          <span className="text-sm text-muted-foreground">{t.next} →</span>
          <span className="block font-medium group-hover:underline">{next.frontmatter.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Modify `src/app/(docs)/docs/[[...slug]]/page.tsx`**

Add imports and compute prev/next:

```tsx
import PrevNext from '@/components/layout/PrevNext';

  const tree = getAllDocs();
  const flat = getFlatPages(tree);
  const index = flat.findIndex((p) => p.slug === page.slug);
  const prev = flat[index - 1];
  const next = flat[index + 1];
```

Render `<PrevNext prev={prev} next={next} />` after the prose div inside the article.

- [ ] **Step 3: Verify build**

Run: `pnpm build`
Expected: exit 0.

Run: `pnpm dev` (background) and `curl -s http://localhost:3000/docs/getting-started/installation | grep -c "Previous"`
Expected: output ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/PrevNext.tsx src/app
git commit -m "feat: add prev next navigation"
```

---

### Task 6: Theme Toggle

**Files:**
- Create: `src/components/ui/ThemeToggle.tsx`
- Create: `src/hooks/useTheme.ts`
- Modify: `src/app/(docs)/layout.tsx`

**Interfaces:**
- Consumes: `cn`.
- Produces: `ThemeToggle` client component; `useTheme` hook with `{ theme, setTheme, resolvedTheme }`; system/light/dark support.

- [ ] **Step 1: Write `src/hooks/useTheme.ts`**

```ts
'use client';
import { useEffect, useState } from 'react';

export type Theme = 'system' | 'light' | 'dark';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) setThemeState(stored);
  }, []);

  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (next: Theme) => setThemeState(next);

  return { theme, resolvedTheme, setTheme };
}
```

- [ ] **Step 2: Write `src/components/ui/ThemeToggle.tsx`**

```tsx
'use client';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const options: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: 'system', icon: <Monitor className="h-4 w-4" />, label: 'System' },
  { value: 'light', icon: <Sun className="h-4 w-4" />, label: 'Light' },
  { value: 'dark', icon: <Moon className="h-4 w-4" />, label: 'Dark' },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-1 rounded-full border p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          title={opt.label}
          aria-label={opt.label}
          className={cn(
            'rounded-full p-1.5 transition-colors',
            theme === opt.value ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
          )}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Update root layout to prevent flash of wrong theme**

Modify `src/app/layout.tsx` — add an inline script inside `<body>` as its first child:

```tsx
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
```

- [ ] **Step 4: Add ThemeToggle to docs layout**

Modify `src/app/(docs)/layout.tsx` — add import and render:

```tsx
import ThemeToggle from '@/components/ui/ThemeToggle';
```

Inside the flex container, above `<main>`, add a header row:

```tsx
    <div className="flex flex-col md:flex-row">
      <div className="flex items-center justify-between border-b px-6 py-3 md:hidden">
        <span className="font-bold">Docs</span>
        <ThemeToggle />
      </div>
      <div className="flex">
        <Sidebar tree={tree} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
```

- [ ] **Step 5: Verify build**

Run: `pnpm build`
Expected: exit 0.

Run: `pnpm dev` (background), then:
`curl -s http://localhost:3000/docs/getting-started/introduction | grep -c "Monitor"`
Expected: output ≥ 1.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/ThemeToggle.tsx src/hooks/useTheme.ts src/app
git commit -m "feat: add theme toggle with system light dark support"
```

---

## Phase 2 — Content Power

### Task 7: Professional Code Blocks

**Files:**
- Create: `src/components/mdx/CodeBlock.tsx`
- Modify: `src/lib/mdx.ts` (add `rehype-pretty-code`)
- Modify: `src/components/mdx/MdxComponents.tsx` (register `pre`)

**Interfaces:**
- Consumes: `mdxOptions`, `mdxComponents`.
- Produces: `CodeBlock` client wrapper (copy button), highlighted code with filename/line numbers/highlighted lines/diff/terminal styles via `rehype-pretty-code`.

- [ ] **Step 1: Modify `src/lib/mdx.ts`**

```ts
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';

const prettyCodeOptions = {
  theme: 'github-dark',
  keepBackground: false,
};

export const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'append', properties: { className: ['anchor-link'], ariaHidden: true } }],
    [rehypePrettyCode, prettyCodeOptions],
  ],
};
```

- [ ] **Step 2: Write `src/components/mdx/CodeBlock.tsx`**

```tsx
'use client';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const text = extractText(children);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative">
      <button
        onClick={copy}
        className="absolute right-3 top-3 rounded p-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </button>
      {children}
    </div>
  );
}

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as React.ReactElement).props.children);
  }
  return '';
}
```

- [ ] **Step 3: Register the `pre` component**

Modify `src/components/mdx/MdxComponents.tsx`:

```tsx
import CodeBlock from '@/components/mdx/CodeBlock';

export const mdxComponents: Record<string, React.ComponentType<any>> = {
  pre: CodeBlock,
};
```

- [ ] **Step 4: Add code block chrome CSS**

Append to `src/app/globals.css`:

```css
  [data-rehype-pretty-code-figure] [data-line] {
    @apply border-l-2 border-transparent;
  }
  [data-rehype-pretty-code-figure] [data-highlighted-line] {
    @apply border-l-2 border-accent-foreground bg-accent;
  }
```

- [ ] **Step 5: Add a code block with meta to sample content**

Append to `docs/getting-started/quick-start.mdx`:

```mdx
```ts title="example.ts" {1,3-4}
const a = 1;
const b = 2;
const c = 3;
const d = 4;
```
```

- [ ] **Step 6: Verify build**

Run: `pnpm build`
Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/lib/mdx.ts src/components/mdx src/app/globals.css docs/getting-started/quick-start.mdx
git commit -m "feat: add professional code blocks with syntax highlighting and copy"
```

---

### Task 8: Open In Panel and Edit on GitHub

**Files:**
- Create: `src/components/layout/OpenIn.tsx`
- Create: `src/app/api/raw/[[...slug]]/route.ts`
- Modify: `src/app/(docs)/docs/[[...slug]]/page.tsx`

**Interfaces:**
- Consumes: `DocPage`, `githubEditUrl`/`githubBlobUrl` (Task 1), `t`.
- Produces: `OpenIn({ page })` client component; `/api/raw/<slug>` route returning raw markdown.

- [ ] **Step 1: Write `src/app/api/raw/[[...slug]]/route.ts`**

```ts
import { getPage } from '@/lib/content-loader';

export async function GET(_req: Request, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  const page = getPage(slug?.join('/') ?? '');
  if (!page) return new Response('Not found', { status: 404 });
  return new Response(page.source, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
```

- [ ] **Step 2: Write `src/components/layout/OpenIn.tsx`**

```tsx
'use client';
import { Copy, Link2, MessageSquare, Github, Pencil, Check } from 'lucide-react';
import { useState } from 'react';
import { t } from '@/lib/i18n';
import { githubBlobUrl, githubEditUrl, docsConfig } from '@/config/docs.config';
import type { DocPage } from '@/lib/types';

export default function OpenIn({ page }: { page: DocPage }) {
  const [copied, setCopied] = useState<'md' | 'link' | null>(null);
  const sourcePath = `${page.slug}.mdx`;

  const copy = async (kind: 'md' | 'link') => {
    const url = `${docsConfig.siteUrl}${page.url}`;
    const rawUrl = `/api/raw/${page.slug}`;
    if (kind === 'md') {
      const res = await fetch(rawUrl);
      await navigator.clipboard.writeText(await res.text());
    } else {
      await navigator.clipboard.writeText(url);
    }
    setCopied(kind);
    setTimeout(() => setCopied(null), 2000);
  };

  const openChatGPT = async () => {
    const res = await fetch(`/api/raw/${page.slug}`);
    const md = await res.text();
    localStorage.setItem('chatgpt_doc', md);
    window.open(`https://chatgpt.com/`, '_blank');
  };

  return (
    <div className="mt-10 rounded-lg border p-4">
      <p className="mb-3 text-sm font-semibold text-muted-foreground">{t.openIn}</p>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => copy('md')} className="flex items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-accent">
          {copied === 'md' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {t.copyMd}
        </button>
        <button onClick={() => copy('link')} className="flex items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-accent">
          {copied === 'link' ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />} {t.copyLink}
        </button>
        <button onClick={openChatGPT} className="flex items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-accent">
          <MessageSquare className="h-4 w-4" /> {t.chatgpt}
        </button>
        <a
          href={githubBlobUrl(`${docsConfig.contentDir}/${sourcePath}`)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-accent"
        >
          <Github className="h-4 w-4" /> {t.github}
        </a>
      </div>
      <a
        href={githubEditUrl(`${docsConfig.contentDir}/${sourcePath}`)}
        target="_blank"
        rel="noreferrer"
        className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <Pencil className="h-4 w-4" /> {t.editOnGithub}
      </a>
    </div>
  );
}
```

Note: add `import { Check } from 'lucide-react';` to the import line.

- [ ] **Step 3: Render `OpenIn` in the page**

Modify `src/app/(docs)/docs/[[...slug]]/page.tsx`:
- Add `import OpenIn from '@/components/layout/OpenIn';`
- Render `<OpenIn page={page} />` after the `PrevNext` component.

- [ ] **Step 4: Verify build and raw route**

Run: `pnpm build`
Expected: exit 0.

Run: `pnpm dev` (background) and `curl -s http://localhost:3000/api/raw/getting-started/introduction | head -1`
Expected: `---` (frontmatter start).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/OpenIn.tsx src/app
git commit -m "feat: add open in panel and edit on github"
```

---

### Task 9: Responsive Mobile Drawer

**Files:**
- Modify: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/MobileNav.tsx`

**Interfaces:**
- Consumes: `DocTree`, `cn`.
- Produces: `MobileNav({ tree })` drawer for small screens; Sidebar stays visible on `md+`.

- [ ] **Step 1: Write `src/components/layout/MobileNav.tsx`**

```tsx
'use client';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import type { DocTree } from '@/lib/types';

export default function MobileNav({ tree }: { tree: DocTree }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(true)} aria-label="Open navigation" className="p-2">
        <Menu className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)}>
          <div
            className="absolute inset-y-0 left-0 w-80 overflow-y-auto bg-background p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-end">
              <button onClick={() => setOpen(false)} aria-label="Close navigation">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Sidebar tree={tree} />
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Modify `src/app/(docs)/layout.tsx`**

Add `MobileNav` to the top bar next to ThemeToggle:

```tsx
import MobileNav from '@/components/layout/MobileNav';
```

Change the mobile header row:

```tsx
      <div className="flex items-center justify-between border-b px-6 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <MobileNav tree={tree} />
          <span className="font-bold">Docs</span>
        </div>
        <ThemeToggle />
      </div>
```

- [ ] **Step 3: Verify build**

Run: `pnpm build`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/MobileNav.tsx src/app
git commit -m "feat: add responsive mobile drawer navigation"
```

---

## Phase 3 — Search & Command Menu

### Task 10: Build-Time Search Index + Search Dialog

**Files:**
- Create: `scripts/build-search-index.ts`
- Create: `src/lib/search.ts`
- Create: `src/components/ui/SearchDialog.tsx`
- Create: `src/app/search.json/route.ts`
- Modify: `src/app/(docs)/layout.tsx`

**Interfaces:**
- Consumes: `getAllDocs`, `SearchEntry`, `t`, `cn`.
- Produces: `buildSearchIndex()` → `SearchEntry[]`; `SearchDialog` client component with fuzzy search, keyboard navigation, highlighting; `/search.json` route serving the index.

- [ ] **Step 1: Write `src/lib/search.ts`**

```ts
import { getAllDocs } from '@/lib/content-loader';
import type { SearchEntry } from '@/lib/types';

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*`\-_[\]()!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildSearchIndex(options?: { docsDir?: string }): SearchEntry[] {
  const tree = getAllDocs(options);
  const entries: SearchEntry[] = [];
  for (const section of tree.sections) {
    for (const page of section.pages) {
      const content = stripMarkdown(page.content);
      entries.push({
        title: page.frontmatter.title,
        url: page.url,
        section: section.title,
        description: page.frontmatter.description,
        content,
      });
    }
  }
  return entries;
}
```

- [ ] **Step 2: Write `scripts/build-search-index.ts`**

```ts
import fs from 'node:fs';
import path from 'node:path';
import { buildSearchIndex } from '../src/lib/search';

const index = buildSearchIndex();
const out = path.join(process.cwd(), 'public', 'search.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(index));
console.log(`Search index: ${index.length} entries -> public/search.json`);
```

- [ ] **Step 3: Write `src/app/search.json/route.ts`**

```ts
import { buildSearchIndex } from '@/lib/search';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(buildSearchIndex());
}
```

- [ ] **Step 4: Write the failing test**

```ts
// tests/search.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { buildSearchIndex } from '@/lib/search';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'search-test-'));
  fs.mkdirSync(path.join(tmpDir, 'docs/getting-started'), { recursive: true });
  fs.writeFileSync(
    path.join(tmpDir, 'docs/getting-started/introduction.mdx'),
    `---
title: Introduction
description: Start here
---

# Introduction

Install with pnpm.
`
  );
});

describe('buildSearchIndex', () => {
  it('builds entries from pages', () => {
    const entries = buildSearchIndex({ docsDir: tmpDir + '/docs' });
    expect(entries).toHaveLength(1);
    expect(entries[0].title).toBe('Introduction');
    expect(entries[0].content).toContain('Install');
  });

  it('strips markdown syntax from content', () => {
    const entries = buildSearchIndex({ docsDir: tmpDir + '/docs' });
    expect(entries[0].content).not.toContain('#');
  });
});
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run tests/search.test.ts`
Expected: PASS.

- [ ] **Step 6: Write `src/components/ui/SearchDialog.tsx`**

```tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { SearchEntry } from '@/lib/types';

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch('/search.json')
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => {});
  }, []);

  const fuse = useMemo(
    () => new Fuse(entries, { keys: ['title', 'description', 'content'], threshold: 0.4 }),
    [entries]
  );

  const results = useMemo(() => {
    if (!query.trim()) return entries.slice(0, 8);
    return fuse.search(query).slice(0, 8).map((r) => r.item);
  }, [fuse, query, entries]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-24" onClick={onClose}>
      <div className="w-full max-w-xl rounded-xl border bg-background shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t.searchPlaceholder}
            className="w-full bg-transparent outline-none"
          />
        </div>
        <ul className="max-h-96 overflow-y-auto p-2">
          {results.map((item, index) => (
            <li key={item.url}>
              <Link
                href={item.url}
                onClick={onClose}
                className={cn(
                  'block rounded-lg px-3 py-2',
                  index === activeIndex ? 'bg-accent' : 'hover:bg-accent/50'
                )}
              >
                <span className="block text-sm font-medium">{highlight(item.title, query)}</span>
                <span className="block text-xs text-muted-foreground">{item.section}</span>
              </Link>
            </li>
          ))}
          {results.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">No results</li>}
        </ul>
      </div>
    </div>
  );
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-700">{part}</mark> : part
  );
}
```

- [ ] **Step 7: Wire ⌘K into the docs layout**

Create `src/components/ui/SearchTrigger.tsx`:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { t } from '@/lib/i18n';
import SearchDialog from '@/components/ui/SearchDialog';

export default function SearchTrigger() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground"
      >
        <Search className="h-4 w-4" />
        {t.searchPlaceholder}
        <kbd className="ml-4 rounded border px-1 text-xs">⌘K</kbd>
      </button>
      <SearchDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
```

Modify `src/app/(docs)/layout.tsx`: import `SearchTrigger`, and render it in the mobile top bar and above the main content:

```tsx
import SearchTrigger from '@/components/ui/SearchTrigger';
```

Add inside the flex container, before `<main>`:

```tsx
        <div className="flex-1">
          <div className="flex items-center justify-end p-4">
            <SearchTrigger />
          </div>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
```

Adjust the outer layout to keep Sidebar left and this column right.

- [ ] **Step 8: Verify build and search**

Run: `pnpm build`
Expected: exit 0; `/search.json` statically generated.

Run: `pnpm dev` (background) and `curl -s http://localhost:3000/search.json | head -c 200`
Expected: JSON array starting with `[{"title":"...`.

- [ ] **Step 9: Commit**

```bash
git add scripts src/lib/search.ts src/components/ui/SearchDialog.tsx src/components/ui/SearchTrigger.tsx src/app tests/search.test.ts
git commit -m "feat: add fuzzy search with cmd-k dialog"
```

---

### Task 11: Command Menu

**Files:**
- Create: `src/components/ui/CommandMenu.tsx`
- Modify: `src/components/ui/SearchTrigger.tsx` (or layout) to mount it

**Interfaces:**
- Consumes: `getAllDocs`, `t`, `useTheme`.
- Produces: `CommandMenu` using `cmdk` with navigation + actions (toggle theme, copy page MD, open GitHub).

- [ ] **Step 1: Write `src/components/ui/CommandMenu.tsx`**

```tsx
'use client';
import { useCallback, useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { Moon, Sun, Monitor, FileText, Copy, Github } from 'lucide-react';
import { t } from '@/lib/i18n';
import { githubRepoUrl } from '@/config/docs.config';
import { useTheme, type Theme } from '@/hooks/useTheme';
import { getAllDocs } from '@/lib/content-loader';
import type { DocPage } from '@/lib/types';

export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [pages, setPages] = useState<DocPage[]>([]);

  useEffect(() => {
    setPages(getAllDocs().pages);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const setThemeOption = useCallback((next: Theme) => {
    setTheme(next);
    setOpen(false);
  }, [setTheme]);

  const copyPageAsMarkdown = useCallback(async () => {
    const pathname = window.location.pathname;
    const match = pathname.match(/^(?:\/en|\/fa)?\/docs\/(.+)$/);
    const slug = match?.[1] ?? '';
    const res = await fetch(`/api/raw/${slug}`);
    await navigator.clipboard.writeText(await res.text());
    setOpen(false);
  }, []);

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Command menu">
      <Command.Input placeholder={t.searchPlaceholder} />
      <Command.List>
        <Command.Empty>No results</Command.Empty>

        <Command.Group heading="Pages">
          {pages.map((page) => (
            <Command.Item key={page.slug} value={`page:${page.frontmatter.title}`} onSelect={() => { router.push(page.url); setOpen(false); }}>
              <FileText className="mr-2 h-4 w-4" />
              {page.frontmatter.sidebarTitle ?? page.frontmatter.title}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Actions">
          <Command.Item value={`theme:${theme}`} onSelect={() => setThemeOption(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            {t.toggleTheme}
          </Command.Item>
          <Command.Item value="copy-md" onSelect={copyPageAsMarkdown}>
            <Copy className="mr-2 h-4 w-4" />
            {t.copyPageAsMarkdown}
          </Command.Item>
          <Command.Item value="github" onSelect={() => { window.open(githubRepoUrl(), '_blank'); setOpen(false); }}>
            <Github className="mr-2 h-4 w-4" />
            {t.openOnGithub}
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}
```

- [ ] **Step 2: Remove duplicate ⌘K from SearchTrigger**

Modify `src/components/ui/SearchTrigger.tsx`: remove the `useEffect` keydown handler for ⌘K and instead keep a button that opens the search dialog only. The ⌘K global shortcut now lives in CommandMenu.

- [ ] **Step 3: Mount CommandMenu in layout**

Modify `src/app/(docs)/layout.tsx`:

```tsx
import CommandMenu from '@/components/ui/CommandMenu';
```

Render `<CommandMenu />` inside the outer `div`, after the flex row.

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/CommandMenu.tsx src/components/ui/SearchTrigger.tsx src/app
git commit -m "feat: add command menu with pages and actions"
```

---

## Phase 4 — MDX Components & Assets

### Task 12: MDX Components (Callout, Tabs, Accordion, ImageZoom)

**Files:**
- Create: `src/components/mdx/Callout.tsx`
- Create: `src/components/mdx/Tabs.tsx`
- Create: `src/components/mdx/Tab.tsx`
- Create: `src/components/mdx/Accordion.tsx`
- Create: `src/components/mdx/ImageZoom.tsx`
- Modify: `src/components/mdx/MdxComponents.tsx`
- Modify: `docs/getting-started/introduction.mdx`

**Interfaces:**
- Consumes: `cn`.
- Produces: registered MDX components usable in any `.mdx` page.

- [ ] **Step 1: Write `src/components/mdx/Callout.tsx`**

```tsx
import { Info, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const styles = {
  info: { icon: Info, box: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100' },
  warning: { icon: AlertTriangle, box: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100' },
  danger: { icon: XCircle, box: 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100' },
} as const;

export default function Callout({ type = 'info', children }: { type?: keyof typeof styles; children: React.ReactNode }) {
  const { icon: Icon, box } = styles[type];
  return (
    <div className={cn('my-4 flex gap-3 rounded-lg border p-4 text-sm', box)}>
      <Icon className="h-5 w-5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/mdx/Tabs.tsx` and `Tab.tsx`**

```tsx
// src/components/mdx/Tabs.tsx
'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Tabs({ items, children }: { items: string[]; children: React.ReactNode[] }) {
  const [active, setActive] = useState(0);
  const labels = items ?? (Array.isArray(children) ? children.map((_, i) => `Tab ${i + 1}`) : ['Tab 1']);
  return (
    <div className="my-4">
      <div className="flex gap-1 border-b">
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => setActive(i)}
            className={cn(
              'border-b-2 px-4 py-2 text-sm',
              i === active ? 'border-accent-foreground font-medium' : 'border-transparent text-muted-foreground'
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="pt-4">{Array.isArray(children) ? children[active] : children}</div>
    </div>
  );
}
```

```tsx
// src/components/mdx/Tab.tsx
export default function Tab({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 3: Write `src/components/mdx/Accordion.tsx`**

```tsx
'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="my-4 rounded-lg border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium"
      >
        {title}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="border-t px-4 py-3 text-sm">{children}</div>}
    </div>
  );
}
```

- [ ] **Step 4: Write `src/components/mdx/ImageZoom.tsx`**

```tsx
'use client';
import { useState } from 'react';

export default function ImageZoom({ src, alt, width }: { src: string; alt?: string; width?: number }) {
  const [zoomed, setZoomed] = useState(false);
  return (
    <>
      <button onClick={() => setZoomed(true)} className="my-4 block">
        <img src={src} alt={alt ?? ''} width={width} className="rounded-lg border" />
      </button>
      {zoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8" onClick={() => setZoomed(false)}>
          <img src={src} alt={alt ?? ''} className="max-h-full max-w-full" />
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 5: Register components**

Modify `src/components/mdx/MdxComponents.tsx`:

```tsx
import CodeBlock from '@/components/mdx/CodeBlock';
import Callout from '@/components/mdx/Callout';
import Tabs from '@/components/mdx/Tabs';
import Tab from '@/components/mdx/Tab';
import Accordion from '@/components/mdx/Accordion';
import ImageZoom from '@/components/mdx/ImageZoom';

export const mdxComponents: Record<string, React.ComponentType<any>> = {
  pre: CodeBlock,
  Callout,
  Tabs,
  Tab,
  Accordion,
  ImageZoom,
};
```

- [ ] **Step 6: Add usage to sample content**

Append to `docs/getting-started/introduction.mdx`:

```mdx
<Callout type="warning">
  Be careful when editing content.
</Callout>

<Tabs items={['npm', 'pnpm']}>
  <div>npm install</div>
  <div>pnpm install</div>
</Tabs>

<Accordion title="Advanced configuration">
  Set the `NODE_ENV` variable.
</Accordion>
```

- [ ] **Step 7: Verify build**

Run: `pnpm build`
Expected: exit 0.

Run: `pnpm dev` (background) and `curl -s http://localhost:3000/docs/getting-started/introduction | grep -c "Be careful"`
Expected: output ≥ 1.

- [ ] **Step 8: Commit**

```bash
git add src/components/mdx docs/getting-started/introduction.mdx
git commit -m "feat: add mdx components callout tabs accordion imagezoom"
```

---

## Phase 5 — SEO, Versioning, i18n

### Task 13: SEO Metadata and Sitemap

**Files:**
- Modify: `src/app/(docs)/docs/[[...slug]]/page.tsx` (rich `generateMetadata`)
- Create: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts` (optional, skip if not needed)

**Interfaces:**
- Consumes: `docsConfig`, `getAllDocs`, `DocPage`.
- Produces: full metadata (title, description, canonical, OG, Twitter) + `/sitemap.xml`.

- [ ] **Step 1: Rewrite `generateMetadata`**

Replace in `src/app/(docs)/docs/[[...slug]]/page.tsx`:

```tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug?.join('/') ?? '');
  if (!page) return {};
  const url = `${docsConfig.siteUrl}${page.url}`;
  const description = page.frontmatter.description;
  return {
    title: page.frontmatter.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: page.frontmatter.title,
      description,
      url,
      siteName: docsConfig.projectName,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: page.frontmatter.title,
      description,
    },
  };
}
```

Add imports: `import type { Metadata } from 'next';` and `import { docsConfig } from '@/config/docs.config';`.

- [ ] **Step 2: Write `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';
import { getAllDocs } from '@/lib/content-loader';
import { docsConfig } from '@/config/docs.config';

export default function sitemap(): MetadataRoute.Sitemap {
  const tree = getAllDocs();
  return [
    { url: docsConfig.siteUrl, changeFrequency: 'daily', priority: 1 },
    ...tree.pages.map((page) => ({
      url: `${docsConfig.siteUrl}${page.url}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
```

- [ ] **Step 3: Verify build**

Run: `pnpm build`
Expected: exit 0; sitemap generated.

Run: `pnpm dev` (background) and `curl -s http://localhost:3000/sitemap.xml | grep -c "<url>"`
Expected: output ≥ 8.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/app
git commit -m "feat: add seo metadata and sitemap"
```

---

### Task 14: Versioning

**Files:**
- Modify: `src/config/docs.config.ts` (already has versions)
- Modify: `src/lib/content-loader.ts` (support version param)
- Create: `src/components/layout/VersionSelect.tsx`
- Create: `docs/v10/getting-started/introduction.mdx`
- Modify: `src/app/(docs)/docs/[[...slug]]/page.tsx`

**Interfaces:**
- Consumes: `docsConfig.versions`, `DocPage`.
- Produces: `VersionSelect` component; version-aware content loading (`getAllDocs({ version })`).

- [ ] **Step 1: Modify content loader for versions**

Versioned content lives in subdirectories of `docs/` named after the version (`docs/v10/`, `docs/v9/`), while the current (latest) content stays at the `docs/` root. Replace the loader with this complete version-aware implementation:

```ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import GithubSlugger from 'github-slugger';
import { docsConfig } from '@/config/docs.config';
import type { DocTree, DocPage, DocSection, Frontmatter, TocItem } from '@/lib/types';

const DEFAULT_DOCS_DIR = path.join(process.cwd(), docsConfig.contentDir);
const IGNORED_DIRS = new Set(['superpowers', 'node_modules', '.git', '.next']);

function versionDirs(): Set<string> {
  return new Set(docsConfig.versions.filter((v) => v !== 'latest'));
}

export function getSectionTitle(key: string): string {
  return key
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function extractTocFromSource(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];
  const lines = source.split('\n');
  let inCode = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (m) {
      toc.push({ id: slugger.slug(m[2].trim()), text: m[2].trim(), level: m[1].length });
    }
  }
  return toc;
}

function readSectionMeta(dirPath: string): { title?: string } {
  const metaPath = path.join(dirPath, '_meta.json');
  if (!fs.existsSync(metaPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch {
    return {};
  }
}

function walk(dir: string, baseDir: string, urlPrefix: string, pages: DocPage[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      if (versionDirs().has(entry.name)) continue;
      walk(fullPath, baseDir, urlPrefix, pages);
      continue;
    }
    if (!/\.mdx?$/.test(entry.name)) continue;
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);
    const relative = path.relative(baseDir, fullPath);
    const slug = relative.replace(/\.mdx?$/, '').replace(/\\/g, '/');
    const sectionKey = slug.split('/')[0];
    const frontmatter: Frontmatter = {
      title: String(data.title ?? ''),
      description: String(data.description ?? ''),
      sidebarTitle: data.sidebarTitle ? String(data.sidebarTitle) : undefined,
      order: typeof data.order === 'number' ? data.order : undefined,
      hidden: Boolean(data.hidden),
    };
    pages.push({
      slug,
      url: `${urlPrefix}/${slug}`,
      frontmatter,
      toc: extractTocFromSource(content),
      source: raw,
      content,
      section: sectionKey,
    });
  }
}

export function getAllDocs(options?: { docsDir?: string; version?: string }): DocTree {
  const version = options?.version ?? 'latest';
  const baseDir = options?.docsDir ?? (version === 'latest' ? DEFAULT_DOCS_DIR : path.join(DEFAULT_DOCS_DIR, version));
  const urlPrefix = version === 'latest' ? '/docs' : `/docs/${version}`;
  const allPages: DocPage[] = [];
  walk(baseDir, baseDir, urlPrefix, allPages);

  const visible = allPages.filter((p) => !p.frontmatter.hidden);
  const bySection = new Map<string, DocPage[]>();
  for (const page of visible) {
    if (!bySection.has(page.section)) bySection.set(page.section, []);
    bySection.get(page.section)!.push(page);
  }

  const sections: DocSection[] = [];
  for (const [key, pages] of bySection) {
    const meta = readSectionMeta(path.join(baseDir, key));
    pages.sort((a, b) => {
      const ao = a.frontmatter.order ?? Number.MAX_SAFE_INTEGER;
      const bo = b.frontmatter.order ?? Number.MAX_SAFE_INTEGER;
      if (ao !== bo) return ao - bo;
      return a.frontmatter.title.localeCompare(b.frontmatter.title);
    });
    sections.push({ key, title: meta.title ?? getSectionTitle(key), pages });
  }
  sections.sort((a, b) => a.title.localeCompare(b.title));

  return { sections, pages: visible };
}

export function getPage(slug: string, options?: { docsDir?: string; version?: string }) {
  return getAllDocs(options).pages.find((p) => p.slug === slug);
}

export function getFlatPages(tree: DocTree): DocPage[] {
  return tree.sections.flatMap((s) => s.pages);
}
```

Note: `docsConfig` imports `@/config/docs.config` in a `node`-environment test file — vitest resolves the alias, so keep passing `docsDir` in tests to stay deterministic and avoid depending on the repo's real `docs/` dir.

- [ ] **Step 2: Add a versioned sample page**

Create `docs/v10/getting-started/introduction.mdx`:

```mdx
---
title: Introduction (v10)
description: Welcome to v10 docs.
order: 1
---

# Introduction

This is the v10 version of the documentation.
```

Also add `docs/v10/getting-started/_meta.json`:
```json
{ "title": "Getting Started" }
```

- [ ] **Step 3: Write `src/components/layout/VersionSelect.tsx`**

```tsx
'use client';
import { usePathname, useRouter } from 'next/navigation';
import { docsConfig } from '@/config/docs.config';

export default function VersionSelect() {
  const pathname = usePathname();
  const router = useRouter();

  const current = detectVersion(pathname);
  const slug = stripVersion(pathname);

  const change = (version: string) => {
    const target = version === 'latest' ? `/docs/${slug}` : `/docs/${version}/${slug}`;
    router.push(target.replace(/\/$/, ''));
  };

  return (
    <select
      value={current}
      onChange={(e) => change(e.target.value)}
      className="rounded border bg-background px-2 py-1 text-sm"
    >
      {docsConfig.versions.map((v) => (
        <option key={v} value={v}>{v}</option>
      ))}
    </select>
  );
}

function detectVersion(pathname: string): string {
  const match = pathname.match(/^\/docs\/([^/]+)\//);
  if (match && docsConfig.versions.includes(match[1])) return match[1];
  return 'latest';
}

function stripVersion(pathname: string): string {
  const match = pathname.match(/^\/docs\/(?:[^/]+\/)?(.*)$/);
  return match?.[1] ?? '';
}
```

- [ ] **Step 4: Use version in the page**

Modify `src/app/(docs)/docs/[[...slug]]/page.tsx`:

```tsx
  const version = detectVersionFromSlug(slugStr);
  const pageSlug = stripVersionFromSlug(slugStr);
  const page = getPage(pageSlug, { version });
```

Add helper functions (top-level):

```ts
import { docsConfig } from '@/config/docs.config';

function detectVersionFromSlug(slugStr: string): string {
  const first = slugStr.split('/')[0];
  return docsConfig.versions.includes(first) ? first : 'latest';
}

function stripVersionFromSlug(slugStr: string): string {
  const first = slugStr.split('/')[0];
  return docsConfig.versions.includes(first) ? slugStr.split('/').slice(1).join('/') : slugStr;
}
```

Update `generateStaticParams` and `generateMetadata` to use the same helpers.

- [ ] **Step 5: Render VersionSelect in layout**

Modify `src/app/(docs)/layout.tsx`:

```tsx
import VersionSelect from '@/components/layout/VersionSelect';
```

Render `<VersionSelect />` in the desktop top area (next to the search trigger).

- [ ] **Step 6: Verify build**

Run: `pnpm build`
Expected: exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/lib/content-loader.ts src/components/layout/VersionSelect.tsx docs/v10 src/app
git commit -m "feat: add versioned docs"
```

---

### Task 15: Internationalization and RTL

**Files:**
- Modify: `src/lib/i18n.ts` (multi-locale dictionary)
- Modify: `src/app/layout.tsx` (lang from params, dir attribute)
- Create: `src/app/[lang]/layout.tsx`
- Create: `src/app/[lang]/(docs)/docs/[[...slug]]/page.tsx` (thin wrapper around shared page)
- Modify: `src/app/(docs)/docs/[[...slug]]/page.tsx` to accept a `lang` prop

**Interfaces:**
- Consumes: `docsConfig.locales`, existing page component.
- Produces: `/en/...` and `/fa/...` routes with RTL for Persian.

- [ ] **Step 1: Rewrite `src/lib/i18n.ts`**

```ts
export const dictionaries = {
  en: {
    onThisPage: 'On This Page',
    searchPlaceholder: 'Search documentation...',
    copyMd: 'Copy MD',
    copyLink: 'Copy Link',
    chatgpt: 'ChatGPT',
    github: 'GitHub',
    openIn: 'Open In',
    editOnGithub: 'Edit on GitHub',
    previous: 'Previous',
    next: 'Next',
    toggleTheme: 'Toggle theme',
    copyPageAsMarkdown: 'Copy page as Markdown',
    openOnGithub: 'Open on GitHub',
  },
  fa: {
    onThisPage: 'در این صفحه',
    searchPlaceholder: 'جستجو در مستندات...',
    copyMd: 'کپی مارک‌داون',
    copyLink: 'کپی لینک',
    chatgpt: 'چت‌جی‌پی‌تی',
    github: 'گیت‌هاب',
    openIn: 'باز کردن',
    editOnGithub: 'ویرایش در گیت‌هاب',
    previous: 'قبلی',
    next: 'بعدی',
    toggleTheme: 'تغییر تم',
    copyPageAsMarkdown: 'کپی صفحه به صورت مارک‌داون',
    openOnGithub: 'باز کردن در گیت‌هاب',
  },
} as const;

export type Locale = keyof typeof dictionaries;
export const defaultLocale: Locale = 'en';

export function getDictionary(lang: string) {
  return dictionaries[(lang as Locale) in dictionaries ? (lang as Locale) : defaultLocale];
}
```

- [ ] **Step 2: Create `src/app/[lang]/layout.tsx`**

The root layout (`src/app/layout.tsx`) already renders `<html>`/`<body>`/globals/theme script and must remain the only layout with those tags. The `[lang]` layout is a nested layout: it must NOT render its own `<html>`/`<body>`. It sets `lang`/`dir` on the document at runtime via a small client component.

```tsx
// src/app/[lang]/layout.tsx
import DirSetter from '@/components/ui/DirSetter';

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <>
      <DirSetter lang={lang} />
      {children}
    </>
  );
}
```

```tsx
// src/components/ui/DirSetter.tsx
'use client';
import { useEffect } from 'react';

export default function DirSetter({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);
  return null;
}
```

- [ ] **Step 3: Create lang-scoped docs route**

Create `src/app/[lang]/(docs)/docs/[[...slug]]/page.tsx`:

```tsx
import DocPage, {
  generateStaticParams as baseParams,
  generateMetadata as baseMetadata,
} from '@/app/(docs)/docs/[[...slug]]/page';
import { docsConfig } from '@/config/docs.config';

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const params = await baseParams();
  return docsConfig.locales.flatMap((lang) =>
    params.map((p) => ({ ...p, lang }))
  );
};

export { baseMetadata as generateMetadata };

export default async function LangDocPage(props: { params: Promise<{ lang: string; slug?: string[] }> }) {
  const { lang, slug = [] } = await props.params;
  return <DocPage params={Promise.resolve({ slug })} lang={lang} />;
}
```

This reuses the existing page logic. Because the base page currently lives under `(docs)`, the shared page must accept `lang` and prefix urls accordingly (see Step 4).

- [ ] **Step 4: Make the shared page lang-aware**

Modify `src/app/(docs)/docs/[[...slug]]/page.tsx`:
- Accept an optional `lang?: string` in props.
- Pass `lang` down to `Sidebar`/`TableOfContents`/`OpenIn` via a small context or prop so `t` uses the right dictionary. Simplest: create `src/lib/DocContext.tsx` with a React context providing `{ lang, t }`, and have child components consume it.

For brevity in this plan: `OpenIn`, `TableOfContents`, `PrevNext`, `SearchTrigger` should call `useDocLang()` (a new hook) instead of importing `t` directly. Add:

```tsx
// src/lib/DocContext.tsx
'use client';
import { createContext, useContext } from 'react';
import { getDictionary, defaultLocale } from '@/lib/i18n';

const DocContext = createContext({ lang: defaultLocale });

export function DocProvider({ lang, children }: { lang: string; children: React.ReactNode }) {
  return <DocContext.Provider value={{ lang }}>{children}</DocContext.Provider>;
}

export function useDocLang() {
  return useContext(DocContext).lang;
}
```

Then each UI component computes `const t = getDictionary(useDocLang())`.

- [ ] **Step 5: Verify build**

Run: `pnpm build`
Expected: exit 0; routes for `/en/docs/...` and `/fa/docs/...` generated.

- [ ] **Step 6: Commit**

```bash
git add src/lib/i18n.ts src/lib/DocContext.tsx src/app
git commit -m "feat: add i18n and rtl support"
```

---

## Phase 6 — Quality Tooling

### Task 16: Documentation Validation Script

**Files:**
- Create: `scripts/validate-docs.ts`
- Create: `tests/validation.test.ts`
- Create: `src/lib/validation.ts`

**Interfaces:**
- Consumes: `getAllDocs`, `getPage`.
- Produces: `validateDocs(options)` returning `{ errors, report }`; CLI script `pnpm validate-docs` with exit code.

- [ ] **Step 1: Write the failing test**

```ts
// tests/validation.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { validateDocs } from '@/lib/validation';

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'validate-test-'));
  fs.mkdirSync(path.join(tmpDir, 'docs/getting-started'), { recursive: true });
  fs.writeFileSync(
    path.join(tmpDir, 'docs/getting-started/good.mdx'),
    `---
title: Good
description: Fine
---

# Good

See [broken](#missing) and [page](/docs/nope).
`
  );
});

describe('validateDocs', () => {
  it('reports duplicate heading ids, broken anchors and broken links', () => {
    const { errors } = validateDocs({ docsDir: tmpDir + '/docs' });
    const joined = errors.join('\n');
    expect(joined).toContain('broken anchor');
    expect(joined).toContain('broken link');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/validation.test.ts`
Expected: FAIL — `@/lib/validation` missing.

- [ ] **Step 3: Write `src/lib/validation.ts`**

```ts
import { getAllDocs, getPage } from '@/lib/content-loader';
import type { DocPage } from '@/lib/types';

export function validateDocs(options?: { docsDir?: string }): { errors: string[]; pages: number } {
  const errors: string[] = [];
  const tree = getAllDocs(options);

  const idsByPage = new Map<string, Set<string>>();
  for (const page of tree.pages) {
    const seen = new Set<string>();
    for (const item of page.toc) {
      if (seen.has(item.id)) errors.push(`[${page.slug}] duplicate heading id "${item.id}"`);
      seen.add(item.id);
    }
    idsByPage.set(page.slug, seen);
  }

  for (const page of tree.pages) {
    for (const match of page.source.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)) {
      const target = match[2];
      if (!target) continue;
      if (target.startsWith('http')) continue;
      if (target.startsWith('/')) {
        const [pathPart, hash] = target.split('#');
        const slug = pathPart.replace(/^\/docs\//, '');
        const targetPage = getPage(slug, options);
        if (!targetPage) {
          errors.push(`[${page.slug}] broken link to "${target}"`);
          continue;
        }
        if (hash && !idsByPage.get(slug)?.has(hash)) {
          errors.push(`[${page.slug}] broken anchor "${target}"`);
        }
      } else if (target.startsWith('#')) {
        const hash = target.slice(1);
        if (!idsByPage.get(page.slug)?.has(hash)) {
          errors.push(`[${page.slug}] broken anchor "${target}"`);
        }
      }
    }
  }

  return { errors, pages: tree.pages.length };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run tests/validation.test.ts`
Expected: PASS.

- [ ] **Step 5: Write `scripts/validate-docs.ts`**

```ts
import { validateDocs } from '../src/lib/validation';

const { errors, pages } = validateDocs();
console.log(`\nDocumentation Build\n`);
console.log(`- ${pages} pages`);
console.log(`- ${errors.length} issues`);
if (errors.length > 0) {
  for (const error of errors) console.log(`  - ${error}`);
  console.log('\nBuild failed.');
  process.exit(1);
} else {
  console.log('\nBuild successful.');
}
```

- [ ] **Step 6: Verify script**

Run: `pnpm validate-docs`
Expected: prints page count and "Build successful." (exit 0) on the current sample content.

- [ ] **Step 7: Commit**

```bash
git add scripts/validate-docs.ts src/lib/validation.ts tests/validation.test.ts
git commit -m "feat: add documentation validation script"
```

---

## Final Integration Check

- [ ] **Step 1: Full test suite**

Run: `pnpm test`
Expected: all tests pass.

- [ ] **Step 2: Production build**

Run: `pnpm build`
Expected: exit 0, all routes generated.

- [ ] **Step 3: Lint**

Run: `pnpm lint`
Expected: no errors (fix any warnings).

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final integration pass"
```
