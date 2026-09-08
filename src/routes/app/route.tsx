import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { CaptureBox } from "@/components/ridge/CaptureBox";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app")({
  component: AppShell,
});

function AppShell() {
  const router = useRouter();
  const [captureOpen, setCaptureOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === "e") {
        event.preventDefault();
        setCaptureOpen(true);
        return;
      }
      if (!typing && event.key === "/") {
        event.preventDefault();
        setCaptureOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-3 px-4">
          <Logo href={"/app" as never} />
          <nav className="ms-4 hidden items-center gap-3 text-sm sm:flex">
            <Link to="/app" className="text-foreground">
              Trajectory
            </Link>
          </nav>
          <div className="ms-auto flex items-center gap-1">
            <Button size="sm" variant="outline" onClick={() => setCaptureOpen(true)}>
              Capture
              <kbd className="ms-1 hidden font-mono text-[10px] text-faint sm:inline">/</kbd>
            </Button>
            <ThemeToggle lang="en" />
          </div>
        </div>
      </header>
      <CaptureBox
        open={captureOpen}
        onOpenChange={setCaptureOpen}
        onCaptured={() => {
          void router.invalidate();
        }}
      />
      <Outlet />
    </div>
  );
}
