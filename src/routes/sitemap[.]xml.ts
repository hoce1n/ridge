import { createFileRoute } from "@tanstack/react-router";
import { docsConfig } from "@/config/docs.config";
import { getAllDocs } from "@/lib/content-loader";

function xmlEscape(value: string): string {
  return value
    .replaceAll("&", "&" + "amp;")
    .replaceAll("<", "&" + "lt;")
    .replaceAll(">", "&" + "gt;")
    .replaceAll('"', "&" + "quot;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const pages = getAllDocs().filter((page) => !page.hidden);
        const urls = [
          `${docsConfig.siteUrl}/`,
          ...pages.map((page) => `${docsConfig.siteUrl}${page.href}`),
        ];
        const rows = urls
          .map((url) => {
            const loc = xmlEscape(url);
            return "  <url><loc>" + loc + "</loc><changefreq>weekly</changefreq></url>";
          })
          .join("\n");
        const body =
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          rows +
          "\n</urlset>\n";
        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
