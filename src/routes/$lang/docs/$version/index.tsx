import { createFileRoute, redirect } from "@tanstack/react-router";
import { firstPageHref } from "@/lib/content-loader";

export const Route = createFileRoute("/$lang/docs/$version/")({
  beforeLoad: ({ params }) => {
    const href = firstPageHref(params.lang, params.version);
    if (!href) return;
    throw redirect({ to: href as never });
  },
  component: () => null,
});
