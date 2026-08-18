import type { Article, DocSection } from "../content/articles";
import type { CssDoc } from "../content/cssDocs";
import type { JsDoc } from "../content/jsDocs";

const WORDS_PER_MINUTE = 200;

function sectionWordCount(section: DocSection): number {
  switch (section.kind) {
    case "heading":
    case "paragraph":
      return section.text.split(/\s+/).filter(Boolean).length;
    case "list":
      return section.items.join(" ").split(/\s+/).filter(Boolean).length;
    case "callout":
      return section.text.split(/\s+/).filter(Boolean).length;
    case "table":
      return section.rows.flat().join(" ").split(/\s+/).filter(Boolean).length;
    case "comparison":
      return (
        section.before.points.join(" ").split(/\s+/).filter(Boolean).length +
        section.after.points.join(" ").split(/\s+/).filter(Boolean).length
      );
    case "code":
    case "ascii":
    case "demo":
    case "caniuse":
    case "mindmap":
    case "playground":
      return 0;
  }
}

/** Rough "N min read" estimate at ~200wpm, floored at 1 minute. */
export function readingTimeFor(sections: DocSection[]): number {
  const words = sections.reduce((total, section) => total + sectionWordCount(section), 0);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function readingTimeForArticle(article: Article): number {
  if (article.kind === "rules") {
    const words = article.rules
      .map((rule) => `${rule.title} ${rule.body}`)
      .join(" ")
      .split(/\s+/)
      .filter(Boolean).length;
    return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  }
  return readingTimeFor(article.sections);
}

export function readingTimeForCssDoc(doc: CssDoc): number {
  return readingTimeFor(doc.sections);
}

export function readingTimeForJsDoc(doc: JsDoc): number {
  return readingTimeFor(doc.sections);
}
