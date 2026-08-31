import { createFileRoute } from "@tanstack/react-router";
import { getSearchIndex } from "@/lib/content-loader";

export const Route = createFileRoute("/search-index.json")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(getSearchIndex(), {
          headers: {
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
