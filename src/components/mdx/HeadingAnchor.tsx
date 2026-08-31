import { Link as LinkIcon } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";
import { copyText } from "@/components/ui/CopyButton";
import { cn } from "@/lib/utils";

function Heading({
  as: Tag,
  children,
  id,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & {
  as: "h1" | "h2" | "h3" | "h4";
  children?: ReactNode;
}) {
  return (
    <Tag id={id} className={cn("group scroll-mt-24", className)} {...props}>
      <span>{children}</span>
      {id ? (
        <button
          type="button"
          aria-label="Copy link to heading"
          className="ms-2 inline-flex size-6 translate-y-px items-center justify-center rounded-[var(--radius-xs)] text-faint opacity-0 transition-opacity group-hover:opacity-100 hover:bg-surface-2 hover:text-foreground focus-visible:opacity-100"
          onClick={async () => {
            const url = `${window.location.origin}${window.location.pathname}#${id}`;
            await copyText(url);
            window.history.replaceState(null, "", `#${id}`);
          }}
        >
          <LinkIcon className="size-3.5" />
        </button>
      ) : null}
    </Tag>
  );
}

export const H1 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <Heading as="h1" {...props} />
);
export const H2 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <Heading as="h2" {...props} />
);
export const H3 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <Heading as="h3" {...props} />
);
export const H4 = (props: HTMLAttributes<HTMLHeadingElement>) => (
  <Heading as="h4" {...props} />
);
