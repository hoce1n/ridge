import { createFileRoute, notFound } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { Suspense } from "react";
import { OpenIn } from "@/components/layout/OpenIn";
import { PrevNext } from "@/components/layout/PrevNext";
import { Toc } from "@/components/layout/Toc";
import { MdxRuntime } from "@/components/mdx/MdxRuntime";
import { docsConfig, githubEditUrl } from "@/config/docs.config";
import { t } from "@/config/i18n";
import { getDocPage } from "@/lib/content-loader";
import { compileMdx } from "@/lib/mdx";

export const Route = createFileRoute("/$lang/docs/$version/$")({
  loader: async ({ params }) => {
    const slug = (params._splat ?? "").split("/").filter(Boolean);
    const page = getDocPage(params.lang, params.version, slug);
    if (!page) throw notFound();
    const compiled = await compileMdx(page.body);
    return { compiled, page };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { page } = loaderData;
    const title = `${page.title} · ${docsConfig.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: page.description },
      ],
      links: [
        {
          rel: "canonical",
          href: `${docsConfig.siteUrl}${page.href}`,
        },
      ],
    };
  },
  component: DocPage,
});

function DocPage() {
  const { compiled, page } = Route.useLoaderData();
  const { lang } = Route.useParams();

  return (
    <div className="flex min-w-0 flex-1">
      <article
        id="doc-content"
        className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-start justify-between gap-3">
            <p className="text-xs font-semibold tracking-widest text-faint uppercase">
              {page.slug[0]?.replace(/-/g, " ")}
            </p>
            <OpenIn />
          </div>
          <div className="doc-prose">
            <h1>{page.title}</h1>
            <p className="!mt-0 text-lg text-muted">{page.description}</p>
            <Suspense
              fallback={
                <div className="mt-8 h-40 animate-pulse rounded-[var(--radius-md)] bg-surface-2" />
              }
            >
              <MdxRuntime compiled={compiled} />
            </Suspense>
          </div>
          <p className="mt-10">
            <a
              href={githubEditUrl(page.filePath)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
            >
              <Github className="size-4" />
              {t(lang, "editOnGitHub")}
            </a>
          </p>
          <PrevNext />
        </div>
      </article>
      <Toc />
    </div>
  );
}
