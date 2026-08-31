import GithubSlugger from "github-slugger";
import { parse as parseYaml } from "yaml";
import type { DocFrontmatter, Heading, TocItem } from "./content-model.ts";

export type ParsedDoc = {
  frontmatter: DocFrontmatter;
  body: string;
  headings: Heading[];
  toc: TocItem[];
  plainText: string;
  errors: string[];
};

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~]+/g, "")
    .trim();
}

export function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const normalized = raw.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---")) {
    return { data: {}, content: normalized };
  }
  const afterOpen = normalized.slice(3);
  const nl = afterOpen.startsWith("\r\n")
    ? 2
    : afterOpen.startsWith("\n")
      ? 1
      : 0;
  const rest = afterOpen.slice(nl);
  const close = rest.search(/\r?\n---[ \t]*\r?\n/);
  if (close === -1) {
    return { data: {}, content: normalized };
  }
  const yamlBlock = rest.slice(0, close);
  const afterYaml = rest.slice(close).replace(/^\r?\n---[ \t]*/, "");
  const content = afterYaml.replace(/^\r?\n/, "");
  try {
    const data = (parseYaml(yamlBlock) ?? {}) as Record<string, unknown>;
    return { data, content };
  } catch {
    return { data: {}, content: normalized };
  }
}

export function extractHeadings(mdx: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
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
    const level = match[1].length as 2 | 3 | 4;
    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;
    headings.push({ id: slugger.slug(text), text, level });
  }
  return headings;
}

export function buildToc(headings: Heading[]): TocItem[] {
  const root: TocItem[] = [];
  const stack: TocItem[] = [];
  for (const heading of headings) {
    const item: TocItem = {
      id: heading.id,
      text: heading.text,
      level: heading.level,
      children: [],
    };
    while (stack.length && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }
    if (stack.length === 0) {
      root.push(item);
    } else {
      stack[stack.length - 1].children.push(item);
    }
    stack.push(item);
  }
  return root;
}

export function toPlainText(mdx: string): string {
  return mdx
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_`~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseFrontmatterShape(
  data: Record<string, unknown>,
): { frontmatter: DocFrontmatter; errors: string[] } {
  const errors: string[] = [];
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  if (!title) errors.push("missing required frontmatter field `title`");
  if (!description)
    errors.push("missing required frontmatter field `description`");
  const sidebarTitle =
    typeof data.sidebarTitle === "string" && data.sidebarTitle.trim()
      ? data.sidebarTitle.trim()
      : undefined;
  let order: number | undefined;
  if (data.order !== undefined) {
    if (typeof data.order === "number" && Number.isFinite(data.order)) {
      order = data.order;
    } else {
      errors.push("`order` must be a number");
    }
  }
  let hidden: boolean | undefined;
  if (data.hidden !== undefined) {
    if (typeof data.hidden === "boolean") {
      hidden = data.hidden;
    } else {
      errors.push("`hidden` must be a boolean");
    }
  }
  return {
    frontmatter: {
      title: title || "Untitled",
      description,
      sidebarTitle,
      order,
      hidden,
    },
    errors,
  };
}

export function parseDocSource(raw: string): ParsedDoc {
  const { data, content } = parseFrontmatter(raw);
  const { frontmatter, errors } = parseFrontmatterShape(data);
  const headings = extractHeadings(content);
  return {
    frontmatter,
    body: content,
    headings,
    toc: buildToc(headings),
    plainText: toPlainText(content),
    errors,
  };
}

export function extractMarkdownLinks(
  body: string,
): { href: string; text: string }[] {
  const links: { href: string; text: string }[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(body))) {
    const href = match[2].split(/\s+/)[0]?.replace(/^<|>$/g, "") ?? "";
    if (href) links.push({ href, text: match[1] });
  }
  return links;
}
