import { Check, ChevronDown, Copy, ExternalLink, FileText, Github } from "lucide-react";
import { useState } from "react";
import {
  chatgptUrl,
  docsConfig,
  githubBlobUrl,
} from "@/config/docs.config";
import { t } from "@/config/i18n";
import { useDocs } from "@/components/layout/DocsContext";
import { copyText } from "@/components/ui/CopyButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function OpenIn() {
  const { page, lang } = useDocs();
  const [copied, setCopied] = useState<"md" | "link" | null>(null);
  if (!page) return null;

  const mark = (kind: "md" | "link") => {
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1400);
  };

  const pageUrl = `${docsConfig.siteUrl}${page.href}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1 rounded-[var(--radius-sm)] border border-border bg-surface px-2.5 text-xs font-medium text-muted hover:text-foreground"
        >
          {t(lang, "openIn")}
          <ChevronDown className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onSelect={async (event) => {
            event.preventDefault();
            if (await copyText(page.raw)) mark("md");
          }}
        >
          {copied === "md" ? (
            <Check className="size-4" />
          ) : (
            <FileText className="size-4" />
          )}
          {copied === "md" ? t(lang, "copied") : t(lang, "copyMarkdown")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={async (event) => {
            event.preventDefault();
            const url =
              typeof window !== "undefined"
                ? window.location.href
                : pageUrl;
            if (await copyText(url)) mark("link");
          }}
        >
          {copied === "link" ? (
            <Check className="size-4" />
          ) : (
            <Copy className="size-4" />
          )}
          {copied === "link" ? t(lang, "copied") : t(lang, "copyLink")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href={chatgptUrl(pageUrl)} target="_blank" rel="noreferrer">
            <ExternalLink className="size-4" />
            {t(lang, "openChatGPT")}
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={githubBlobUrl(page.filePath)}
            target="_blank"
            rel="noreferrer"
          >
            <Github className="size-4" />
            {t(lang, "openGitHub")}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
