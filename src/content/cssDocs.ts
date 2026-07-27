import type { DocSection } from "./articles";
import { animationTimelineDoc } from "./css-docs/animation-timeline";
import { contrastColorDoc } from "./css-docs/contrast-color";
import { transitionsDoc } from "./css-docs/transitions";

// --- CSS reference docs -----------------------------------------------------
// A separate content model from `articles.ts`'s `Article` union: short,
// function/property-focused reference pages (MDN-style basics + a live demo +
// a caniuse embed), not long-form articles. Lives in its own top-level nav
// section ("CSS Docs") rather than under "Articles".
//
// Adding a new entry = new file in `src/content/css-docs/` + one
// import/array entry here. Reuses `DocSection` (and `DocContent`) from the
// article system since the section kinds (demo, code, caniuse, ...) are
// identical.

export type CssDoc = {
  slug: string;
  title: string;
  /** e.g. "color function", "property" — shown as a small label above the title. */
  category: string;
  excerpt: string;
  sections: DocSection[];
};

export const cssDocs: CssDoc[] = [contrastColorDoc, transitionsDoc, animationTimelineDoc];

export function getCssDoc(slug: string): CssDoc | undefined {
  return cssDocs.find((doc) => doc.slug === slug);
}
