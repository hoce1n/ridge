import { Monitor, Moon, Sun } from "lucide-react";
import { t } from "@/config/i18n";
import { useTheme, type Theme } from "@/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ThemeToggle({ lang }: { lang: string }) {
  const { theme, resolved, setTheme } = useTheme();
  const Icon = resolved === "dark" ? Moon : Sun;

  const items: { id: Theme; label: string; icon: typeof Sun }[] = [
    { id: "system", label: t(lang, "themeSystem"), icon: Monitor },
    { id: "light", label: t(lang, "themeLight"), icon: Sun },
    { id: "dark", label: t(lang, "themeDark"), icon: Moon },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t(lang, "appearance")}
          className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          <Icon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t(lang, "appearance")}</DropdownMenuLabel>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onSelect={() => setTheme(item.id)}
            className={cn(theme === item.id && "bg-surface-2")}
          >
            <item.icon className="size-4" />
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
