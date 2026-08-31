import * as TabsPrimitive from "@radix-ui/react-tabs";
import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export function Tab({
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return <>{children}</>;
}

export function Tabs({
  items,
  children,
}: {
  items?: string[];
  children: ReactNode;
}) {
  const tabs = Children.toArray(children).filter(
    (child): child is ReactElement<{ title: string; children: ReactNode }> =>
      isValidElement(child),
  );
  const titles = items ?? tabs.map((tab, i) => tab.props.title ?? `Tab ${i + 1}`);
  const defaultValue = titles[0] ?? "0";

  return (
    <TabsPrimitive.Root defaultValue={defaultValue} className="my-5">
      <TabsPrimitive.List className="relative flex gap-1 overflow-x-auto border-b border-border">
        {titles.map((title) => (
          <TabsPrimitive.Trigger
            key={title}
            value={title}
            className={cn(
              "relative -mb-px shrink-0 px-3 py-2 text-sm text-muted transition-colors",
              "hover:text-foreground",
              "data-[state=active]:text-foreground data-[state=active]:after:absolute data-[state=active]:after:inset-x-2 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-accent",
            )}
          >
            {title}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {tabs.map((tab, i) => {
        const title = titles[i] ?? String(i);
        return (
          <TabsPrimitive.Content
            key={title}
            value={title}
            className="pt-3 outline-none"
          >
            {tab.props.children}
          </TabsPrimitive.Content>
        );
      })}
    </TabsPrimitive.Root>
  );
}
