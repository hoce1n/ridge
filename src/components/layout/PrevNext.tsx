import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { t } from "@/config/i18n";
import { useDocs } from "@/components/layout/DocsContext";
import { getNeighbors } from "@/lib/content-loader";

export function PrevNext() {
  const { page, lang, version } = useDocs();
  if (!page) return null;
  const { prev, next } = getNeighbors(lang, version, page.slug);
  if (!prev && !next) return null;

  return (
    <nav className="mt-14 grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          to={prev.href}
          className="group flex flex-col gap-1 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 hover:border-border-strong"
        >
          <span className="flex items-center gap-1 text-xs text-muted">
            <ArrowLeft className="size-3.5 rtl:hidden" />
            <ArrowRight className="hidden size-3.5 rtl:block" />
            {t(lang, "previous")}
          </span>
          <span className="font-medium">{prev.sidebarTitle}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          to={next.href}
          className="group flex flex-col items-end gap-1 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-end hover:border-border-strong"
        >
          <span className="flex items-center gap-1 text-xs text-muted">
            {t(lang, "next")}
            <ArrowRight className="size-3.5 rtl:hidden" />
            <ArrowLeft className="hidden size-3.5 rtl:block" />
          </span>
          <span className="font-medium">{next.sidebarTitle}</span>
        </Link>
      ) : null}
    </nav>
  );
}
