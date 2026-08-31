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
import { switchVersionHref } from "@/lib/content-loader";
import { cn } from "@/lib/utils";

export function VersionSwitcher() {
  const { lang, version, page } = useDocs();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t(lang, "version")}
          className="inline-flex h-8 items-center gap-1 rounded-[var(--radius-sm)] px-2 text-sm text-muted hover:bg-surface-2 hover:text-foreground"
        >
          {docsConfig.versions.find((v) => v.id === version)?.label ?? version}
          <ChevronDown className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {docsConfig.versions.map((item) => (
          <DropdownMenuItem
            key={item.id}
            className={cn(item.id === version && "bg-surface-2")}
            onSelect={() => {
              void navigate({
                to: switchVersionHref(page, lang, item.id),
              });
            }}
          >
            <span className="flex-1">{item.label}</span>
            {item.badge ? (
              <span className="text-[10px] uppercase tracking-wide text-faint">
                {item.badge}
              </span>
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
