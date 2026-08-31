import { i as __toESM } from "../_runtime.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as BananaSlug } from "../_libs/github-slugger.mjs";
import { t as require_dist } from "../_libs/yaml.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { B as notFound, L as redirect, _ as createRootRoute, b as useRouter, d as useRouterState, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
import { n as compile, r as visit, t as run } from "../_libs/@mdx-js/mdx+[...].mjs";
import { t as remarkGfm } from "../_libs/remark-gfm.mjs";
import { t as rehypeSlug } from "../_libs/rehype-slug.mjs";
import { t as rehypeHighlight } from "../_libs/rehype-highlight.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/content-loader-DAk8BG44.js
var import_dist = require_dist();
var docsConfig = {
	name: "Ridge",
	tagline: "The package manager that stays out of your way.",
	description: "Ridge is a content-addressable package manager for JavaScript. Deterministic installs, nested workspaces, and a store that never duplicates a byte.",
	siteUrl: "https://ridge.dev",
	github: {
		repo: "ridge-hq/ridge",
		branch: "main",
		docsPath: "docs"
	},
	defaultLocale: "en",
	locales: [{
		code: "en",
		name: "English",
		localName: "English",
		dir: "ltr"
	}, {
		code: "fa",
		name: "Persian",
		localName: "فارسی",
		dir: "rtl"
	}],
	defaultVersion: "v2",
	versions: [{
		id: "v2",
		label: "v2.4",
		badge: "latest"
	}, {
		id: "v1",
		label: "v1.9",
		badge: "legacy"
	}],
	sectionOrder: [
		"getting-started",
		"concepts",
		"guides",
		"reference"
	],
	sectionTitles: {
		en: {
			"getting-started": "Getting Started",
			concepts: "Concepts",
			guides: "Guides",
			reference: "Reference"
		},
		fa: {
			"getting-started": "شروع کار",
			concepts: "مفاهیم",
			guides: "راهنماها",
			reference: "مرجع"
		}
	}
};
function isLocale(value) {
	return docsConfig.locales.some((locale) => locale.code === value);
}
function getLocale(code) {
	return docsConfig.locales.find((locale) => locale.code === code) ?? docsConfig.locales[0];
}
function isVersion(value) {
	return docsConfig.versions.some((version) => version.id === value);
}
function docsHref(lang, version, slug = []) {
	const rest = slug.filter(Boolean).join("/");
	return rest ? `/${lang}/docs/${version}/${rest}` : `/${lang}/docs/${version}`;
}
function githubEditUrl(filePath) {
	const { repo, branch } = docsConfig.github;
	return `https://github.com/${repo}/edit/${branch}/${filePath}`;
}
function githubBlobUrl(filePath) {
	const { repo, branch } = docsConfig.github;
	return `https://github.com/${repo}/blob/${branch}/${filePath}`;
}
function githubRepoUrl() {
	return `https://github.com/${docsConfig.github.repo}`;
}
function chatgptUrl(pageUrl) {
	const prompt = `Read ${pageUrl} and help me understand this documentation. Answer questions about it clearly, citing the relevant sections.`;
	return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var messages = {
	en: {
		docs: "Docs",
		searchPlaceholder: "Search docs…",
		searchEmpty: "No results.",
		searchPages: "Pages",
		searchCommands: "Commands",
		onThisPage: "On this page",
		editOnGitHub: "Edit on GitHub",
		previous: "Previous",
		next: "Next",
		openIn: "Open in",
		copyMarkdown: "Copy page as Markdown",
		copyLink: "Copy link",
		copied: "Copied",
		openChatGPT: "Open in ChatGPT",
		openGitHub: "Open on GitHub",
		appearance: "Appearance",
		themeSystem: "System",
		themeLight: "Light",
		themeDark: "Dark",
		toggleTheme: "Toggle theme",
		menu: "Menu",
		close: "Close",
		version: "Version",
		language: "Language",
		notFoundTitle: "Page not found",
		notFoundBody: "This page is not in the current version or locale.",
		backHome: "Back to docs",
		getStarted: "Get started",
		viewSource: "GitHub",
		installLabel: "Install",
		footerNote: "Ridge documentation",
		skipToContent: "Skip to content",
		pageActions: "Page actions",
		navigateTo: "Go to"
	},
	fa: {
		docs: "اسناد",
		searchPlaceholder: "جستجو در اسناد…",
		searchEmpty: "نتیجه‌ای پیدا نشد.",
		searchPages: "صفحات",
		searchCommands: "دستورات",
		onThisPage: "در این صفحه",
		editOnGitHub: "ویرایش در گیت‌هاب",
		previous: "قبلی",
		next: "بعدی",
		openIn: "باز کردن در",
		copyMarkdown: "کپی صفحه به‌صورت مارک‌داون",
		copyLink: "کپی پیوند",
		copied: "کپی شد",
		openChatGPT: "باز کردن در ChatGPT",
		openGitHub: "باز کردن در گیت‌هاب",
		appearance: "ظاهر",
		themeSystem: "سیستم",
		themeLight: "روشن",
		themeDark: "تیره",
		toggleTheme: "تغییر پوسته",
		menu: "منو",
		close: "بستن",
		version: "نسخه",
		language: "زبان",
		notFoundTitle: "صفحه پیدا نشد",
		notFoundBody: "این صفحه در نسخه یا زبان فعلی وجود ندارد.",
		backHome: "بازگشت به اسناد",
		getStarted: "شروع کنید",
		viewSource: "گیت‌هاب",
		installLabel: "نصب",
		footerNote: "اسناد Ridge",
		skipToContent: "پرش به محتوا",
		pageActions: "اقدامات صفحه",
		navigateTo: "رفتن به"
	}
};
function t(lang, key) {
	return (lang === "fa" ? messages.fa : messages.en)[key];
}
var getting_started_default$2 = "---\ntitle: Introduction (v1)\ndescription: Ridge 1.x documentation. v1 uses a JSON lockfile and a flatter store. New projects should start on v2.\nsidebarTitle: Introduction\norder: 1\n---\n\nYou are reading **Ridge v1**. It is in maintenance mode. Bug fixes land here; features land in [v2](/en/docs/v2/getting-started).\n\n<Callout type=\"warning\" title=\"Lockfile versions do not mix\">\nA v1 `ridge.lock` (`lockfileVersion: 1`) cannot be installed with the v2 CLI unless you run `ridge migrate`. Keep the CLI on 1.9.x for this branch.\n</Callout>\n\n## What is different in v1\n\n- The lockfile is JSON, not YAML\n- `hoist` defaults to `worktree`\n- Nested workspaces are not discovered unless listed explicitly\n- `ridge gc` is opt-in in CI\n\n## Start here\n\n1. [Install v1](/en/docs/v1/getting-started/installation)\n2. [CLI](/en/docs/v1/reference/cli)\n";
var installation_default$2 = "---\ntitle: Install v1\ndescription: Install the Ridge 1.9 CLI. Use this only for repositories that still ship a v1 lockfile.\nsidebarTitle: Installation\norder: 2\n---\n\nPin the CLI to the 1.x line.\n\n```bash title=\"terminal\"\nnpm install -g @ridge/cli@1.9.4\nridge --version\n```\n\nNode 18 is supported on v1. Node 16 is not.\n\n<Callout type=\"tip\">\nWhen you are ready to move, follow the v2 [migration guide](/en/docs/v2/guides/migrate-from-npm) after running `ridge migrate` with the v2 CLI.\n</Callout>\n";
var cli_default$2 = "---\ntitle: CLI (v1)\ndescription: Command reference for Ridge 1.9. Subcommands match v2, with fewer filters and a JSON lockfile.\nsidebarTitle: CLI\norder: 1\n---\n\nv1 supports `install`, `add`, `run`, `exec`, and `why`. It does not support `--recursive` filters of the form `--filter './packages/*'`.\n\n```bash\nridge install\nridge add ms@2\nridge run test\nridge why ms\n```\n\n`--frozen` exists. `--offline` exists. `ridge gc` exists but is not implied by CI.\n\nThe current CLI is documented in [v2 CLI](/en/docs/v2/reference/cli).\n";
var content_addressing_default = "---\ntitle: Content addressing\ndescription: Packages in Ridge are stored by cryptographic hash. Identical bytes are written once and verified on every install.\nsidebarTitle: Content addressing\norder: 2\n---\n\nRidge treats a package as a bag of bytes. The address of those bytes is a SHA-512 hash. The store path is derived from the hash, not from the package name or version.\n\nClick the diagram to zoom.\n\n![Content-addressed store: registry tarball hashed into the store, then linked into two projects](/images/content-store.svg)\n\n## Why hash, not name@version\n\nNames are not identity. `left-pad@1.3.0` on Monday is not a guarantee about Tuesday. The integrity field in the lockfile is. If the tarball Ridge downloads does not match the hash, the install stops.\n\nThis is the same idea as git objects and Nix store paths, applied to `node_modules`.\n\n## The store layout\n\n```text title=\"~/.cache/ridge/store\"\nsha512/8f/3c2a1e0b…/package\nsha512/91/c0aa2e44…/package\n```\n\nThe first two hex characters are a fanout directory so a store with hundreds of thousands of packages does not dump every entry in one folder.\n\nHard links (or reflinks on copy-on-write filesystems) connect the store to each project. Deleting `node_modules` does not delete the store. `ridge gc` removes unreferenced hashes.\n\n## Verification\n\nEvery `ridge install` re-hashes the files it links unless you pass `--offline` **and** the lockfile already matches. There is no “trust the cache” mode that skips integrity.\n\n<Callout type=\"danger\" title=\"Do not share a store across trust boundaries\">\nA store is a cache of verified bytes, not a sandbox. Do not point two machines with different security postures at the same NFS store.\n</Callout>\n\n## See also\n\n- [The lockfile](/en/docs/v2/concepts/lockfile)\n- [CI](/en/docs/v2/guides/ci)\n";
var lockfile_default = "---\ntitle: The lockfile\ndescription: ridge.lock is a contract. It records the exact graph, integrity hashes, and peer resolutions Ridge will reproduce.\nsidebarTitle: The lockfile\norder: 3\n---\n\n`ridge.lock` is YAML. Ridge never writes JSON for the lockfile: diffs stay reviewable, and trailing commas are not a style debate.\n\n## Anatomy\n\n```yaml title=\"ridge.lock\" showLineNumbers {1,4-6}\nlockfileVersion: 2\nroot: .\npackages:\n  \"ms@2.1.3\":\n    hash: sha512-9c0aa2e44b1c2d3e4f506070809a1b2c3d4e5f6071809a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f708192a3b\n    url: https://registry.npmjs.org/ms/-/ms-2.1.3.tgz\n    peers: []\n```\n\n`lockfileVersion` is `2` for Ridge 2.x. v1 lockfiles use `1` and a flatter `packages` map. `ridge install` will not auto-migrate a v1 lockfile; run `ridge migrate` instead. See [Migrate from npm](/en/docs/v2/guides/migrate-from-npm).\n\n## When it changes\n\nRidge rewrites the lockfile when:\n\n- you add, remove, or update a dependency\n- a peer dependency resolution changes\n- you pass `--latest` or a range that resolves to a new version\n\nIt does **not** rewrite the lockfile because a registry published a new version of something you did not ask for.\n\n## Strict mode\n\nWith `install.strict = true` (the default in v2):\n\n- a missing lockfile is an error in CI (`CI=true`)\n- a lockfile that does not match `package.json` is an error\n- a hash mismatch is an error\n\nLocally, `ridge install` will update the lockfile and print a diff. In CI it will not. Details in the [CI guide](/en/docs/v2/guides/ci).\n\n<Accordion>\n  <AccordionItem title=\"What if two workspaces need different versions?\">\n    Ridge duplicates the package in the store under two hashes only if the bytes differ. Same bytes, one store entry, two links. Different bytes, two store entries. The lockfile lists both.\n  </AccordionItem>\n  <AccordionItem title=\"Can I edit the lockfile by hand?\">\n    You can, but you should not. Change `package.json` and run `ridge install`. Hand-edits are valid YAML until the next install rewrites them.\n  </AccordionItem>\n</Accordion>\n";
var workspaces_default$1 = "---\ntitle: Workspaces\ndescription: How Ridge discovers nested workspaces, isolates node_modules, and shares the content-addressed store across a monorepo.\nsidebarTitle: Workspaces\norder: 1\n---\n\nA **workspace** is a directory with a `package.json` that Ridge manages as part of one install. Workspaces can nest. A nested workspace is not hoisted into its parent.\n\n## Declaring workspaces\n\n```toml title=\"ridge.toml\" showLineNumbers\n[workspace]\npackages = [\"apps/*\", \"packages/*\", \"packages/experimental/*\"]\n```\n\nGlobs are matched from the repository root. Nested matches are valid: `packages/experimental/foo` is a workspace of its own, not a folder inside `packages/*`.\n\n<Callout type=\"info\">\nRidge does not read the `workspaces` field from `package.json`. Put the globs in `ridge.toml` so the layout is explicit.\n</Callout>\n\n## Isolation rules\n\n1. Each workspace gets its own `node_modules`.\n2. A dependency is linked from the store, never copied from a sibling.\n3. `hoist = \"none\"` (the default) means a package can only require what it declared.\n4. `hoist = \"worktree\"` allows a workspace to see dependencies of its descendants, never of its siblings.\n\nPhantom dependencies fail at runtime instead of resolving to whatever happened to be hoisted last week.\n\n## Nested example\n\n```text title=\"repository layout\"\napps/web\npackages/ui\npackages/experimental/shader\n```\n\n`apps/web` can depend on `packages/ui`. It cannot accidentally import `shader` unless it lists it. `shader` can depend on `ui` without being flattened into `packages/`.\n\n## Commands that respect workspaces\n\n| Command | Scope |\n| --- | --- |\n| `ridge install` | Whole worktree |\n| `ridge add lodash --filter web` | One workspace |\n| `ridge run build --recursive` | Every workspace that defines `build` |\n| `ridge why react` | Graph from the root |\n\nSee the [CLI reference](/en/docs/v2/reference/cli) for `--filter` syntax.\n";
var getting_started_default$1 = "---\ntitle: Introduction\ndescription: Ridge is a content-addressable package manager for JavaScript. This page explains what it is, why it exists, and how to read these docs.\nsidebarTitle: Introduction\norder: 1\n---\n\nRidge installs JavaScript packages from a **content-addressed store**. Every tarball is hashed, written once, and linked into projects. The lockfile is the source of truth: if the graph cannot be reproduced, the install fails.\n\n<Callout type=\"info\" title=\"Who this is for\">\nIf you maintain a monorepo, care about CI determinism, or have been bitten by phantom dependencies, start here. If you just need a command, skip to [Installation](/en/docs/v2/getting-started/installation).\n</Callout>\n\n## What Ridge does\n\n- Resolves a dependency graph from `package.json` and `ridge.lock`\n- Fetches packages into a global store keyed by integrity hash\n- Links those packages into each project with a strict `node_modules` layout\n- Refuses to proceed when the lockfile and the registry disagree\n\nIt does **not** patch `require` at runtime, rewrite your source, or invent a new package format. The output of `ridge install` is a normal Node project.\n\n## Why another package manager\n\nnpm, Yarn, and pnpm all work. Ridge exists for three constraints those tools treat as optional:\n\n1. **Bytes are identity.** Two packages with the same integrity hash are the same package. The store never keeps a second copy.\n2. **The lockfile is a contract.** A dirty lockfile is a failed install, not a warning.\n3. **Workspaces nest.** A package inside a package is still a workspace. Hoisting never crosses a workspace boundary unless you say so.\n\nRead [Content addressing](/en/docs/v2/concepts/content-addressing) and [Workspaces](/en/docs/v2/concepts/workspaces) when you want the model, not the commands.\n\n## How these docs are organized\n\n| Section | Use it for |\n| --- | --- |\n| Getting Started | Install Ridge and run the first project |\n| Concepts | The store, the lockfile, and workspace rules |\n| Guides | CI, migrations, and day-to-day recipes |\n| Reference | CLI flags and `ridge.toml` |\n\nEvery page has an **On this page** outline, an **Open in** menu (copy Markdown, copy link, ChatGPT, GitHub), and previous/next links that follow the sidebar order.\n\n## Versions and languages\n\nThese docs cover **v2** (current) and **v1** (legacy). Switch versions in the header. Persian (`فارسی`) is available for the v2 getting-started and concepts pages; the layout flips to RTL automatically.\n\n<Callout type=\"tip\" title=\"Stay on the latest\">\nNew projects should use v2. The v1 pages exist so production lockfiles from 1.x can still be read without mixing instructions.\n</Callout>\n";
var installation_default$1 = "---\ntitle: Installation\ndescription: Install the Ridge CLI with npm, pnpm, Yarn, or Bun, then verify the binary and enable corepack-style shims.\nsidebarTitle: Installation\norder: 2\n---\n\nThe CLI is published as `@ridge/cli`. Pick a package manager, install it globally (or as a project dev dependency), and confirm `ridge --version` prints `2.x`.\n\n## Prerequisites\n\n- Node.js 20.11 or newer\n- A writable cache directory (`~/.cache/ridge` on Linux, `~/Library/Caches/ridge` on macOS)\n\n<Callout type=\"warning\" title=\"Node 18 is not supported\">\nRidge v2 uses `fetch` and `glob` from Node 20. If you are pinned to Node 18, stay on [v1](/en/docs/v1/getting-started/installation).\n</Callout>\n\n## Install the CLI\n\n<Tabs items={[\"npm\", \"pnpm\", \"Yarn\", \"Bun\"]}>\n  <Tab title=\"npm\">\n\n```bash title=\"terminal\" {1} showLineNumbers\nnpm install -g @ridge/cli\nridge --version\n```\n\n  </Tab>\n  <Tab title=\"pnpm\">\n\n```bash title=\"terminal\"\npnpm add -g @ridge/cli\nridge --version\n```\n\n  </Tab>\n  <Tab title=\"Yarn\">\n\n```bash title=\"terminal\"\nyarn global add @ridge/cli\nridge --version\n```\n\n  </Tab>\n  <Tab title=\"Bun\">\n\n```bash title=\"terminal\"\nbun add -g @ridge/cli\nridge --version\n```\n\n  </Tab>\n</Tabs>\n\nProject-local installs work too. Add `@ridge/cli` to `devDependencies` and invoke it with `npx ridge` or a `package.json` script.\n\n## Enable shims\n\nRidge can install shims so `ridge` is on your `PATH` even when the package is local:\n\n```bash title=\"terminal\" terminal\n$ ridge setup\nok  wrote ~/.local/bin/ridge\nok  store  ~/.cache/ridge/store\n```\n\n## Next\n\nContinue to [Quick start](/en/docs/v2/getting-started/quick-start) to create a lockfile, or jump to [Configuration](/en/docs/v2/reference/configuration) if you already have a repo.\n";
var quick_start_default = "---\ntitle: Quick start\ndescription: Create a project, add a dependency, and inspect the lockfile Ridge writes on the first install.\nsidebarTitle: Quick start\norder: 3\n---\n\nThis walkthrough creates a tiny workspace, adds `ms`, and shows the files Ridge writes.\n\n## Create a project\n\n```bash title=\"terminal\" terminal\n$ mkdir hello-ridge && cd hello-ridge\n$ ridge init\nwrote package.json\nwrote ridge.toml\n```\n\n`ridge init` is non-interactive. It writes a `package.json` with `\"private\": true` and a default [ridge.toml](/en/docs/v2/reference/configuration).\n\n## Add a dependency\n\n```bash title=\"terminal\" {2} showLineNumbers\nridge add ms@2\nridge install\n```\n\nThe second command is implied by `ridge add`, but running it twice is safe: the store is content-addressed, so a repeat install is a no-op when the lockfile already matches.\n\n## What got written\n\n```toml title=\"ridge.toml\" showLineNumbers {3-5}\n[store]\npath = \"~/.cache/ridge/store\"\n\n[install]\nstrict = true\nhoist = \"none\"\n```\n\n```diff title=\"package.json\" diff\n {\n   \"name\": \"hello-ridge\",\n   \"private\": true,\n+  \"dependencies\": {\n+    \"ms\": \"2.1.3\"\n+  }\n }\n```\n\nThe lockfile records the resolved version and the integrity hash. See [The lockfile](/en/docs/v2/concepts/lockfile) for the full schema.\n\n<Callout type=\"tip\">\nRun `ridge why ms` when a version surprises you. It prints the shortest path from the workspace root to that package.\n</Callout>\n\n## Run a script\n\n```json title=\"package.json\"\n{\n  \"scripts\": {\n    \"start\": \"node index.js\"\n  }\n}\n```\n\n```bash\nridge run start\n```\n\n`ridge run` uses the same PATH as `ridge exec`: binaries from the current workspace, then the store, then the process environment.\n";
var ci_default = "---\ntitle: Continuous integration\ndescription: Run deterministic Ridge installs in GitHub Actions, GitLab CI, and elsewhere. Cache the store, fail on lockfile drift.\nsidebarTitle: CI\norder: 1\n---\n\nCI should never mutate `ridge.lock`. Set `CI=true` (most providers already do) and Ridge will install from the lockfile or exit non-zero.\n\n## GitHub Actions\n\n```yaml title=\".github/workflows/ci.yml\" showLineNumbers {12-18}\nname: ci\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - name: Install Ridge\n        run: npm install -g @ridge/cli\n      - name: Cache store\n        uses: actions/cache@v4\n        with:\n          path: ~/.cache/ridge/store\n          key: ridge-${{ hashFiles('ridge.lock') }}\n      - run: ridge install --frozen\n      - run: ridge run test --recursive\n```\n\n`--frozen` is redundant when `CI=true`, and explicit when it is not.\n\n## Caching rules\n\nCache **the store**, not `node_modules`. `node_modules` is a set of links. The store is the bytes. A cache key of `hashFiles('ridge.lock')` means a lockfile change cold-starts the store and nothing else.\n\n<Callout type=\"warning\">\nDo not cache `~/.cache/ridge` wholesale if you also store logs there. Cache `~/.cache/ridge/store` only.\n</Callout>\n\n## Exit codes\n\n| Code | Meaning |\n| --- | --- |\n| 0 | Graph reproduced |\n| 2 | Lockfile missing or stale |\n| 3 | Integrity mismatch |\n| 4 | Network disabled (`--offline`) and store incomplete |\n\nA job that sees exit `2` should fail the pull request, not commit a new lockfile from CI.\n";
var migrate_from_npm_default = "---\ntitle: Migrate from npm\ndescription: Convert an npm or Yarn project to Ridge without changing application code. Import the existing lockfile, then freeze it.\nsidebarTitle: Migrate from npm\norder: 2\n---\n\nRidge reads `package-lock.json` and `yarn.lock` as import sources. It does not keep them around after the first successful `ridge install`.\n\n## Import\n\n```bash title=\"terminal\" terminal\n$ cd existing-app\n$ ridge migrate --from npm\nimported 412 packages from package-lock.json\nwrote ridge.lock\n$ ridge install --frozen\n```\n\n`ridge migrate` never deletes `node_modules`. Remove it yourself after you are satisfied:\n\n```bash\nrm -rf node_modules\nridge install\n```\n\n## What changes\n\n```diff title=\"package.json\" diff\n {\n   \"name\": \"existing-app\",\n-  \"packageManager\": \"npm@10.9.0\"\n+  \"packageManager\": \"ridge@2.4.1\"\n }\n```\n\nScripts stay the same. Replace `npm ci` in CI with `ridge install --frozen`. See [CI](/en/docs/v2/guides/ci).\n\n## Peer dependency differences\n\nnpm is lenient with peers. Ridge is not. The migrate command prints every peer that npm would have warned about and Ridge will error on. Fix them in `package.json` before `--frozen` will pass.\n\n<Callout type=\"tip\" title=\"Coming from pnpm\">\npnpm lockfiles (`lockfileVersion: 9`) import cleanly. Isolated `node_modules` is already close to Ridge's default. You will mostly notice the store path and the YAML lockfile.\n</Callout>\n";
var cli_default$1 = "---\ntitle: CLI\ndescription: Command reference for the Ridge binary — install, add, run, why, gc, migrate, and global flags.\nsidebarTitle: CLI\norder: 1\n---\n\nThe binary is `ridge`. Global flags can appear before or after the subcommand.\n\n## Global flags\n\n| Flag | Default | Purpose |\n| --- | --- | --- |\n| `--dir <path>` | `.` | Repository root |\n| `--offline` | `false` | Never hit the network |\n| `--frozen` | `CI=true` | Fail if the lockfile would change |\n| `--json` | `false` | Machine-readable output |\n| `--color` | `auto` | `auto`, `always`, `never` |\n\n## `ridge install`\n\nReproduce the graph in `ridge.lock`.\n\n```bash\nridge install\nridge install --frozen\nridge install --filter web --filter ui\n```\n\n## `ridge add`\n\nAdd a dependency to the current workspace (or `--filter`).\n\n```bash\nridge add ms@2\nridge add -D typescript\nridge add @acme/ui --workspace\n```\n\n`--workspace` links a local workspace by name instead of fetching from the registry.\n\n## `ridge run` / `ridge exec`\n\n```bash\nridge run test\nridge run build --recursive\nridge exec tsc -- --noEmit\n```\n\n## `ridge why`\n\nPrint the shortest dependency path.\n\n```bash\nridge why react\nridge why react --json\n```\n\n## `ridge gc`\n\nDelete store entries that no lockfile in `--dir` references.\n\n```bash\nridge gc\nridge gc --dry-run\n```\n\n## `ridge migrate`\n\nSee [Migrate from npm](/en/docs/v2/guides/migrate-from-npm).\n\n```bash\nridge migrate --from npm\nridge migrate --from yarn\nridge migrate --from pnpm\n```\n\n## `ridge --version`\n\nPrints the CLI version. Docs for v1 live under [v1 CLI](/en/docs/v1/reference/cli).\n";
var configuration_default = "---\ntitle: Configuration\ndescription: Every key in ridge.toml — store path, install policy, registry mirrors, and workspace globs.\nsidebarTitle: Configuration\norder: 2\n---\n\nRidge reads `ridge.toml` from the repository root. Environment variables override file values. There is no user-level config file on purpose: two checkouts of the same repo must install the same graph.\n\n## Schema\n\n```toml title=\"ridge.toml\" showLineNumbers\n[store]\npath = \"~/.cache/ridge/store\"\n\n[install]\nstrict = true\nhoist = \"none\"          # \"none\" | \"worktree\"\npreferFrozen = true\n\n[registry]\nurl = \"https://registry.npmjs.org\"\ntimeoutMs = 30000\n\n[workspace]\npackages = [\"apps/*\", \"packages/*\"]\n```\n\n## Environment overrides\n\n| Variable | Overrides |\n| --- | --- |\n| `RIDGE_STORE` | `store.path` |\n| `RIDGE_REGISTRY` | `registry.url` |\n| `RIDGE_FROZEN` | `install.preferFrozen` |\n| `CI` | treated as frozen when `true` |\n\n## Hoist modes\n\n- `none` — a module can require only what it declared. Recommended.\n- `worktree` — a workspace may see dependencies of packages it contains. Useful for legacy bundlers that crawl `node_modules` from the repo root.\n\nThere is no `full` hoist. If you need npm's layout, stay on npm.\n\n<Callout type=\"warning\">\nChanging `hoist` rewrites the on-disk layout. Commit the lockfile and reinstall on every machine after the change.\n</Callout>\n\n## Related\n\n- [Workspaces](/en/docs/v2/concepts/workspaces)\n- [CLI](/en/docs/v2/reference/cli)\n";
var internal_default = "---\ntitle: Internal notes\ndescription: Hidden page used to verify that hidden frontmatter excludes a document from the sidebar and search index.\nhidden: true\norder: 99\n---\n\nThis page is intentionally hidden. It must not appear in the sidebar or in search. The validation script still loads it and checks its frontmatter.\n";
var mdx_default = "---\ntitle: MDX components\ndescription: Callouts, tabs, accordions, images, tables, and fenced code features available in Ridge documentation pages.\nsidebarTitle: MDX components\norder: 3\n---\n\nAuthoring uses MDX. The components below are registered globally — you do not import them.\n\n## Callouts\n\n<Callout type=\"info\">\nInformational asides. Use for context that should not live in the main paragraph.\n</Callout>\n\n<Callout type=\"tip\" title=\"A named tip\">\nPrefer a `title` when the default label is too generic.\n</Callout>\n\n<Callout type=\"warning\">\nBreaking changes, version gates, and “do not cache this path” notes.\n</Callout>\n\n<Callout type=\"danger\">\nIntegrity failures, trust-boundary mistakes, destructive commands.\n</Callout>\n\n## Tabs\n\n<Tabs items={[\"ridge.toml\", \"env\"]}>\n  <Tab title=\"ridge.toml\">\n\n```toml\n[store]\npath = \"~/.cache/ridge/store\"\n```\n\n  </Tab>\n  <Tab title=\"env\">\n\n```bash\nexport RIDGE_STORE=~/.cache/ridge/store\n```\n\n  </Tab>\n</Tabs>\n\n## Accordion\n\n<Accordion>\n  <AccordionItem title=\"When should I use an accordion?\">\n    For answers that most readers will skip. Keep the question in the title; keep the body short.\n  </AccordionItem>\n  <AccordionItem title=\"Can accordions nest?\">\n    They should not. Flatten the outline instead.\n  </AccordionItem>\n</Accordion>\n\n## Code fences\n\nFences accept `title`, `{line}` highlights, `showLineNumbers`, `terminal`, and `diff`.\n\n```ts title=\"src/index.ts\" {3} showLineNumbers\nimport { ms } from \"ms\";\n\nexport const wait = (n: number) => ms(`${n}s`);\n```\n\n## Images\n\nImages open a zoom dialog on click.\n\n![Ridge content store](/images/content-store.svg)\n\n## Tables and GFM\n\nTask lists and strikethroughs work:\n\n- [x] Frontmatter with `title` and `description`\n- [x] Heading anchors\n- [ ] A handwritten Markdown parser — ~~out of scope~~\n";
var workspaces_default = "---\ntitle: فضاهای کاری\ndescription: Ridge چگونه فضاهای کاری تو در تو را پیدا می‌کند، node_modules را جدا نگه می‌دارد و مخزن را بین بسته‌ها به اشتراک می‌گذارد.\nsidebarTitle: فضاهای کاری\norder: 1\n---\n\nیک **فضای کاری** پوشه‌ای با `package.json` است که Ridge آن را در یک نصب واحد مدیریت می‌کند. فضاهای کاری می‌توانند تو در تو باشند. فضای کاری داخلی به والد hoist نمی‌شود.\n\n## اعلام فضاهای کاری\n\n```toml title=\"ridge.toml\" showLineNumbers\n[workspace]\npackages = [\"apps/*\", \"packages/*\"]\n```\n\nالگوها از ریشهٔ مخزن مطابقت داده می‌شوند. مطابقت تو در تو معتبر است.\n\n<Callout type=\"info\">\nRidge فیلد `workspaces` در `package.json` را نمی‌خواند. الگوها را در `ridge.toml` بگذارید تا چیدمان صریح باشد.\n</Callout>\n\n## قواعد جداسازی\n\n1. هر فضای کاری `node_modules` خودش را دارد.\n2. وابستگی از مخزن پیوند می‌شود، نه از هم‌نیا.\n3. `hoist = \"none\"` یعنی یک بسته فقط آنچه اعلام کرده را `require` می‌کند.\n\nبرای دستورات مرتبط، [مرجع CLI](/fa/docs/v2/reference/cli) را ببینید.\n";
var getting_started_default = "---\ntitle: معرفی\ndescription: Ridge یک مدیر بسته با آدرس‌دهی محتوایی برای جاوااسکریپت است. این صفحه می‌گوید Ridge چیست و این اسناد را چطور بخوانید.\nsidebarTitle: معرفی\norder: 1\n---\n\nRidge بسته‌های جاوااسکریپت را از یک **مخزن آدرس‌دهی‌شده با محتوا** نصب می‌کند. هر tarball هش می‌شود، یک‌بار نوشته می‌شود و به پروژه‌ها پیوند می‌خورد. فایل قفل منبع حقیقت است: اگر گراف قابل بازتولید نباشد، نصب شکست می‌خورد.\n\n<Callout type=\"info\" title=\"این اسناد برای کیست\">\nاگر مونوریپو نگه می‌دارید، به قطعیت CI اهمیت می‌دهید، یا از وابستگی‌های شبح‌وار خسته شده‌اید، از اینجا شروع کنید. اگر فقط یک دستور می‌خواهید به [نصب](/fa/docs/v2/getting-started/installation) بروید.\n</Callout>\n\n## Ridge چه می‌کند\n\n- گراف وابستگی را از `package.json` و `ridge.lock` حل می‌کند\n- بسته‌ها را در مخزنی سراسری با کلید هش یکپارچگی می‌نویسد\n- آن‌ها را با چیدمان سخت‌گیرانه `node_modules` به هر پروژه پیوند می‌دهد\n- وقتی فایل قفل و رجیستری اختلاف داشته باشند، ادامه نمی‌دهد\n\nخروجی `ridge install` یک پروژه عادی Node است. Ridge سورس شما را بازنویسی نمی‌کند.\n\n## نسخه‌ها و زبان‌ها\n\nاین ترجمه روی **v2** است. از سوییچر بالای صفحه می‌توانید نسخه و زبان را عوض کنید. چیدمان فارسی به‌صورت راست‌به‌چپ است.\n";
var installation_default = "---\ntitle: نصب\ndescription: نصب CLI Ridge با npm، pnpm، Yarn یا Bun و تأیید باینری.\nsidebarTitle: نصب\norder: 2\n---\n\nCLI با نام `@ridge/cli` منتشر می‌شود. آن را سراسری نصب کنید و با `ridge --version` نسخهٔ `2.x` را ببینید.\n\n## پیش‌نیاز\n\n- Node.js ۲۰.۱۱ یا جدیدتر\n- پوشهٔ کش قابل نوشتن (`~/.cache/ridge`)\n\n<Callout type=\"warning\" title=\"Node ۱۸ پشتیبانی نمی‌شود\">\nنسخهٔ ۲ از APIهای Node ۲۰ استفاده می‌کند. اگر روی Node ۱۸ مانده‌اید، روی v1 بمانید.\n</Callout>\n\n## نصب CLI\n\n<Tabs items={[\"npm\", \"pnpm\", \"Yarn\"]}>\n  <Tab title=\"npm\">\n\n```bash title=\"terminal\"\nnpm install -g @ridge/cli\nridge --version\n```\n\n  </Tab>\n  <Tab title=\"pnpm\">\n\n```bash title=\"terminal\"\npnpm add -g @ridge/cli\nridge --version\n```\n\n  </Tab>\n  <Tab title=\"Yarn\">\n\n```bash title=\"terminal\"\nyarn global add @ridge/cli\nridge --version\n```\n\n  </Tab>\n</Tabs>\n\nبعد از نصب، [معرفی](/fa/docs/v2/getting-started) را بخوانید یا به [فضاهای کاری](/fa/docs/v2/concepts/workspaces) بروید.\n";
var cli_default = "---\ntitle: CLI\ndescription: مرجع فرمان‌های باینری Ridge — install، add، run، why و پرچم‌های سراسری.\nsidebarTitle: CLI\norder: 1\n---\n\nباینری `ridge` است. پرچم‌های سراسری می‌توانند قبل یا بعد از زیرفرمان بیایند.\n\n## پرچم‌های سراسری\n\n| پرچم | پیش‌فرض | کاربرد |\n| --- | --- | --- |\n| `--dir <path>` | `.` | ریشهٔ مخزن |\n| `--offline` | `false` | بدون شبکه |\n| `--frozen` | `CI=true` | شکست اگر فایل قفل عوض شود |\n| `--json` | `false` | خروجی ماشین‌خوان |\n\n## فرمان‌ها\n\n```bash\nridge install --frozen\nridge add ms@2\nridge run test --recursive\nridge why react\nridge gc --dry-run\n```\n\n`--filter` یک یا چند فضای کاری را محدود می‌کند. جزئیات مدل در [فضاهای کاری](/fa/docs/v2/concepts/workspaces) است.\n";
function stripInlineMarkdown(text) {
	return text.replace(/`([^`]+)`/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_~]+/g, "").trim();
}
function parseFrontmatter(raw) {
	const normalized = raw.replace(/^\uFEFF/, "");
	if (!normalized.startsWith("---")) return {
		data: {},
		content: normalized
	};
	const afterOpen = normalized.slice(3);
	const nl = afterOpen.startsWith("\r\n") ? 2 : afterOpen.startsWith("\n") ? 1 : 0;
	const rest = afterOpen.slice(nl);
	const close = rest.search(/\r?\n---[ \t]*\r?\n/);
	if (close === -1) return {
		data: {},
		content: normalized
	};
	const yamlBlock = rest.slice(0, close);
	const content = rest.slice(close).replace(/^\r?\n---[ \t]*/, "").replace(/^\r?\n/, "");
	try {
		return {
			data: (0, import_dist.parse)(yamlBlock) ?? {},
			content
		};
	} catch {
		return {
			data: {},
			content: normalized
		};
	}
}
function extractHeadings(mdx) {
	const slugger = new BananaSlug();
	const headings = [];
	let inFence = false;
	for (const line of mdx.split("\n")) {
		const fence = line.trimStart();
		if (fence.startsWith("```") || fence.startsWith("~~~")) {
			inFence = !inFence;
			continue;
		}
		if (inFence) continue;
		const match = /^(#{2,4})\s+(.+?)\s*#*\s*$/.exec(line);
		if (!match) continue;
		const level = match[1].length;
		const text = stripInlineMarkdown(match[2]);
		if (!text) continue;
		headings.push({
			id: slugger.slug(text),
			text,
			level
		});
	}
	return headings;
}
function buildToc(headings) {
	const root = [];
	const stack = [];
	for (const heading of headings) {
		const item = {
			id: heading.id,
			text: heading.text,
			level: heading.level,
			children: []
		};
		while (stack.length && stack[stack.length - 1].level >= heading.level) stack.pop();
		if (stack.length === 0) root.push(item);
		else stack[stack.length - 1].children.push(item);
		stack.push(item);
	}
	return root;
}
function toPlainText(mdx) {
	return mdx.replace(/```[\s\S]*?```/g, " ").replace(/~~~[\s\S]*?~~~/g, " ").replace(/<[^>]+>/g, " ").replace(/!\[[^\]]*]\([^)]+\)/g, " ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[#>*_`~]/g, " ").replace(/\s+/g, " ").trim();
}
function parseFrontmatterShape(data) {
	const errors = [];
	const title = typeof data.title === "string" ? data.title.trim() : "";
	const description = typeof data.description === "string" ? data.description.trim() : "";
	if (!title) errors.push("missing required frontmatter field `title`");
	if (!description) errors.push("missing required frontmatter field `description`");
	const sidebarTitle = typeof data.sidebarTitle === "string" && data.sidebarTitle.trim() ? data.sidebarTitle.trim() : void 0;
	let order;
	if (data.order !== void 0) {
		if (typeof data.order === "number" && Number.isFinite(data.order)) order = data.order;
		else errors.push("`order` must be a number");
	}
	let hidden;
	if (data.hidden !== void 0) {
		if (typeof data.hidden === "boolean") hidden = data.hidden;
		else errors.push("`hidden` must be a boolean");
	}
	return {
		frontmatter: {
			title: title || "Untitled",
			description,
			sidebarTitle,
			order,
			hidden
		},
		errors
	};
}
function parseDocSource(raw) {
	const { data, content } = parseFrontmatter(raw);
	const { frontmatter, errors } = parseFrontmatterShape(data);
	const headings = extractHeadings(content);
	return {
		frontmatter,
		body: content,
		headings,
		toc: buildToc(headings),
		plainText: toPlainText(content),
		errors
	};
}
var rawModules = /* #__PURE__ */ Object.assign({
	"../../docs/en/v1/getting-started/index.mdx": getting_started_default$2,
	"../../docs/en/v1/getting-started/installation.mdx": installation_default$2,
	"../../docs/en/v1/reference/cli.mdx": cli_default$2,
	"../../docs/en/v2/concepts/content-addressing.mdx": content_addressing_default,
	"../../docs/en/v2/concepts/lockfile.mdx": lockfile_default,
	"../../docs/en/v2/concepts/workspaces.mdx": workspaces_default$1,
	"../../docs/en/v2/getting-started/index.mdx": getting_started_default$1,
	"../../docs/en/v2/getting-started/installation.mdx": installation_default$1,
	"../../docs/en/v2/getting-started/quick-start.mdx": quick_start_default,
	"../../docs/en/v2/guides/ci.mdx": ci_default,
	"../../docs/en/v2/guides/migrate-from-npm.mdx": migrate_from_npm_default,
	"../../docs/en/v2/reference/cli.mdx": cli_default$1,
	"../../docs/en/v2/reference/configuration.mdx": configuration_default,
	"../../docs/en/v2/reference/internal.mdx": internal_default,
	"../../docs/en/v2/reference/mdx.mdx": mdx_default,
	"../../docs/fa/v2/concepts/workspaces.mdx": workspaces_default,
	"../../docs/fa/v2/getting-started/index.mdx": getting_started_default,
	"../../docs/fa/v2/getting-started/installation.mdx": installation_default,
	"../../docs/fa/v2/reference/cli.mdx": cli_default
});
function normalizeGlobPath(key) {
	return key.replace(/\\/g, "/").replace(/^\.\.\/\.\.\//, "");
}
function parseFilePath(filePath) {
	const match = /^docs\/([^/]+)\/([^/]+)\/(.+)\.mdx$/.exec(filePath);
	if (!match) return null;
	const lang = match[1];
	const version = match[2];
	if (!isLocale(lang)) return null;
	const parts = match[3].split("/").filter(Boolean);
	if (parts.length === 0) return null;
	if (parts[parts.length - 1] === "index") parts.pop();
	return {
		filePath,
		lang,
		version,
		slug: parts,
		raw: ""
	};
}
function collectFiles() {
	const files = [];
	for (const [key, raw] of Object.entries(rawModules)) {
		const parsed = parseFilePath(normalizeGlobPath(key));
		if (!parsed) continue;
		files.push({
			...parsed,
			raw
		});
	}
	return files;
}
function comparePages(a, b) {
	if (a.order !== b.order) return a.order - b.order;
	return a.sidebarTitle.localeCompare(b.sidebarTitle);
}
function buildPages() {
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
			headings: parsed.headings
		};
	});
}
var allPages = buildPages();
function sectionTitle(lang, id) {
	const locale = isLocale(lang) ? lang : "en";
	return docsConfig.sectionTitles[locale][id] ?? id.replace(/-/g, " ");
}
function nestSections(lang, pages) {
	const visible = pages.filter((page) => !page.hidden);
	const bySection = /* @__PURE__ */ new Map();
	for (const page of visible) {
		const sectionId = page.slug[0] ?? "pages";
		const list = bySection.get(sectionId) ?? [];
		list.push(page);
		bySection.set(sectionId, list);
	}
	return [...docsConfig.sectionOrder.filter((id) => bySection.has(id)), ...[...bySection.keys()].filter((id) => !docsConfig.sectionOrder.includes(id))].map((id) => {
		const sectionPages = (bySection.get(id) ?? []).slice().sort(comparePages);
		const topLevel = [];
		const nested = /* @__PURE__ */ new Map();
		for (const page of sectionPages) if (page.slug.length <= 2) topLevel.push(page);
		else {
			const nestedId = page.slug[1];
			const list = nested.get(nestedId) ?? [];
			list.push(page);
			nested.set(nestedId, list);
		}
		const sections = [...nested.entries()].map(([nestedId, nestedPages]) => ({
			id: `${id}/${nestedId}`,
			title: nestedId.replace(/-/g, " "),
			pages: nestedPages.slice().sort(comparePages),
			sections: []
		}));
		return {
			id,
			title: sectionTitle(lang, id),
			pages: topLevel,
			sections
		};
	});
}
var treeCache = /* @__PURE__ */ new Map();
function getAllDocs() {
	return allPages;
}
function getDocTree(lang, version) {
	const key = `${lang}:${version}`;
	const cached = treeCache.get(key);
	if (cached) return cached;
	const pages = allPages.filter((page) => page.lang === lang && page.version === version).slice().sort(comparePages);
	if (pages.length === 0) return null;
	const visible = pages.filter((page) => !page.hidden);
	const tree = {
		lang,
		version,
		sections: nestSections(lang, pages),
		pages: visible
	};
	treeCache.set(key, tree);
	return tree;
}
function getDocPage(lang, version, slug) {
	const normalized = slug.filter(Boolean);
	return allPages.find((page) => page.lang === lang && page.version === version && page.slug.length === normalized.length && page.slug.every((part, i) => part === normalized[i]));
}
function getNeighbors(lang, version, slug) {
	const tree = getDocTree(lang, version);
	if (!tree) return {
		prev: null,
		next: null
	};
	const index = tree.pages.findIndex((page) => page.slug.length === slug.length && page.slug.every((part, i) => part === slug[i]));
	if (index === -1) return {
		prev: null,
		next: null
	};
	const toNeighbor = (page) => page ? {
		href: page.href,
		title: page.title,
		sidebarTitle: page.sidebarTitle
	} : null;
	return {
		prev: toNeighbor(tree.pages[index - 1]),
		next: toNeighbor(tree.pages[index + 1])
	};
}
function getSearchIndex() {
	return allPages.filter((page) => !page.hidden).map((page) => {
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
			version: page.version
		};
	});
}
function firstPageHref(lang, version) {
	return getDocTree(lang, version)?.pages[0]?.href ?? null;
}
function availableVersions(lang) {
	const set = new Set(allPages.filter((page) => page.lang === lang).map((page) => page.version));
	return docsConfig.versions.map((v) => v.id).filter((id) => set.has(id));
}
function switchVersionHref(page, lang, nextVersion) {
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
function switchLocaleHref(page, nextLang, version) {
	if (page) {
		const match = getDocPage(nextLang, version, page.slug);
		if (match) return match.href;
	}
	const fallbackVersion = getDocTree(nextLang, version)?.version ?? availableVersions(nextLang)[0] ?? docsConfig.defaultVersion;
	return firstPageHref(nextLang, fallbackVersion) ?? docsHref(nextLang, fallbackVersion);
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-BLb1N_c-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function TooltipProvider({ children, delayDuration = 200 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration,
		children
	});
}
function RidgeMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-7", className),
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "32",
			height: "32",
			rx: "8",
			className: "fill-foreground"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M6 22 L12 12 L16 18 L20 10 L26 22",
			fill: "none",
			className: "stroke-background",
			strokeWidth: "2.2",
			strokeLinejoin: "round",
			strokeLinecap: "round"
		})]
	});
}
function Logo({ href = "/", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: href,
		className: cn("flex items-center gap-2.5 text-foreground", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RidgeMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-xl tracking-tight",
			children: "Ridge"
		})]
	});
}
function NotFoundPage() {
	const href = `/${docsConfig.defaultLocale}/docs/${docsConfig.defaultVersion}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-4 px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: t("en", "notFoundTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: t("en", "notFoundBody")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: href,
				className: "mt-2 inline-flex h-10 items-center rounded-[var(--radius-sm)] bg-accent px-4 text-sm font-medium text-accent-fg",
				children: t("en", "backHome")
			})
		]
	});
}
var styles_default = "/assets/styles-B2iGQ8mz.css";
var THEME_BOOT = `(function(){try{var t=localStorage.getItem("ridge-theme")||"system";var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
var Route$9 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: `${docsConfig.name} · ${docsConfig.tagline}` },
			{
				name: "description",
				content: docsConfig.description
			},
			{
				name: "theme-color",
				content: "#0e0e10"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;1,6..72,500&family=Outfit:wght@400;500;600;700&display=swap"
			}
		]
	}),
	component: RootComponent,
	errorComponent: AppErrorComponent,
	notFoundComponent: NotFoundPage
});
function RootComponent() {
	const first = useRouterState({ select: (s) => s.location.pathname }).split("/").filter(Boolean)[0] ?? "";
	const locale = getLocale(isLocale(first) ? first : docsConfig.defaultLocale);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: locale.code,
		dir: locale.dir,
		suppressHydrationWarning: true,
		className: "antialiased",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: THEME_BOOT } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-dvh bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$6 = () => import("./routes-DQgHysoM.mjs");
