import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { DocsProvider } from "@/components/layout/DocsContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { isLocale, isVersion } from "@/config/docs.config";
import { getDocPage, getDocTree } from "@/lib/content-loader";

export const Route = createFileRoute("/$lang/docs/$version")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.lang) || !isVersion(params.version)) {
      throw notFound();
    }
  },
  loader: ({ params, location }) => {
    const tree = getDocTree(params.lang, params.version);
    if (!tree) throw notFound();
    const prefix = `/${params.lang}/docs/${params.version}`;
    const rest = location.pathname
      .slice(prefix.length)
      .split("/")
      .filter(Boolean);
    const page = getDocPage(params.lang, params.version, rest) ?? null;
    return { tree, lang: params.lang, version: params.version, page };
  },
  component: DocsShell,
});

function DocsShell() {
  const data = Route.useLoaderData();
  return (
    <DocsProvider value={data}>
      <a
        href="#doc-content"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-sm)] focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>
      <Header />
      <div className="mx-auto flex max-w-[1440px]">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-64 shrink-0 overflow-y-auto border-e border-border md:block">
          <Sidebar />
        </aside>
        <Outlet />
      </div>
    </DocsProvider>
  );
}
