export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
  children: TocItem[];
};

export type Heading = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

export type DocFrontmatter = {
  title: string;
  description: string;
  sidebarTitle?: string;
  order?: number;
  hidden?: boolean;
};

export type DocPage = {
  slug: string[];
  href: string;
  lang: string;
  version: string;
  filePath: string;
  title: string;
  description: string;
  sidebarTitle: string;
  order: number;
  hidden: boolean;
  body: string;
  raw: string;
  toc: TocItem[];
  headings: Heading[];
};

export type DocSection = {
  id: string;
  title: string;
  pages: DocPage[];
  sections: DocSection[];
};

export type DocTree = {
  lang: string;
  version: string;
  sections: DocSection[];
  pages: DocPage[];
};

export type SearchEntry = {
  href: string;
  title: string;
  description: string;
  section: string;
  snippet: string;
  headings: string[];
  lang: string;
  version: string;
};

export type Neighbor = {
  href: string;
  title: string;
  sidebarTitle: string;
};

export type DocNeighbors = {
  prev: Neighbor | null;
  next: Neighbor | null;
};
