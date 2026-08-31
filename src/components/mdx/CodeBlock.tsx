import {
  Children,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";

function flattenText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flattenText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return flattenText(node.props.children);
  }
  return "";
}

function decorateLines(
  text: string,
  highlight: number[],
  diff: boolean,
  showLineNumbers: boolean,
): ReactNode {
  const lines = text.replace(/\n$/, "").split("\n");
  const highlightSet = new Set(highlight);
  return lines.map((line, i) => {
    const n = i + 1;
    const diffAdd = diff && line.startsWith("+");
    const diffDel = diff && line.startsWith("-");
    return (
      <span
        key={n}
        className={cn(
          "block min-h-[1.5em] pe-4",
          showLineNumbers ? "ps-0" : "ps-4",
          highlightSet.has(n) && "code-line-highlighted",
          diffAdd && "diff-add",
          diffDel && "diff-del",
        )}
      >
        {showLineNumbers ? (
          <span className="inline-block w-10 pe-3 text-end font-mono text-xs text-faint select-none">
            {n}
          </span>
        ) : null}
        {line || "\n"}
      </span>
    );
  });
}

export function CodeBlock({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLPreElement>) {
  const data = props as Record<string, string | undefined>;
  const title = data["data-title"] || undefined;
  const language = data["data-language"] || "";
  const showLineNumbers = data["data-line-numbers"] === "true";
  const terminal = data["data-terminal"] === "true";
  const diff = data["data-diff"] === "true" || language === "diff";
  const highlight = (data["data-highlight"] || "")
    .split(",")
    .map(Number)
    .filter((n) => n > 0);

  let codeEl: ReactNode = children;
  let raw = "";
  const child = Children.toArray(children)[0];
  if (isValidElement<{ children?: ReactNode; className?: string }>(child)) {
    raw = flattenText(child.props.children);
    codeEl = child;
  } else {
    raw = flattenText(children);
  }

  const splitLines = highlight.length > 0 || diff || showLineNumbers;

  return (
    <figure
      className={cn(
        "group/code my-5 overflow-hidden rounded-[var(--radius-md)] bg-code shadow-[var(--shadow-border)]",
        terminal && "bg-foreground text-background",
      )}
    >
      <figcaption className="flex h-10 items-center justify-between gap-3 border-b border-border px-3">
        <div className="flex min-w-0 items-center gap-2">
          {terminal ? (
            <span className="flex gap-1.5 px-1" aria-hidden>
              <span className="size-2.5 rounded-full bg-border-strong" />
              <span className="size-2.5 rounded-full bg-border-strong" />
              <span className="size-2.5 rounded-full bg-border-strong" />
            </span>
          ) : null}
          <span className="truncate font-mono text-xs text-muted">
            {title || language || "code"}
          </span>
        </div>
        <CopyButton
          value={raw}
          className={terminal ? "text-background/70 hover:text-background" : undefined}
        />
      </figcaption>
      <pre
        className={cn(
          "overflow-x-auto py-3 font-mono text-sm leading-relaxed",
          className,
        )}
      >
        {splitLines ? (
          <code>{decorateLines(raw, highlight, diff, showLineNumbers)}</code>
        ) : (
          <code className="block px-4">{codeEl}</code>
        )}
      </pre>
    </figure>
  );
}

export function InlineCode({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}
