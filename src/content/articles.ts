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
export type DocListIcon =
  | "priority"
  | "responsive"
  | "global"
  | "task"
  | "pause"
  | "support"
  | "search"
  | "split"
  | "label"
  | "shield"
  | "clock"
  | "cursor"
  | "eye"
  | "cancel";
export type DocList = {
  kind: "list";
  items: string[];
  ordered?: boolean;
  icons?: DocListIcon[];
};
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
export type DocDemoPaneBase = {
  label: string;
  status?: "bad" | "good";
  /** Equivalent Tailwind utility classes, shown under the CSS. */
  tailwind?: string;
};

/** Static, read-only pane — today's behavior. */
export type DocDemoPaneStatic = DocDemoPaneBase & {
  editable?: false;
  /** Pure CSS shown above the live preview. */
  code?: string;
  /** srcDoc generator. Receives the shared toggle's on/off state (false if this demo has no toggle). */
  html: (on: boolean) => string;
};

/**
 * Editable, CodePen-style pane — the renderer wraps `htmlSource`/`cssSource`
 * into a full document (shared minimal shell) and re-renders live as the
 * reader edits either textarea. `html`/`code` are ignored for this shape.
 */
export type DocDemoPaneEditable = DocDemoPaneBase & {
  editable: true;
  /** Body markup, edited live in an HTML textarea. */
  htmlSource: string;
  /** CSS, edited live in a CSS textarea. */
  cssSource: string;
  /** Optional per-toggle-state override of the starting htmlSource/cssSource. */
  onSource?: { htmlSource?: string; cssSource: string };
};

export type DocDemoPane = DocDemoPaneStatic | DocDemoPaneEditable;
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
  /**
   * "embed" (default) is the live, interactive iframe. "image" renders a
   * static PNG snapshot from the same service instead. "link" renders a
   * plain bordered card linking out to caniuse.com — no third-party embed
   * fetch at all; use this for feature slugs the embed service doesn't
   * have data for (e.g. some mdn-* BCD-sourced slugs return "Feature not
   * found" in both the embed and image variants).
   */
  variant?: "embed" | "image" | "link";
};

export type DocPlayground = {
  kind: "playground";
  /** Seed source shown in the editor on first load. */
  code: string;
  height?: number;
  caption?: string;
};

/**
 * A live, script-running demo for the Scheduler API doc. Unlike `demo`
 * (script-less CSS iframes) these run real JS on the page's own main thread —
 * that's the point: the blocking variants genuinely block, and input delay is
 * measured from real `event.timeStamp` values. Rendered by SchedulerDemo.tsx.
 *
 * `parallel` is the exception: an animated timeline diagram, not a benchmark.
 * It contrasts true parallelism (two threads at once) with the interleaving
 * `yield()` actually gives you, so nothing about it is measured.
 *
 * `priority` runs real `postTask()` calls (queued worst-first) to show run
 * order diverging from queue order; where `postTask` is unavailable it
 * emulates the ordering and says so in its footer.
 */
export type DocSchedulerDemo = {
  kind: "scheduler-demo";
  demo: "click" | "search" | "table" | "parallel" | "priority";
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
  | DocMindMap
  | DocPlayground
  | DocSchedulerDemo;

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
