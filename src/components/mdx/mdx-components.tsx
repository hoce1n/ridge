import { Link } from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ComponentType } from "react";
import { Accordion, AccordionItem } from "@/components/mdx/Accordion";
import { Callout } from "@/components/mdx/Callout";
import { CodeBlock, InlineCode } from "@/components/mdx/CodeBlock";
import { H1, H2, H3, H4 } from "@/components/mdx/HeadingAnchor";
import { ImageZoom } from "@/components/mdx/ImageZoom";
import { Tab, Tabs } from "@/components/mdx/Tabs";

function MdxLink({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!href) return <a {...props}>{children}</a>;
  const external =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:");
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props}>
        {children}
      </a>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href as never} {...props}>
      {children}
    </Link>
  );
}

export const mdxComponents: Record<string, ComponentType<never> | unknown> = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  a: MdxLink,
  pre: CodeBlock,
  code: InlineCode,
  img: ImageZoom,
  Callout,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
  ImageZoom,
};
