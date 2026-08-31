import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Accordion({ children }: { children: ReactNode }) {
  return (
    <AccordionPrimitive.Root
      type="multiple"
      className="my-5 divide-y divide-border overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface"
    >
      {children}
    </AccordionPrimitive.Root>
  );
}

export function AccordionItem({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <AccordionPrimitive.Item value={title}>
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          className={cn(
            "flex w-full items-center justify-between gap-3 px-4 py-3 text-start text-sm font-medium",
            "hover:bg-surface-2 [&[data-state=open]>svg]:rotate-180",
          )}
        >
          {title}
          <ChevronDown className="size-4 shrink-0 text-muted transition-transform duration-[var(--motion-fast)]" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="px-4 pt-0 pb-4 text-sm leading-relaxed text-muted [&_p]:my-0">
          {children}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
