import { compile, run } from "@mdx-js/mdx";
import type { ComponentType } from "react";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { visit } from "unist-util-visit";

type CodeMeta = {
  title?: string;
  highlight: number[];
  showLineNumbers: boolean;
  terminal: boolean;
  diff: boolean;
};

type HastNode = {
  type: string;
  tagName?: string;
  children?: HastNode[];
  properties?: Record<string, unknown>;
  data?: { meta?: unknown; hProperties?: Record<string, string> };
  lang?: string | null;
  meta?: string | null;
};

function parseHighlight(expr: string): number[] {
  const lines: number[] = [];
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

export function parseCodeMeta(
  meta: string | null | undefined,
  lang?: string | null,
): CodeMeta {
  const raw = meta ?? "";
  const titleMatch =
    raw.match(/title="([^"]+)"/) ??
    raw.match(/filename="([^"]+)"/) ??
    raw.match(/(?:title|filename)=([^\s]+)/);
  const highlightMatch = raw.match(/\{([^}]+)\}/);
  const langNorm = (lang ?? "").toLowerCase();
  return {
    title: titleMatch?.[1],
    highlight: highlightMatch ? parseHighlight(highlightMatch[1]) : [],
    showLineNumbers: /\b(showLineNumbers|lineNumbers)\b/.test(raw),
    terminal:
      /\b(terminal|console)\b/.test(raw) ||
      langNorm === "terminal" ||
      langNorm === "console",
    diff: /\bdiff\b/.test(raw) || langNorm === "diff",
  };
}

function rehypeCodeMeta() {
  return (tree: HastNode) => {
    visit(tree, "element", (node: HastNode) => {
      if (node.tagName !== "pre") return;
      const code = node.children?.find((child) => child.tagName === "code");
      if (!code) return;
      const className = code.properties?.className;
      const classes = Array.isArray(className)
        ? className.map(String)
        : typeof className === "string"
          ? className.split(" ")
          : [];
      const langClass = classes.find((c) => c.startsWith("language-"));
      const lang = langClass?.replace("language-", "") ?? "";
      const meta = String(
        code.properties?.meta ??
          code.properties?.["data-title"] ??
          node.properties?.meta ??
          "",
      );
      const parsed = parseCodeMeta(meta, lang);
      const fromCode = code.properties ?? {};
      node.properties = {
        ...node.properties,
        "data-language":
          String(fromCode["data-language"] ?? lang),
        "data-title": String(fromCode["data-title"] ?? parsed.title ?? ""),
        "data-line-numbers": String(
          fromCode["data-line-numbers"] ?? (parsed.showLineNumbers ? "true" : "false"),
        ),
        "data-highlight": String(
          fromCode["data-highlight"] ?? parsed.highlight.join(","),
        ),
        "data-terminal": String(
          fromCode["data-terminal"] ?? (parsed.terminal ? "true" : "false"),
        ),
        "data-diff": String(fromCode["data-diff"] ?? (parsed.diff ? "true" : "false")),
      };
    });
  };
}

function remarkCodeToHastMeta() {
  return (tree: HastNode) => {
    visit(tree, "code", (node: HastNode) => {
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
        "data-diff": parsed.diff ? "true" : "false",
      };
    });
  };
}

const compileCache = new Map<string, string>();

export async function compileMdx(source: string): Promise<string> {
  const cached = compileCache.get(source);
  if (cached) return cached;
  const compiled = String(
    await compile(source, {
      outputFormat: "function-body",
      development: false,
      remarkPlugins: [remarkGfm, remarkCodeToHastMeta],
      rehypePlugins: [rehypeSlug, rehypeHighlight, rehypeCodeMeta],
    }),
  );
  compileCache.set(source, compiled);
  return compiled;
}

const runCache = new Map<
  string,
  Promise<ComponentType<Record<string, unknown>>>
>();

export function runMdx(
  compiled: string,
): Promise<ComponentType<Record<string, unknown>>> {
  const cached = runCache.get(compiled);
  if (cached) return cached;
  const pending = run(compiled, {
    ...runtime,
    baseUrl: import.meta.url,
  }).then((mod) => mod.default as ComponentType<Record<string, unknown>>);
  runCache.set(compiled, pending);
  return pending;
}
