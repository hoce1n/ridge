export function slugFromBody(body: string): string {
  const line = body.split("\n").find((l) => l.trim().length > 0) || "event";
  const cleaned = line
    .replace(/^#+\s*/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const slug = cleaned.slice(0, 40).replace(/-+$/, "");
  return slug.length > 0 ? slug : "event";
}