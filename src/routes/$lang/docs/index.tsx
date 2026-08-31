import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { docsConfig, isLocale } from "@/config/docs.config";
import { firstPageHref } from "@/lib/content-loader";

export const Route = createFileRoute("/$lang/docs/")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.lang)) throw notFound();
    const href =
      firstPageHref(params.lang, docsConfig.defaultVersion) ??
      `/${params.lang}/docs/${docsConfig.defaultVersion}`;
    throw redirect({ to: href as never });
  },
  component: () => null,
});
