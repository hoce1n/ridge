import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  Fingerprint,
  Github,
  Lock,
  Search,
} from "lucide-react";

import { docsConfig, githubRepoUrl } from "@/config/docs.config";
import { t } from "@/config/i18n";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { CopyButton } from "@/components/ui/CopyButton";
import { CommandMenu } from "@/components/ui/CommandMenu";
import { useCommandMenu } from "@/hooks/useCommandMenu";

const startHref = `/${docsConfig.defaultLocale}/docs/${docsConfig.defaultVersion}/getting-started`;
const install = "npm install -g @ridge/cli";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${docsConfig.name} · ${docsConfig.tagline}` },
      { name: "description", content: docsConfig.description },
    ],
  }),
  component: Home,
});

function Home() {
  const { open, setOpen } = useCommandMenu();
  const lang = docsConfig.defaultLocale;
  const version = docsConfig.defaultVersion;

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
          <Logo />
          <div className="ms-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="hidden h-9 items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-3 text-sm text-muted hover:text-foreground sm:inline-flex"
            >
              <Search className="size-3.5" />
              Search
              <kbd className="ms-4 rounded-[var(--radius-xs)] border border-border px-1.5 py-0.5 font-mono text-[10px] text-faint">
                ⌘K
              </kbd>
            </button>
            <Link
              to={startHref as never}
              className="h-9 px-3 text-sm text-muted hover:text-foreground inline-flex items-center"
            >
              {t(lang, "docs")}
            </Link>
            <a
              href={githubRepoUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:bg-surface-2 hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="size-4" />
            </a>
            <ThemeToggle lang={lang} />
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage:
                "radial-gradient(ellipse at top, black 40%, transparent 75%)",
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-16 sm:pt-28">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-faint uppercase">
              Package manager
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.6rem,6vw,5.2rem)] leading-[1.05] tracking-[-0.03em] text-balance">
              Install once.
              <br />
              <em className="italic">Resolve forever.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
              {docsConfig.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={startHref as never}
                className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] bg-accent px-4 text-sm font-medium text-accent-fg"
              >
                {t(lang, "getStarted")}
                <ArrowRight className="size-4 rtl:hidden" />
              </Link>
              <a
                href={githubRepoUrl()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-[var(--radius-sm)] border border-border bg-surface px-4 text-sm font-medium"
              >
                <Github className="size-4" />
                {t(lang, "viewSource")}
              </a>
            </div>
            <div className="mt-8 inline-flex max-w-full items-center gap-3 rounded-[var(--radius-md)] bg-code py-2 ps-4 pe-2 font-mono text-sm shadow-[var(--shadow-border)]">
              <span className="text-faint">$</span>
              <span className="truncate">{install}</span>
              <CopyButton value={install} />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-20 md:grid-cols-3">
          {[
            {
              icon: Fingerprint,
              title: "Content-addressed",
              body: "Every package is stored by hash. Identical bytes are written once, linked everywhere, and verified on every install.",
            },
            {
              icon: Lock,
              title: "A lockfile that means it",
              body: "ridge.lock records the exact graph, integrity hashes, and peer resolutions. CI either matches or fails closed.",
            },
            {
              icon: Boxes,
              title: "Workspaces that nest",
              body: "Monorepos, nested packages, and isolated node_modules without hoisting surprises. One command, the whole graph.",
            },
          ].map((feature) => (
            <article
              key={feature.title}
              className="rounded-[var(--radius-lg)] bg-surface p-5 shadow-[var(--shadow-border)]"
            >
              <feature.icon className="size-5 text-accent" />
              <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {feature.body}
              </p>
            </article>
          ))}
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="overflow-hidden rounded-[calc(var(--radius-md)+8px)] bg-surface p-2 shadow-[var(--shadow-elevated)]">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <span className="size-2.5 rounded-full bg-border-strong" />
              <span className="size-2.5 rounded-full bg-border-strong" />
              <span className="size-2.5 rounded-full bg-border-strong" />
              <span className="ms-2 font-mono text-xs text-muted">
                ridge.lock
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[0.8rem] leading-relaxed text-muted">
{`lockfileVersion: 2
packages:
  "react@19.2.0":
    hash: sha512-8f3c2a1e0b…
    peers: []
  "ridge@2.4.1":
    hash: sha512-91c0aa2e…
    bins: [ridge]`}
            </pre>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-faint">
        {docsConfig.name} documentation
      </footer>
      <CommandMenu
        open={open}
        onOpenChange={setOpen}
        lang={lang}
        version={version}
      />
    </div>
  );
}
