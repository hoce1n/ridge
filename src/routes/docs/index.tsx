import { createFileRoute, redirect } from "@tanstack/react-router";
import { docsConfig } from "@/config/docs.config";
import { firstPageHref } from "@/lib/content-loader";

export const Route = createFileRoute("/docs/")({
  beforeLoad: () => {
    const href =
      firstPageHref(docsConfig.defaultLocale, docsConfig.defaultVersion) ??
      `/${docsConfig.defaultLocale}/docs/${docsConfig.defaultVersion}`;
    throw redirect({ to: href as never });
  },
  component: () => null,
});
