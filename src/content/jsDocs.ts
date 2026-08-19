import type { DocSection } from "./articles";
import { generatorsDoc } from "./js-docs/generators";
import { generatorMethodsDoc } from "./js-docs/generator-methods";
import { generatorTipsDoc } from "./js-docs/generator-tips";
import { schedulerApiDoc } from "./js-docs/scheduler-api";
import { schedulerPostTaskDoc } from "./js-docs/scheduler-post-task";
import { schedulerYieldDoc } from "./js-docs/scheduler-yield";

// --- JS reference docs ------------------------------------------------------
// Same shape as cssDocs.ts, for JavaScript language features instead of CSS
// properties: short, feature-focused reference pages (MDN-style basics + a
// live demo/playground + browser support), not long-form articles. Lives in
// its own top-level nav section ("JS Docs").
//
// Adding a new entry = new file in `src/content/js-docs/` + one
// import/array entry here. Reuses `DocSection` (and `DocContent`) from the
// article system since the section kinds (code, list, table, playground,
// caniuse, ...) are identical.

export type JsDoc = {
  slug: string;
  title: string;
  /** e.g. "operator", "syntax" — shown as a small label above the title. */
  category: string;
  excerpt: string;
  sections: DocSection[];
};

export const jsDocs: JsDoc[] = [
  generatorsDoc,
  generatorMethodsDoc,
  generatorTipsDoc,
  schedulerApiDoc,
  schedulerPostTaskDoc,
  schedulerYieldDoc,
];

export function getJsDoc(slug: string): JsDoc | undefined {
  return jsDocs.find((doc) => doc.slug === slug);
}
