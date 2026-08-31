import { useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { docsConfig } from "@/config/docs.config";
import { t } from "@/config/i18n";
import { useDocs } from "@/components/layout/DocsContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { switchLocaleHref } from "@/lib/content-loader";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const { lang, version, page } = useDocs();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t(lang, "language")}
          className="inline-flex h-8 items-center gap-1 rounded-[var(--radius-sm)] px-2 text-sm text-muted hover:bg-surface-2 hover:text-foreground"
        >
          {docsConfig.locales.find((l) => l.code === lang)?.localName ?? lang}
          <ChevronDown className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {docsConfig.locales.map((item) => (
          <DropdownMenuItem
            key={item.code}
            className={cn(item.code === lang && "bg-surface-2")}
            onSelect={() => {
              void navigate({
                to: switchLocaleHref(page, item.code, version),
              });
            }}
          >
            {item.localName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
