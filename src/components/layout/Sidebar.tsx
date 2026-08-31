import { Link } from "@tanstack/react-router";
import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useDocs } from "@/components/layout/DocsContext";
import type { DocSection } from "@/lib/content-model";
import { cn } from "@/lib/utils";

function SectionBlock({
  section,
  activeHref,
}: {
  section: DocSection;
  activeHref: string | undefined;
}) {
  const containsActive =
    section.pages.some((page) => page.href === activeHref) ||
    section.sections.some((child) =>
      child.pages.some((page) => page.href === activeHref),
    );
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (containsActive) setOpen(true);
  }, [containsActive]);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="mb-4">
      <Collapsible.Trigger className="flex w-full items-center justify-between gap-2 px-2 py-1.5 text-start text-xs font-semibold tracking-widest text-faint uppercase">
        {section.title}
        <ChevronRight
          className={cn(
            "size-3.5 transition-transform duration-[var(--motion-fast)]",
            open && "rotate-90",
          )}
        />
      </Collapsible.Trigger>
      <Collapsible.Content>
        <ul className="mt-1 space-y-0.5">
          {section.pages.map((page) => {
            const active = page.href === activeHref;
            return (
              <li key={page.href}>
                <Link
                  to={page.href as never}
                  className={cn(
                    "flex rounded-[var(--radius-sm)] px-2 py-1.5 text-sm leading-snug",
                    active
                      ? "bg-accent-soft font-medium text-foreground"
                      : "text-muted hover:bg-surface-2 hover:text-foreground",
                  )}
                >
                  {page.sidebarTitle}
                </Link>
              </li>
            );
          })}
          {section.sections.map((child) => (
            <li key={child.id} className="ps-2">
              <SectionBlock section={child} activeHref={activeHref} />
            </li>
          ))}
        </ul>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export function Sidebar({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const { tree, page } = useDocs();

  return (
    <nav
      aria-label="Documentation"
      className={cn("px-3 py-4", className)}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("a")) onNavigate?.();
      }}
    >
      {tree.sections.map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          activeHref={page?.href}
        />
      ))}
    </nav>
  );
}
