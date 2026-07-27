import { designPrinciples } from "./docs/design-principles";
import { fullBleedCss } from "./docs/full-bleed-css";
import { readingDisabilities } from "./docs/reading-disabilities";
import { touchEvents } from "./docs/touch-events";

export type ArticleRule = {
  number: number;
  title: string;
  body: string;
};

// --- Long-form "doc" article content model ---------------------------------

export type DocHeading = { kind: "heading"; text: string; level?: 2 | 3 };
export type DocParagraph = { kind: "paragraph"; text: string };
export type DocAscii = { kind: "ascii"; art: string; caption?: string };
export type DocCode = {
  kind: "code";
  language: string;
  code: string;
  label?: "Bad" | "Good";
  caption?: string;
  /** Equivalent Tailwind utility classes, shown as a second block under the CSS. */
  tailwind?: string;
};
export type DocCallout = {
  kind: "callout";
  variant: "tip" | "note" | "warning";
  text: string;
};
export type DocList = { kind: "list"; items: string[]; ordered?: boolean };
export type DocComparisonSide = {
  label: string;
  code?: string;
  language?: string;
  points: string[];
};
export type DocComparison = {
  kind: "comparison";
  before: DocComparisonSide;
  after: DocComparisonSide;
};
export type DocTable = { kind: "table"; headers: string[]; rows: string[][] };
export type DocMindMapBranch = { label: string; children?: string[] };
export type DocMindMap = {
  kind: "mindmap";
  root: string;
  branches: DocMindMapBranch[];
  caption?: string;
};
export type DocDemoPane = {
  label: string;
  status?: "bad" | "good";
  /** Pure CSS shown above the live preview. */
  code?: string;
  /** Equivalent Tailwind utility classes, shown under the CSS. */
  tailwind?: string;
  /** srcDoc generator. Receives the shared toggle's on/off state (false if this demo has no toggle). */
  html: (on: boolean) => string;
};
export type DocDemoToggle = {
  label: string;
  defaultOn?: boolean;
};
export type DocDemo = {
  kind: "demo";
  panes: DocDemoPane[];
  toggle?: DocDemoToggle;
  height?: number;
  caption?: string;
};
export type DocCaniuse = {
  kind: "caniuse";
  /** caniuse.com feature slug — verify it resolves at caniuse.com/<slug> before using it. */
  feature: string;
  /** Display label above the embed; defaults to the raw feature slug. */
  title?: string;
  caption?: string;
};

export type DocSection =
  | DocHeading
  | DocParagraph
  | DocAscii
  | DocCode
  | DocCallout
  | DocList
  | DocComparison
  | DocTable
  | DocDemo
  | DocCaniuse
  | DocMindMap;

export type RulesArticle = {
  kind: "rules";
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  rules: ArticleRule[];
  credit?: { label: string; href: string };
};

export type DocArticle = {
  kind: "doc";
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  sections: DocSection[];
  credit?: { label: string; href: string };
};

export type Article = RulesArticle | DocArticle;

export const articles: Article[] = [
  designPrinciples,
  fullBleedCss,
  readingDisabilities,
  touchEvents,
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
