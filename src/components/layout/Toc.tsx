import { t } from "@/config/i18n";
import { useDocs } from "@/components/layout/DocsContext";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import type { TocItem } from "@/lib/content-model";
import { cn } from "@/lib/utils";

function flattenIds(items: TocItem[]): string[] {
  return items.flatMap((item) => [item.id, ...flattenIds(item.children)]);
}

function TocList({
  items,
  activeId,
}: {
  items: TocItem[];
  activeId: string;
}) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              "block text-[0.8rem] leading-snug transition-colors",
              item.level > 2 && "ps-3",
              activeId === item.id
                ? "text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {item.text}
          </a>
          {item.children.length > 0 ? (
            <div className="mt-1.5">
              <TocList items={item.children} activeId={activeId} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function Toc() {
  const { page, lang } = useDocs();
  const items = page?.toc ?? [];
  const ids = flattenIds(items);
  const activeId = useScrollSpy(ids);

  if (items.length === 0) return null;

  return (
    <aside className="hidden w-56 shrink-0 xl:block">
      <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto ps-6 pe-4 pt-10">
        <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-faint uppercase">
          {t(lang, "onThisPage")}
        </p>
        <TocList items={items} activeId={activeId} />
      </div>
    </aside>
  );
}
