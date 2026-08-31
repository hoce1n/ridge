import { AlertTriangle, Info, Lightbulb, OctagonAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const styles = {
  info: {
    icon: Info,
    className: "border-info/25 bg-info/8 text-foreground",
    iconClass: "text-info",
    label: "Note",
  },
  tip: {
    icon: Lightbulb,
    className: "border-tip/25 bg-tip/8 text-foreground",
    iconClass: "text-tip",
    label: "Tip",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-warn/30 bg-warn/10 text-foreground",
    iconClass: "text-warn",
    label: "Warning",
  },
  danger: {
    icon: OctagonAlert,
    className: "border-danger/30 bg-danger/10 text-foreground",
    iconClass: "text-danger",
    label: "Caution",
  },
} as const;

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof styles;
  title?: string;
  children: ReactNode;
}) {
  const spec = styles[type] ?? styles.info;
  const Icon = spec.icon;
  return (
    <aside
      className={cn(
        "my-5 flex gap-3 rounded-[var(--radius-md)] border px-4 py-3.5",
        spec.className,
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", spec.iconClass)} />
      <div className="min-w-0 text-[0.95rem] leading-relaxed [&_p]:my-0 [&_p+p]:mt-2">
        <p className="mb-1 font-medium">{title ?? spec.label}</p>
        {children}
      </div>
    </aside>
  );
}
