# Documentation System Design

> **Status:** Approved
> **Date:** 2026-08-31

**Goal:** Build a complete, professional-grade documentation website (modeled on pnpm's docs) with a custom Next.js implementation — sidebar navigation, TOC scroll-spy, anchors, Open In panel, Edit on GitHub, search/command menu, dark mode, responsive layout, versioning, i18n/RTL, MDX components, SEO, and quality tooling.

**Architecture:** A custom Next.js 15 (App Router) + React + TypeScript application. Content lives as `.mdx` files in a `docs/` directory. A build-time content loader (no Contentlayer/next-contentlayer) parses frontmatter, headings, and folder structure into a typed page model used to generate the sidebar, TOC, prev/next links, and search index. The UI shell (sidebar, TOC, search, theme, etc.) is built by hand; the raw MDX-to-HTML parsing chain uses established libraries (remark/rehype, `@mdx-js/mdx`, `next-mdx-remote`).

**Tech Stack:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS, pnpm, `@mdx-js/mdx`, `remark-gfm`, `remark-frontmatter`, `rehype-slug`, `rehype-pretty-code`, `next-mdx-remote`.

## Global Constraints

- TypeScript throughout; no `any` leaks in the content model.
- pnpm is the only package manager.
- Content files are `.mdx` with `title` and `description` frontmatter required.
- GitHub integration is configurable via `docs.config.ts` — never hardcode repo paths in components.
- UI chrome (sidebar labels, search placeholder, etc.) is separate from page content so i18n can swap it later.
- The site must remain usable after Phase 2 while later phases are added incrementally.
- No comments in code unless asked; follow existing file conventions.
- Dark mode uses Tailwind's `class` strategy (system / light / dark).

---

## Content Model

- Pages are `.mdx` files under `docs/`, e.g. `docs/getting-started/installation.mdx`.
- Frontmatter per page:
  - `title` (required) — page title
  - `description` (required) — page summary / SEO description
  - `sidebarTitle` (optional) — override title shown in sidebar
  - `order` (optional) — manual sort weight within its section
  - `hidden` (optional) — exclude from sidebar and search
- Sidebar structure is derived from the folder layout: folders become sections, files become pages. `order` overrides alphabetical ordering.
- URL mapping: `docs/getting-started/installation.mdx` → `/docs/getting-started/installation`.
- Headings are collected at build time; each page gets a typed TOC model with slug-based anchor IDs.
- Central API `getAllDocs()` returns the typed model: `DocTree`, `DocPage`, `TocItem`, `SearchEntry`.

## File Structure

```
/workspace
├── docs/                       # content (.mdx files)
│   ├── getting-started/
│   ├── concepts/
│   └── reference/
├── src/
│   ├── app/
│   │   ├── (docs)/
│   │   │   ├── layout.tsx      # doc shell (sidebar + content + TOC)
│   │   │   └── docs/[[...slug]]/page.tsx
│   │   ├── sitemap.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── content-loader.ts   # build-time doc model
│   │   ├── mdx.ts              # MDX render wrapper
│   │   ├── search-index.ts     # search index generation
│   │   └── validation.ts       # doc quality checks
│   ├── components/
│   │   ├── layout/             # Sidebar, TOC, Header, PrevNext, OpenIn
│   │   ├── mdx/                # Callout, Tabs, Accordion, ImageZoom, CodeBlock
│   │   └── ui/                 # ThemeToggle, SearchDialog, CommandMenu, CopyButton
│   ├── hooks/
│   │   ├── useScrollSpy.ts
│   │   ├── useTheme.ts
│   │   └── useCommandMenu.ts
│   ├── config/
│   │   └── docs.config.ts      # repo, versions, locales, search settings
│   └── styles/
├── scripts/
│   ├── validate-docs.ts
│   └── build-search-index.ts
└── tests/
```

## Phase 1 — Core Shell

- Next.js 15 App Router scaffold with Tailwind, dark-mode `class` strategy.
- Content loader (`getAllDocs`) producing `DocTree` / `DocPage` / `TocItem`.
- Three-column doc layout: Sidebar | Content | On This Page.
- Sidebar: nested, collapsible sections, active-page highlight.
- TOC: "On This Page" panel with scroll-spy via `IntersectionObserver`.
- Anchors: `rehype-slug` heading IDs + hover copy-link button.
- Prev/Next navigation from the flattened tree.
- Dark mode toggle (system / light / dark), persisted, respects OS.

## Phase 2 — Content Power

- Professional code blocks: syntax highlighting, copy button, optional filename header, line numbers, highlighted lines, diff style, terminal style, tabs.
- Open In panel: Copy MD, Copy Link, ChatGPT (opens page content for ChatGPT), GitHub (opens source file).
- Edit on GitHub link generated from `docs.config.ts`.
- Responsive: mobile sidebar becomes a drawer; tablet hides TOC.

## Phase 3 — Search & Command Menu

- Build-time JSON search index (`/search-index.json`) with titles + content snippets.
- ⌘K fuzzy search dialog: title and content search, keyboard navigation, highlighting.
- Command menu on the same ⌘K surface: toggle theme, copy page as MD, open on GitHub, navigate.

## Phase 4 — MDX Components & Assets

- Global MDX component registry: `Callout`, `Tabs`, `Accordion`, `ImageZoom`.
- Assets support: images, videos, GIFs, diagrams rendered in pages.

## Phase 5 — SEO, Versioning, i18n

- Per-page metadata (title, description, canonical, Open Graph, Twitter Card) via Next.js metadata API.
- Generated `sitemap.xml`.
- Versioning: `docs/v10/`, `v9/` content dirs; `/docs/v10/installation` URLs; version switcher in header.
- i18n + RTL: `[lang]` route segment (`/en/`, `/fa/`), UI chrome translation, RTL layout for Persian.

## Phase 6 — Quality Tooling

- `validate-docs` script: broken internal links, missing pages, duplicate heading IDs, invalid frontmatter, missing metadata, invalid navigation.
- Build output reports page count, link count, and pass/fail status.

## Out of Scope (explicitly deferred)

- Analytics / feedback / changelog / API reference generation from code.
- Third-party doc frameworks (Fumadocs, Nextra, Docusaurus, Mintlify).
- Writing a Markdown parser from scratch.

## Success Criteria

- After Phase 2, the site is a usable documentation website: browse pages, sidebar navigation, TOC, code highlighting, copy MD, GitHub links, dark mode, responsive on mobile.
- After Phase 6, the full professional feature set works: search, command menu, MDX components, versioning, i18n/RTL, SEO metadata, sitemap, and the validation script passes on the sample content.
- GitHub links work purely from `docs.config.ts` values.