var Route$8 = createFileRoute("/")({
	head: () => ({ meta: [{ title: `${docsConfig.name} · ${docsConfig.tagline}` }, {
		name: "description",
		content: docsConfig.description
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var Route$7 = createFileRoute("/search-index.json")({ server: { handlers: { GET: async () => {
	return Response.json(getSearchIndex(), { headers: { "cache-control": "public, max-age=3600" } });
} } } });
function xmlEscape(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
var Route$6 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const pages = getAllDocs().filter((page) => !page.hidden);
	const body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" + [`${docsConfig.siteUrl}/`, ...pages.map((page) => `${docsConfig.siteUrl}${page.href}`)].map((url) => {
		return "  <url><loc>" + xmlEscape(url) + "</loc><changefreq>weekly</changefreq></url>";
	}).join("\n") + "\n</urlset>\n";
	return new Response(body, { headers: {
		"content-type": "application/xml; charset=utf-8",
		"cache-control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$5 = () => import("../_lang-u-MiBS1U.mjs");
var Route$5 = createFileRoute("/$lang/")({
	beforeLoad: ({ params }) => {
		if (!isLocale(params.lang)) throw notFound();
		const href = firstPageHref(params.lang, docsConfig.defaultVersion) ?? `/${params.lang}/docs/${docsConfig.defaultVersion}`;
		throw redirect({ to: href });
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./docs-DeiNkGsS.mjs");
var Route$4 = createFileRoute("/docs/")({
	beforeLoad: () => {
		const href = firstPageHref(docsConfig.defaultLocale, docsConfig.defaultVersion) ?? `/${docsConfig.defaultLocale}/docs/${docsConfig.defaultVersion}`;
		throw redirect({ to: href });
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./docs-CZQKev0r.mjs");
var Route$3 = createFileRoute("/$lang/docs/")({
	beforeLoad: ({ params }) => {
		if (!isLocale(params.lang)) throw notFound();
		const href = firstPageHref(params.lang, docsConfig.defaultVersion) ?? `/${params.lang}/docs/${docsConfig.defaultVersion}`;
		throw redirect({ to: href });
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./route-5S4xQs-U.mjs");
var Route$2 = createFileRoute("/$lang/docs/$version")({
	beforeLoad: ({ params }) => {
		if (!isLocale(params.lang) || !isVersion(params.version)) throw notFound();
	},
	loader: ({ params, location }) => {
		const tree = getDocTree(params.lang, params.version);
		if (!tree) throw notFound();
		const prefix = `/${params.lang}/docs/${params.version}`;
		const rest = location.pathname.slice(prefix.length).split("/").filter(Boolean);
		const page = getDocPage(params.lang, params.version, rest) ?? null;
		return {
			tree,
			lang: params.lang,
			version: params.version,
			page
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_version-DxaduLew.mjs");
var Route$1 = createFileRoute("/$lang/docs/$version/")({
	beforeLoad: ({ params }) => {
		const href = firstPageHref(params.lang, params.version);
		if (!href) return;
		throw redirect({ to: href });
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
function parseHighlight(expr) {
	const lines = [];
	for (const part of expr.split(",")) {
		const range = part.trim();
		const dash = range.match(/^(\d+)-(\d+)$/);
		if (dash) {
			const start = Number(dash[1]);
			const end = Number(dash[2]);
			for (let i = start; i <= end; i += 1) lines.push(i);
			continue;
		}
		if (/^\d+$/.test(range)) lines.push(Number(range));
	}
	return lines;
}
function parseCodeMeta(meta, lang) {
	const raw = meta ?? "";
	const titleMatch = raw.match(/title="([^"]+)"/) ?? raw.match(/filename="([^"]+)"/) ?? raw.match(/(?:title|filename)=([^\s]+)/);
	const highlightMatch = raw.match(/\{([^}]+)\}/);
	const langNorm = (lang ?? "").toLowerCase();
	return {
		title: titleMatch?.[1],
		highlight: highlightMatch ? parseHighlight(highlightMatch[1]) : [],
		showLineNumbers: /\b(showLineNumbers|lineNumbers)\b/.test(raw),
		terminal: /\b(terminal|console)\b/.test(raw) || langNorm === "terminal" || langNorm === "console",
		diff: /\bdiff\b/.test(raw) || langNorm === "diff"
	};
}
function rehypeCodeMeta() {
	return (tree) => {
		visit(tree, "element", (node) => {
			if (node.tagName !== "pre") return;
			const code = node.children?.find((child) => child.tagName === "code");
			if (!code) return;
			const className = code.properties?.className;
			const lang = (Array.isArray(className) ? className.map(String) : typeof className === "string" ? className.split(" ") : []).find((c) => c.startsWith("language-"))?.replace("language-", "") ?? "";
			const parsed = parseCodeMeta(String(code.properties?.meta ?? code.properties?.["data-title"] ?? node.properties?.meta ?? ""), lang);
			const fromCode = code.properties ?? {};
			node.properties = {
				...node.properties,
				"data-language": String(fromCode["data-language"] ?? lang),
				"data-title": String(fromCode["data-title"] ?? parsed.title ?? ""),
				"data-line-numbers": String(fromCode["data-line-numbers"] ?? (parsed.showLineNumbers ? "true" : "false")),
				"data-highlight": String(fromCode["data-highlight"] ?? parsed.highlight.join(",")),
				"data-terminal": String(fromCode["data-terminal"] ?? (parsed.terminal ? "true" : "false")),
				"data-diff": String(fromCode["data-diff"] ?? (parsed.diff ? "true" : "false"))
			};
		});
	};
}
function remarkCodeToHastMeta() {
	return (tree) => {
		visit(tree, "code", (node) => {
			const parsed = parseCodeMeta(node.meta, node.lang);
			node.data = node.data ?? {};
			node.data.hProperties = {
				...node.data.hProperties,
				meta: node.meta ?? "",
				"data-language": node.lang ?? "",
				"data-title": parsed.title ?? "",
				"data-line-numbers": parsed.showLineNumbers ? "true" : "false",
				"data-highlight": parsed.highlight.join(","),
				"data-terminal": parsed.terminal ? "true" : "false",
				"data-diff": parsed.diff ? "true" : "false"
			};
		});
	};
}
var compileCache = /* @__PURE__ */ new Map();
async function compileMdx(source) {
	const cached = compileCache.get(source);
	if (cached) return cached;
	const compiled = String(await compile(source, {
		outputFormat: "function-body",
		development: false,
		remarkPlugins: [remarkGfm, remarkCodeToHastMeta],
		rehypePlugins: [
			rehypeSlug,
			rehypeHighlight,
			rehypeCodeMeta
		]
	}));
	compileCache.set(source, compiled);
	return compiled;
}
var runCache = /* @__PURE__ */ new Map();
function runMdx(compiled) {
	const cached = runCache.get(compiled);
	if (cached) return cached;
	const pending = run(compiled, {
		...import_jsx_runtime,
		baseUrl: import.meta.url
	}).then((mod) => mod.default);
	runCache.set(compiled, pending);
	return pending;
}
var $$splitComponentImporter = () => import("../_-CEidfXnx.mjs");
var Route = createFileRoute("/$lang/docs/$version/$")({
	loader: async ({ params }) => {
		const slug = (params._splat ?? "").split("/").filter(Boolean);
		const page = getDocPage(params.lang, params.version, slug);
		if (!page) throw notFound();
		return {
			compiled: await compileMdx(page.body),
			page
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return {};
		const { page } = loaderData;
		return {
			meta: [{ title: `${page.title} · ${docsConfig.name}` }, {
				name: "description",
				content: page.description
			}],
			links: [{
				rel: "canonical",
				href: `${docsConfig.siteUrl}${page.href}`
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var SearchIndexDotjsonRoute = Route$7.update({
	id: "/search-index.json",
	path: "/search-index.json",
	getParentRoute: () => Route$9
});
var SitemapDotxmlRoute = Route$6.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$9
});
var LangIndexRoute = Route$5.update({
	id: "/$lang/",
	path: "/$lang/",
	getParentRoute: () => Route$9
});
var DocsIndexRoute = Route$4.update({
	id: "/docs/",
	path: "/docs/",
	getParentRoute: () => Route$9
});
var LangDocsIndexRoute = Route$3.update({
	id: "/$lang/docs/",
	path: "/$lang/docs/",
	getParentRoute: () => Route$9
});
var LangDocsVersionRouteRoute = Route$2.update({
	id: "/$lang/docs/$version",
	path: "/$lang/docs/$version",
	getParentRoute: () => Route$9
});
var LangDocsVersionIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => LangDocsVersionRouteRoute
});
var LangDocsVersionRouteRouteChildren = {
	LangDocsVersionSplatRoute: Route.update({
		id: "/$",
		path: "/$",
		getParentRoute: () => LangDocsVersionRouteRoute
	}),
	LangDocsVersionIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	SearchIndexDotjsonRoute,
	SitemapDotxmlRoute,
	LangIndexRoute,
	DocsIndexRoute,
	LangDocsVersionRouteRoute: LangDocsVersionRouteRoute._addFileChildren(LangDocsVersionRouteRouteChildren),
	LangDocsIndexRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		scrollRestoration: true
	});
}
//#endregion
export { Logo as a, docsConfig as c, githubBlobUrl as d, githubEditUrl as f, t as g, switchVersionHref as h, Route$2 as i, getNeighbors as l, switchLocaleHref as m, Route as n, chatgptUrl as o, githubRepoUrl as p, runMdx as r, cn as s, router_exports as t, getSearchIndex as u };
