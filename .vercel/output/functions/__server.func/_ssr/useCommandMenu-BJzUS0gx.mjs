import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { h as FileText, i as Search, o as Moon, p as Github, r as Sun, s as Monitor } from "../_libs/lucide-react.mjs";
import { d as githubBlobUrl, g as t, p as githubRepoUrl, s as cn, u as getSearchIndex } from "./router-BLb1N_c-.mjs";
import { c as DropdownMenuItem, d as DropdownMenuTrigger, f as copyText, i as DialogTitle, l as DropdownMenuLabel, m as useDocsOptional, n as Dialog, o as DropdownMenu, r as DialogContent, s as DropdownMenuContent } from "./dialog-BMxzJYea.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
import { t as entry_default } from "../_libs/fuse.js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useCommandMenu-BJzUS0gx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
var STORAGE_KEY = "ridge-theme";
function getSystemTheme() {
	if (typeof window === "undefined") return "light";
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function readStoredTheme() {
	if (typeof window === "undefined") return "system";
	const value = window.localStorage.getItem(STORAGE_KEY);
	if (value === "light" || value === "dark" || value === "system") return value;
	return "system";
}
function resolveTheme(theme) {
	return theme === "system" ? getSystemTheme() : theme;
}
function applyTheme(theme) {
	const resolved = resolveTheme(theme);
	document.documentElement.classList.toggle("dark", resolved === "dark");
	document.documentElement.style.colorScheme = resolved;
}
function useTheme() {
	const [theme, setThemeState] = (0, import_react.useState)("system");
	const [resolved, setResolved] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const stored = readStoredTheme();
		setThemeState(stored);
		setResolved(resolveTheme(stored));
		applyTheme(stored);
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => {
			if (readStoredTheme() === "system") {
				setResolved(getSystemTheme());
				applyTheme("system");
			}
		};
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, []);
	const setTheme = (0, import_react.useCallback)((next) => {
		setThemeState(next);
		setResolved(resolveTheme(next));
		window.localStorage.setItem(STORAGE_KEY, next);
		applyTheme(next);
	}, []);
	return {
		theme,
		resolved,
		setTheme,
		cycleTheme: (0, import_react.useCallback)(() => {
			const order = [
				"system",
				"light",
				"dark"
			];
			const index = order.indexOf(theme);
			setTheme(order[(index + 1) % order.length]);
		}, [setTheme, theme])
	};
}
var fuse = null;
function getFuse() {
	if (!fuse) fuse = new entry_default(getSearchIndex(), {
		includeMatches: true,
		threshold: .38,
		ignoreLocation: true,
		minMatchCharLength: 2,
		keys: [
			{
				name: "title",
				weight: .45
			},
			{
				name: "headings",
				weight: .25
			},
			{
				name: "description",
				weight: .2
			},
			{
				name: "snippet",
				weight: .1
			}
		]
	});
	return fuse;
}
function searchDocs(query, lang, version, limit = 8) {
	const trimmed = query.trim();
	if (!trimmed) return [];
	return getFuse().search(trimmed).map((result) => ({
		entry: result.item,
		score: result.score ?? 1
	})).filter((hit) => hit.entry.lang === lang && hit.entry.version === version).slice(0, limit);
}
function CommandMenu({ open, onOpenChange, lang, version }) {
	const navigate = useNavigate();
	const docs = useDocsOptional();
	const { cycleTheme, resolved } = useTheme();
	const [query, setQuery] = (0, import_react.useState)("");
	const hits = (0, import_react.useMemo)(() => query.trim() ? searchDocs(query, lang, version, 8) : [], [
		query,
		lang,
		version
	]);
	const browse = (0, import_react.useMemo)(() => getSearchIndex().filter((entry) => entry.lang === lang && entry.version === version).slice(0, 8), [lang, version]);
	const go = (href) => {
		onOpenChange(false);
		setQuery("");
		navigate({ to: href });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => {
			onOpenChange(next);
			if (!next) setQuery("");
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			showClose: false,
			className: "top-[18%] overflow-hidden p-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "sr-only",
				children: t(lang, "searchPlaceholder")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e, {
				shouldFilter: false,
				className: "bg-surface",
				loop: true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border px-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-faint" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
							value: query,
							onValueChange: setQuery,
							placeholder: t(lang, "searchPlaceholder"),
							className: "h-12 w-full bg-transparent text-sm outline-none placeholder:text-faint"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "hidden rounded-[var(--radius-xs)] border border-border px-1.5 py-0.5 font-mono text-[10px] text-faint sm:inline",
							children: "ESC"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.List, {
					className: "max-h-[min(24rem,60dvh)] overflow-y-auto p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
							className: "px-2 py-6 text-center text-sm text-muted",
							children: t(lang, "searchEmpty")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
							heading: t(lang, "searchPages"),
							className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-faint [&_[cmdk-group-heading]]:uppercase",
							children: (query.trim() ? hits.map((h) => h.entry) : browse).map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
								value: entry.href,
								onSelect: () => go(entry.href),
								className: "flex cursor-pointer flex-col gap-0.5 rounded-[var(--radius-sm)] px-2 py-2 text-sm data-[selected=true]:bg-surface-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: entry.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted",
									children: [entry.section, entry.description ? ` · ${entry.description}` : ""]
								})]
							}, entry.href))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Group, {
							heading: t(lang, "searchCommands"),
							className: "mt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-faint [&_[cmdk-group-heading]]:uppercase",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									onSelect: () => {
										cycleTheme();
										onOpenChange(false);
									},
									className: "flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-sm data-[selected=true]:bg-surface-2",
									children: [resolved === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-4" }), t(lang, "toggleTheme")]
								}),
								docs?.page ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									onSelect: async () => {
										await copyText(docs.page?.raw ?? "");
										onOpenChange(false);
									},
									className: "flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-sm data-[selected=true]:bg-surface-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), t(lang, "copyMarkdown")]
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_e.Item, {
									onSelect: () => {
										const href = docs?.page ? githubBlobUrl(docs.page.filePath) : githubRepoUrl();
										window.open(href, "_blank", "noreferrer");
										onOpenChange(false);
									},
									className: "flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-sm data-[selected=true]:bg-surface-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "size-4" }), t(lang, "openGitHub")]
								})
							]
						})
					]
				})]
			})]
		})
	});
}
function ThemeToggle({ lang }) {
	const { theme, resolved, setTheme } = useTheme();
	const Icon = resolved === "dark" ? Moon : Sun;
	const items = [
		{
			id: "system",
			label: t(lang, "themeSystem"),
			icon: Monitor
		},
		{
			id: "light",
			label: t(lang, "themeLight"),
			icon: Sun
		},
		{
			id: "dark",
			label: t(lang, "themeDark"),
			icon: Moon
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": t(lang, "appearance"),
			className: "inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: t(lang, "appearance") }), items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
			onSelect: () => setTheme(item.id),
			className: cn(theme === item.id && "bg-surface-2"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
		}, item.id))]
	})] });
}
function useCommandMenu() {
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const target = event.target;
			const inField = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setOpen((value) => !value);
				return;
			}
			if (event.key === "/" && !inField && !event.metaKey && !event.ctrlKey) {
				event.preventDefault();
				setOpen(true);
			}
			if (event.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return {
		open,
		setOpen
	};
}
//#endregion
export { ThemeToggle as n, useCommandMenu as r, CommandMenu as t };
