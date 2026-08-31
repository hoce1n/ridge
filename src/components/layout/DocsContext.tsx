import { createContext, useContext, type ReactNode } from "react";
import type { DocPage, DocTree } from "@/lib/content-model";

export type DocsContextValue = {
  tree: DocTree;
  lang: string;
  version: string;
  page: DocPage | null;
};

const DocsContext = createContext<DocsContextValue | null>(null);

export function DocsProvider({
  value,
  children,
}: {
  value: DocsContextValue;
  children: ReactNode;
}) {
  return <DocsContext.Provider value={value}>{children}</DocsContext.Provider>;
}

export function useDocs() {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error("useDocs must be used within DocsProvider");
  return ctx;
}

export function useDocsOptional() {
  return useContext(DocsContext);
}
