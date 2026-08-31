import { Link } from "@tanstack/react-router";
import { Github, Menu, Search } from "lucide-react";
import { useState } from "react";
import { githubRepoUrl } from "@/config/docs.config";
import { t } from "@/config/i18n";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { Logo } from "@/components/layout/Logo";
import { Sidebar } from "@/components/layout/Sidebar";
import { VersionSwitcher } from "@/components/layout/VersionSwitcher";
import { useDocs } from "@/components/layout/DocsContext";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useCommandMenu } from "@/hooks/useCommandMenu";

export function Header() {
  const { lang, version } = useDocs();
  const { open, setOpen } = useCommandMenu();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-2 px-3 sm:px-4">
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-surface-2 hover:text-foreground md:hidden"
            aria-label={t(lang, "menu")}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <Logo href={`/${lang}/docs/${version}`} />
          <VersionSwitcher />
          <div className="ms-auto flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="hidden h-9 items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-3 text-sm text-muted hover:text-foreground sm:inline-flex"
            >
              <Search className="size-3.5" />
              <span>{t(lang, "searchPlaceholder")}</span>
              <kbd className="ms-6 rounded-[var(--radius-xs)] border border-border px-1.5 py-0.5 font-mono text-[10px] text-faint">
                ⌘K
              </kbd>
            </button>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-surface-2 hover:text-foreground sm:hidden"
              aria-label={t(lang, "searchPlaceholder")}
              onClick={() => setOpen(true)}
            >
              <Search className="size-4" />
            </button>
            <LocaleSwitcher />
            <Link
              to={`/${lang}/docs/${version}` as never}
              className="hidden h-8 items-center px-2 text-sm text-muted hover:text-foreground md:inline-flex"
            >
              {t(lang, "docs")}
            </Link>
            <a
              href={githubRepoUrl()}
              target="_blank"
              rel="noreferrer"
              aria-label={t(lang, "viewSource")}
              className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-surface-2 hover:text-foreground"
            >
              <Github className="size-4" />
            </a>
            <ThemeToggle lang={lang} />
          </div>
        </div>
      </header>
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="start" className="pt-14">
          <Sidebar onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
      <CommandMenu
        open={open}
        onOpenChange={setOpen}
        lang={lang}
        version={version}
      />
    </>
  );
}
