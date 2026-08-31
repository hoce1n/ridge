import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as Outlet, v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as require_jsx_runtime, c as Trigger, o as Content, s as Root } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { c as Menu, i as Search, p as Github, t as X, v as ChevronRight, y as ChevronDown } from "../_libs/lucide-react.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Logo, c as docsConfig, g as t, h as switchVersionHref, i as Route$2, m as switchLocaleHref, p as githubRepoUrl, s as cn } from "./router-BLb1N_c-.mjs";
import { a as DocsProvider, c as DropdownMenuItem, d as DropdownMenuTrigger, o as DropdownMenu, p as useDocs, s as DropdownMenuContent } from "./dialog-BMxzJYea.mjs";
import { n as ThemeToggle, r as useCommandMenu, t as CommandMenu } from "./useCommandMenu-BJzUS0gx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-5S4xQs-U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function LocaleSwitcher() {
	const { lang, version, page } = useDocs();
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"aria-label": t(lang, "language"),
			className: "inline-flex h-8 items-center gap-1 rounded-[var(--radius-sm)] px-2 text-sm text-muted hover:bg-surface-2 hover:text-foreground",
			children: [docsConfig.locales.find((l) => l.code === lang)?.localName ?? lang, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
		align: "end",
		children: docsConfig.locales.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
			className: cn(item.code === lang && "bg-surface-2"),
			onSelect: () => {
				navigate({ to: switchLocaleHref(page, item.code, version) });
			},
			children: item.localName
		}, item.code))
	})] });
}
function SectionBlock({ section, activeHref }) {
	const containsActive = section.pages.some((page) => page.href === activeHref) || section.sections.some((child) => child.pages.some((page) => page.href === activeHref));
	const [open, setOpen] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (containsActive) setOpen(true);
	}, [containsActive]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
		open,
		onOpenChange: setOpen,
		className: "mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger, {
			className: "flex w-full items-center justify-between gap-2 px-2 py-1.5 text-start text-xs font-semibold tracking-widest text-faint uppercase",
			children: [section.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: cn("size-3.5 transition-transform duration-[var(--motion-fast)]", open && "rotate-90") })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "mt-1 space-y-0.5",
			children: [section.pages.map((page) => {
				const active = page.href === activeHref;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: page.href,
					className: cn("flex rounded-[var(--radius-sm)] px-2 py-1.5 text-sm leading-snug", active ? "bg-accent-soft font-medium text-foreground" : "text-muted hover:bg-surface-2 hover:text-foreground"),
					children: page.sidebarTitle
				}) }, page.href);
			}), section.sections.map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "ps-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionBlock, {
					section: child,
					activeHref
				})
			}, child.id))]
		}) })]
	});
}
function Sidebar({ onNavigate, className }) {
	const { tree, page } = useDocs();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Documentation",
		className: cn("px-3 py-4", className),
		onClick: (event) => {
			if (event.target.closest("a")) onNavigate?.();
		},
		children: tree.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionBlock, {
			section,
			activeHref: page?.href
		}, section.id))
	});
}
function VersionSwitcher() {
	const { lang, version, page } = useDocs();
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			"aria-label": t(lang, "version"),
			className: "inline-flex h-8 items-center gap-1 rounded-[var(--radius-sm)] px-2 text-sm text-muted hover:bg-surface-2 hover:text-foreground",
			children: [docsConfig.versions.find((v) => v.id === version)?.label ?? version, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
		align: "start",
		children: docsConfig.versions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
			className: cn(item.id === version && "bg-surface-2"),
			onSelect: () => {
				navigate({ to: switchVersionHref(page, lang, item.id) });
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1",
				children: item.label
			}), item.badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] uppercase tracking-wide text-faint",
				children: item.badge
			}) : null]
		}, item.id))
	})] });
}
var Sheet = Dialog;
function SheetContent({ className, children, side = "start", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-overlay data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed inset-y-0 z-50 flex w-[min(100%,20rem)] flex-col bg-background shadow-[var(--shadow-elevated)] outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", side === "start" ? "start-0 border-e border-border data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left rtl:data-[state=closed]:slide-out-to-right rtl:data-[state=open]:slide-in-from-right" : "end-0 border-s border-border data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right rtl:data-[state=closed]:slide-out-to-left rtl:data-[state=open]:slide-in-from-left", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 end-3 inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-surface-2 hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function Header() {
	const { lang, version } = useDocs();
	const { open, setOpen } = useCommandMenu();
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex h-14 max-w-[1440px] items-center gap-2 px-3 sm:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-surface-2 hover:text-foreground md:hidden",
						"aria-label": t(lang, "menu"),
						onClick: () => setMobileOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { href: `/${lang}/docs/${version}` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VersionSwitcher, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ms-auto flex items-center gap-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setOpen(true),
								className: "hidden h-9 items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-3 text-sm text-muted hover:text-foreground sm:inline-flex",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t(lang, "searchPlaceholder") }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
										className: "ms-6 rounded-[var(--radius-xs)] border border-border px-1.5 py-0.5 font-mono text-[10px] text-faint",
										children: "⌘K"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-surface-2 hover:text-foreground sm:hidden",
								"aria-label": t(lang, "searchPlaceholder"),
								onClick: () => setOpen(true),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocaleSwitcher, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: `/${lang}/docs/${version}`,
								className: "hidden h-8 items-center px-2 text-sm text-muted hover:text-foreground md:inline-flex",
								children: t(lang, "docs")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: githubRepoUrl(),
								target: "_blank",
								rel: "noreferrer",
								"aria-label": t(lang, "viewSource"),
								className: "inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-surface-2 hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, { lang })
						]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
			open: mobileOpen,
			onOpenChange: setMobileOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
				side: "start",
				className: "pt-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, { onNavigate: () => setMobileOpen(false) })
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandMenu, {
			open,
			onOpenChange: setOpen,
			lang,
			version
		})
	] });
}
function DocsShell() {
	const data = Route$2.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DocsProvider, {
		value: data,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#doc-content",
				className: "sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-sm)] focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-[1440px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-64 shrink-0 overflow-y-auto border-e border-border md:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
			})
		]
	});
}
//#endregion
export { DocsShell as component };
