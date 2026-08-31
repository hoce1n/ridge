import { use } from "react";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { runMdx } from "@/lib/mdx";

export function MdxRuntime({ compiled }: { compiled: string }) {
  const Content = use(runMdx(compiled));
  return <Content components={mdxComponents} />;
}
