import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function RidgeMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      aria-hidden
    >
      <rect
        width="32"
        height="32"
        rx="8"
        className="fill-foreground"
      />
      <path
        d="M6 22 L12 12 L16 18 L20 10 L26 22"
        fill="none"
        className="stroke-background"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      to={href}
      className={cn("flex items-center gap-2.5 text-foreground", className)}
    >
      <RidgeMark />
      <span className="font-display text-xl tracking-tight">Ridge</span>
    </Link>
  );
}
