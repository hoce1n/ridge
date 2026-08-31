import { i as __toESM } from "../_runtime.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { S as ArrowRight, i as Search, l as Lock, m as Fingerprint, p as Github, x as Boxes } from "../_libs/lucide-react.mjs";
import { a as Logo, c as docsConfig, g as t, p as githubRepoUrl } from "./router-BLb1N_c-.mjs";
import { t as CopyButton } from "./dialog-BMxzJYea.mjs";
import { n as ThemeToggle, r as useCommandMenu, t as CommandMenu } from "./useCommandMenu-BJzUS0gx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DQgHysoM.js
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var startHref = `/${docsConfig.defaultLocale}/docs/${docsConfig.defaultVersion}/getting-started`;
var install = "npm install -g @ridge/cli";
function Home() {
	const { open, setOpen } = useCommandMenu();
	const lang = docsConfig.defaultLocale;
	const version = docsConfig.defaultVersion;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-6xl items-center gap-3 px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ms-auto flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setOpen(true),
								className: "hidden h-9 items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-3 text-sm text-muted hover:text-foreground sm:inline-flex",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3.5" }),
									"Search",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
										className: "ms-4 rounded-[var(--radius-xs)] border border-border px-1.5 py-0.5 font-mono text-[10px] text-faint",
										children: "⌘K"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: startHref,
								className: "h-9 px-3 text-sm text-muted hover:text-foreground inline-flex items-center",
								children: t(lang, "docs")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: githubRepoUrl(),
								target: "_blank",
								rel: "noreferrer",
								className: "inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-surface-2 hover:text-foreground",
								"aria-label": "GitHub",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, { lang })
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "relative overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						"aria-hidden": true,
						className: "pointer-events-none absolute inset-0 opacity-[0.35]",
						style: {
							backgroundImage: "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
							backgroundSize: "72px 72px",
							maskImage: "radial-gradient(ellipse at top, black 40%, transparent 75%)"
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto max-w-6xl px-4 pt-20 pb-16 sm:pt-28",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold tracking-[0.22em] text-faint uppercase",
								children: "Package manager"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-4 max-w-3xl font-display text-[clamp(2.6rem,6vw,5.2rem)] leading-[1.05] tracking-[-0.03em] text-balance",
								children: [
									"Install once.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
										className: "italic",
										children: "Resolve forever."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty",
								children: docsConfig.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: startHref,
									className: "inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] bg-accent px-4 text-sm font-medium text-accent-fg",
									children: [t(lang, "getStarted"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 rtl:hidden" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: githubRepoUrl(),
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-4 text-sm font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "size-4" }), t(lang, "viewSource")]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 inline-flex max-w-full items-center gap-3 rounded-[var(--radius-md)] bg-code py-2 ps-4 pe-2 font-mono text-sm shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-faint",
										children: "$"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: install
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { value: install })
								]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mx-auto grid max-w-6xl gap-4 px-4 pb-20 md:grid-cols-3",
					children: [
						{
							icon: Fingerprint,
							title: "Content-addressed",
							body: "Every package is stored by hash. Identical bytes are written once, linked everywhere, and verified on every install."
						},
						{
							icon: Lock,
							title: "A lockfile that means it",
							body: "ridge.lock records the exact graph, integrity hashes, and peer resolutions. CI either matches or fails closed."
						},
						{
							icon: Boxes,
							title: "Workspaces that nest",
							body: "Monorepos, nested packages, and isolated node_modules without hoisting surprises. One command, the whole graph."
						}
					].map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-[var(--radius-lg)] bg-surface p-5 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(feature.icon, { className: "size-5 text-accent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 text-lg font-semibold",
								children: feature.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: feature.body
							})
						]
					}, feature.title))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "mx-auto max-w-6xl px-4 pb-24",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-hidden rounded-[calc(var(--radius-md)+8px)] bg-surface p-2 shadow-[var(--shadow-elevated)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-b border-border px-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-border-strong" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-border-strong" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-border-strong" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ms-2 font-mono text-xs text-muted",
									children: "ridge.lock"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "overflow-x-auto p-5 font-mono text-[0.8rem] leading-relaxed text-muted",
							children: `lockfileVersion: 2
packages:
  "react@19.2.0":
    hash: sha512-8f3c2a1e0b…
    peers: []
  "ridge@2.4.1":
    hash: sha512-91c0aa2e…
    bins: [ridge]`
						})]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border py-8 text-center text-sm text-faint",
				children: [docsConfig.name, " documentation"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandMenu, {
				open,
				onOpenChange: setOpen,
				lang,
				version
			})
		]
	});
}
//#endregion
export { Home as component };
