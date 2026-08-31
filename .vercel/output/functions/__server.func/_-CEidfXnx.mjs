import { i as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { S as require_jsx_runtime, a as Trigger2, i as Root2, n as Header, r as Item, t as Content2 } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { C as ArrowLeft, S as ArrowRight, _ as Copy, a as OctagonAlert, b as Check, d as Lightbulb, f as Info, g as ExternalLink, h as FileText, n as TriangleAlert, p as Github, u as Link$1, y as ChevronDown } from "./_libs/lucide-react.mjs";
import { c as docsConfig, d as githubBlobUrl, f as githubEditUrl, g as t, l as getNeighbors, n as Route, o as chatgptUrl, r as runMdx, s as cn } from "./_ssr/router-BLb1N_c-.mjs";
import { c as DropdownMenuItem, d as DropdownMenuTrigger, f as copyText, i as DialogTitle, n as Dialog, o as DropdownMenu, p as useDocs, r as DialogContent, s as DropdownMenuContent, t as CopyButton, u as DropdownMenuSeparator } from "./_ssr/dialog-BMxzJYea.mjs";
import { i as Trigger, n as List, r as Root2$1, t as Content } from "./_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_-CEidfXnx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = /* @__PURE__ */ __toESM(require_jsx_runtime());
function OpenIn() {
	const { page, lang } = useDocs();
	const [copied, setCopied] = (0, import_react.useState)(null);
	if (!page) return null;
	const mark = (kind) => {
		setCopied(kind);
		window.setTimeout(() => setCopied(null), 1400);
	};
	const pageUrl = `${docsConfig.siteUrl}${page.href}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "inline-flex h-8 items-center gap-1 rounded-[var(--radius-sm)] border border-border bg-surface px-2.5 text-xs font-medium text-muted hover:text-foreground",
			children: [t(lang, "openIn"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-56",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: async (event) => {
					event.preventDefault();
					if (await copyText(page.raw)) mark("md");
				},
				children: [copied === "md" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" }), copied === "md" ? t(lang, "copied") : t(lang, "copyMarkdown")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: async (event) => {
					event.preventDefault();
					const url = typeof window !== "undefined" ? window.location.href : pageUrl;
					if (await copyText(url)) mark("link");
				},
				children: [copied === "link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied === "link" ? t(lang, "copied") : t(lang, "copyLink")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: chatgptUrl(pageUrl),
					target: "_blank",
					rel: "noreferrer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), t(lang, "openChatGPT")]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: githubBlobUrl(page.filePath),
					target: "_blank",
					rel: "noreferrer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "size-4" }), t(lang, "openGitHub")]
				})
			})
		]
	})] });
}
function PrevNext() {
	const { page, lang, version } = useDocs();
	if (!page) return null;
	const { prev, next } = getNeighbors(lang, version, page.slug);
	if (!prev && !next) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "mt-14 grid gap-3 border-t border-border pt-8 sm:grid-cols-2",
		children: [prev ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: prev.href,
			className: "group flex flex-col gap-1 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 hover:border-border-strong",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1 text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5 rtl:hidden" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "hidden size-3.5 rtl:block" }),
					t(lang, "previous")
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: prev.sidebarTitle
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: next.href,
			className: "group flex flex-col items-end gap-1 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-end hover:border-border-strong",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1 text-xs text-muted",
				children: [
					t(lang, "next"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5 rtl:hidden" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "hidden size-3.5 rtl:block" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: next.sidebarTitle
			})]
		}) : null]
	});
}
function useScrollSpy(ids, offset = 96) {
	const [activeId, setActiveId] = (0, import_react.useState)(ids[0] ?? "");
	(0, import_react.useEffect)(() => {
		if (ids.length === 0) return;
		const elements = ids.map((id) => document.getElementById(id)).filter((el) => Boolean(el));
		if (elements.length === 0) return;
		const observer = new IntersectionObserver((entries) => {
			const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
			if (visible[0]?.target.id) {
				setActiveId(visible[0].target.id);
				return;
			}
			const above = elements.filter((el) => el.getBoundingClientRect().top - offset < 0);
			const last = above[above.length - 1];
			if (last) setActiveId(last.id);
		}, {
			rootMargin: `-${offset}px 0px -55% 0px`,
			threshold: [0, 1]
		});
		for (const el of elements) observer.observe(el);
		return () => observer.disconnect();
	}, [ids, offset]);
	return activeId;
}
function flattenIds(items) {
	return items.flatMap((item) => [item.id, ...flattenIds(item.children)]);
}
function TocList({ items, activeId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-1.5",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: `#${item.id}`,
			className: cn("block text-[0.8rem] leading-snug transition-colors", item.level > 2 && "ps-3", activeId === item.id ? "text-foreground" : "text-muted hover:text-foreground"),
			children: item.text
		}), item.children.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1.5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TocList, {
				items: item.children,
				activeId
			})
		}) : null] }, item.id))
	});
}
function Toc() {
	const { page, lang } = useDocs();
	const items = page?.toc ?? [];
	const activeId = useScrollSpy(flattenIds(items));
	if (items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "hidden w-56 shrink-0 xl:block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto ps-6 pe-4 pt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-[11px] font-semibold tracking-[0.14em] text-faint uppercase",
				children: t(lang, "onThisPage")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TocList, {
				items,
				activeId
			})]
		})
	});
}
function Accordion({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2, {
		type: "multiple",
		className: "my-5 divide-y divide-border overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface",
		children
	});
}
function AccordionItem({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Item, {
		value: title,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
			className: cn("flex w-full items-center justify-between gap-3 px-4 py-3 text-start text-sm font-medium", "hover:bg-surface-2 [&[data-state=open]>svg]:rotate-180"),
			children: [title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 shrink-0 text-muted transition-transform duration-[var(--motion-fast)]" })]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
			className: "overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 pt-0 pb-4 text-sm leading-relaxed text-muted [&_p]:my-0",
				children
			})
		})]
	});
}
var styles = {
	info: {
		icon: Info,
		className: "border-info/25 bg-info/8 text-foreground",
		iconClass: "text-info",
		label: "Note"
	},
	tip: {
		icon: Lightbulb,
		className: "border-tip/25 bg-tip/8 text-foreground",
		iconClass: "text-tip",
		label: "Tip"
	},
	warning: {
		icon: TriangleAlert,
		className: "border-warn/30 bg-warn/10 text-foreground",
		iconClass: "text-warn",
		label: "Warning"
	},
	danger: {
		icon: OctagonAlert,
		className: "border-danger/30 bg-danger/10 text-foreground",
		iconClass: "text-danger",
		label: "Caution"
	}
};
function Callout({ type = "info", title, children }) {
	const spec = styles[type] ?? styles.info;
	const Icon = spec.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cn("my-5 flex gap-3 rounded-[var(--radius-md)] border px-4 py-3.5", spec.className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("mt-0.5 size-4 shrink-0", spec.iconClass) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 text-[0.95rem] leading-relaxed [&_p]:my-0 [&_p+p]:mt-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 font-medium",
				children: title ?? spec.label
			}), children]
		})]
	});
}
function flattenText(node) {
	if (node == null || typeof node === "boolean") return "";
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(flattenText).join("");
	if ((0, import_react.isValidElement)(node)) return flattenText(node.props.children);
	return "";
}
function decorateLines(text, highlight, diff, showLineNumbers) {
	const lines = text.replace(/\n$/, "").split("\n");
	const highlightSet = new Set(highlight);
	return lines.map((line, i) => {
		const n = i + 1;
		const diffAdd = diff && line.startsWith("+");
		const diffDel = diff && line.startsWith("-");
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cn("block min-h-[1.5em] pe-4", showLineNumbers ? "ps-0" : "ps-4", highlightSet.has(n) && "code-line-highlighted", diffAdd && "diff-add", diffDel && "diff-del"),
			children: [showLineNumbers ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-block w-10 pe-3 text-end font-mono text-xs text-faint select-none",
				children: n
			}) : null, line || "\n"]
		}, n);
	});
}
function CodeBlock({ children, className, ...props }) {
	const data = props;
	const title = data["data-title"] || void 0;
	const language = data["data-language"] || "";
	const showLineNumbers = data["data-line-numbers"] === "true";
	const terminal = data["data-terminal"] === "true";
	const diff = data["data-diff"] === "true" || language === "diff";
	const highlight = (data["data-highlight"] || "").split(",").map(Number).filter((n) => n > 0);
	let codeEl = children;
	let raw = "";
	const child = import_react.Children.toArray(children)[0];
	if ((0, import_react.isValidElement)(child)) {
		raw = flattenText(child.props.children);
		codeEl = child;
	} else raw = flattenText(children);
	const splitLines = highlight.length > 0 || diff || showLineNumbers;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: cn("group/code my-5 overflow-hidden rounded-[var(--radius-md)] bg-code shadow-[var(--shadow-border)]", terminal && "bg-foreground text-background"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
			className: "flex h-10 items-center justify-between gap-3 border-b border-border px-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-2",
				children: [terminal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex gap-1.5 px-1",
					"aria-hidden": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-border-strong" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-border-strong" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2.5 rounded-full bg-border-strong" })
					]
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate font-mono text-xs text-muted",
					children: title || language || "code"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, {
				value: raw,
				className: terminal ? "text-background/70 hover:text-background" : void 0
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: cn("overflow-x-auto py-3 font-mono text-sm leading-relaxed", className),
			children: splitLines ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: decorateLines(raw, highlight, diff, showLineNumbers) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: "block px-4",
				children: codeEl
			})
		})]
	});
}
function InlineCode({ children, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
		className,
		...props,
		children
	});
}
function Heading({ as: Tag, children, id, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tag, {
		id,
		className: cn("group scroll-mt-24", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children }), id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Copy link to heading",
			className: "ms-2 inline-flex size-6 translate-y-px items-center justify-center rounded-[var(--radius-xs)] text-faint opacity-0 transition-opacity group-hover:opacity-100 hover:bg-surface-2 hover:text-foreground focus-visible:opacity-100",
			onClick: async () => {
				const url = `${window.location.origin}${window.location.pathname}#${id}`;
				await copyText(url);
				window.history.replaceState(null, "", `#${id}`);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, { className: "size-3.5" })
		}) : null]
	});
}
var H1 = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
	as: "h1",
	...props
});
var H2 = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
	as: "h2",
	...props
});
var H3 = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
	as: "h3",
	...props
});
var H4 = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
	as: "h4",
	...props
});
function ImageZoom({ src, alt = "", className, ...props }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	if (!src) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: "my-5 block w-full cursor-zoom-in border-0 bg-transparent p-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt,
			className: cn("w-full", className),
			...props
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "top-[50%] w-[min(100%-1.5rem,64rem)] -translate-y-1/2 bg-background p-3",
			showClose: true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "sr-only",
				children: alt || "Image"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt,
				className: "w-full rounded-[var(--radius-md)]"
			})]
		})
	})] });
}
function Tab({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function Tabs({ items, children }) {
	const tabs = import_react.Children.toArray(children).filter((child) => (0, import_react.isValidElement)(child));
	const titles = items ?? tabs.map((tab, i) => tab.props.title ?? `Tab ${i + 1}`);
	const defaultValue = titles[0] ?? "0";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root2$1, {
		defaultValue,
		className: "my-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
			className: "relative flex gap-1 overflow-x-auto border-b border-border",
			children: titles.map((title) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
				value: title,
				className: cn("relative -mb-px shrink-0 px-3 py-2 text-sm text-muted transition-colors", "hover:text-foreground", "data-[state=active]:text-foreground data-[state=active]:after:absolute data-[state=active]:after:inset-x-2 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-accent"),
				children: title
			}, title))
		}), tabs.map((tab, i) => {
			const title = titles[i] ?? String(i);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
				value: title,
				className: "pt-3 outline-none",
				children: tab.props.children
			}, title);
		})]
	});
}
function MdxLink({ href, children, ...props }) {
	if (!href) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		...props,
		children
	});
	if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		target: "_blank",
		rel: "noreferrer",
		...props,
		children
	});
	if (href.startsWith("#")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href,
		...props,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: href,
		...props,
		children
	});
}
var mdxComponents = {
	h1: H1,
	h2: H2,
	h3: H3,
	h4: H4,
	a: MdxLink,
	pre: CodeBlock,
	code: InlineCode,
	img: ImageZoom,
	Callout,
	Tabs,
	Tab,
	Accordion,
	AccordionItem,
	ImageZoom
};
function MdxRuntime({ compiled }) {
	const Content = (0, import_react.use)(runMdx(compiled));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, { components: mdxComponents });
}
function DocPage() {
	const { compiled, page } = Route.useLoaderData();
	const { lang } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
			id: "doc-content",
			className: "min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-widest text-faint uppercase",
							children: page.slug[0]?.replace(/-/g, " ")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpenIn, {})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "doc-prose",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: page.title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "!mt-0 text-lg text-muted",
								children: page.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
								fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-8 h-40 animate-pulse rounded-[var(--radius-md)] bg-surface-2" }),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MdxRuntime, { compiled })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: githubEditUrl(page.filePath),
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex items-center gap-2 text-sm text-muted hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "size-4" }), t(lang, "editOnGitHub")]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrevNext, {})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toc, {})]
	});
}
//#endregion
export { DocPage as component };
