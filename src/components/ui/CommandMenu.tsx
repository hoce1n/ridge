import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import {
  FileText,
  Github,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { useMemo, useState } from "react";
import { githubBlobUrl, githubRepoUrl } from "@/config/docs.config";
import { t } from "@/config/i18n";
import { useDocsOptional } from "@/components/layout/DocsContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { copyText } from "@/components/ui/CopyButton";
import { useTheme } from "@/hooks/useTheme";
import { getSearchIndex, searchDocs } from "@/lib/search-index";

export function CommandMenu({
  open,
  onOpenChange,
  lang,
  version,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: string;
  version: string;
}) {
  const navigate = useNavigate();
  const docs = useDocsOptional();
  const { cycleTheme, resolved } = useTheme();
  const [query, setQuery] = useState("");

  const hits = useMemo(
    () => (query.trim() ? searchDocs(query, lang, version, 8) : []),
    [query, lang, version],
  );
  const browse = useMemo(
    () =>
      getSearchIndex()
        .filter((entry) => entry.lang === lang && entry.version === version)
        .slice(0, 8),
    [lang, version],
  );

  const go = (href: string) => {
    onOpenChange(false);
    setQuery("");
    void navigate({ to: href });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
    >
      <DialogContent
        showClose={false}
        className="top-[18%] overflow-hidden p-0"
      >
        <DialogTitle className="sr-only">{t(lang, "searchPlaceholder")}</DialogTitle>
        <Command
          shouldFilter={false}
          className="bg-surface"
          loop
        >
          <div className="flex items-center gap-2 border-b border-border px-3">
            <Search className="size-4 text-faint" />
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder={t(lang, "searchPlaceholder")}
              className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-faint"
            />
            <kbd className="hidden rounded-[var(--radius-xs)] border border-border px-1.5 py-0.5 font-mono text-[10px] text-faint sm:inline">
              ESC
            </kbd>
          </div>
          <Command.List className="max-h-[min(24rem,60dvh)] overflow-y-auto p-2">
            <Command.Empty className="px-2 py-6 text-center text-sm text-muted">
              {t(lang, "searchEmpty")}
            </Command.Empty>
            <Command.Group
              heading={t(lang, "searchPages")}
              className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-faint [&_[cmdk-group-heading]]:uppercase"
            >
              {(query.trim() ? hits.map((h) => h.entry) : browse).map(
                (entry) => (
                  <Command.Item
                    key={entry.href}
                    value={entry.href}
                    onSelect={() => go(entry.href)}
                    className="flex cursor-pointer flex-col gap-0.5 rounded-[var(--radius-sm)] px-2 py-2 text-sm data-[selected=true]:bg-surface-2"
                  >
                    <span className="font-medium">{entry.title}</span>
                    <span className="text-xs text-muted">
                      {entry.section}
                      {entry.description ? ` · ${entry.description}` : ""}
                    </span>
                  </Command.Item>
                ),
              )}
            </Command.Group>
            <Command.Group
              heading={t(lang, "searchCommands")}
              className="mt-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-faint [&_[cmdk-group-heading]]:uppercase"
            >
              <Command.Item
                onSelect={() => {
                  cycleTheme();
                  onOpenChange(false);
                }}
                className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-sm data-[selected=true]:bg-surface-2"
              >
                {resolved === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
                {t(lang, "toggleTheme")}
              </Command.Item>
              {docs?.page ? (
                <Command.Item
                  onSelect={async () => {
                    await copyText(docs.page?.raw ?? "");
                    onOpenChange(false);
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-sm data-[selected=true]:bg-surface-2"
                >
                  <FileText className="size-4" />
                  {t(lang, "copyMarkdown")}
                </Command.Item>
              ) : null}
              <Command.Item
                onSelect={() => {
                  const href = docs?.page
                    ? githubBlobUrl(docs.page.filePath)
                    : githubRepoUrl();
                  window.open(href, "_blank", "noreferrer");
                  onOpenChange(false);
                }}
                className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 text-sm data-[selected=true]:bg-surface-2"
              >
                <Github className="size-4" />
                {t(lang, "openGitHub")}
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
