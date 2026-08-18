import { articles, type DocSection } from "../content/articles";
import { cssDocs } from "../content/cssDocs";
import { jsDocs } from "../content/jsDocs";

export type SearchResult = {
  slug: string;
  href: string;
  title: string;
  category: string;
  excerpt: string;
  /** Lowercased title + excerpt + heading text, used for matching. */
  haystack: string;
};

function headingText(sections: DocSection[]): string {
  return sections
    .filter((section): section is Extract<DocSection, { kind: "heading" }> => section.kind === "heading")
    .map((section) => section.text)
    .join(" ");
}

function buildIndex(): SearchResult[] {
  const fromArticles: SearchResult[] = articles.map((article) => ({
    slug: article.slug,
    href: `/articles/${article.slug}`,
    title: article.title,
    category: article.kind === "doc" ? article.category : "Rules",
    excerpt: article.excerpt,
    haystack: [
      article.title,
      article.excerpt,
      article.kind === "doc" ? headingText(article.sections) : article.rules.map((r) => `${r.title} ${r.body}`).join(" "),
    ]
      .join(" ")
      .toLowerCase(),
  }));

  const fromCssDocs: SearchResult[] = cssDocs.map((doc) => ({
    slug: doc.slug,
    href: `/css-docs/${doc.slug}`,
    title: doc.title,
    category: doc.category,
    excerpt: doc.excerpt,
    haystack: [doc.title, doc.excerpt, headingText(doc.sections)].join(" ").toLowerCase(),
  }));

  const fromJsDocs: SearchResult[] = jsDocs.map((doc) => ({
    slug: doc.slug,
    href: `/js-docs/${doc.slug}`,
    title: doc.title,
    category: doc.category,
    excerpt: doc.excerpt,
    haystack: [doc.title, doc.excerpt, headingText(doc.sections)].join(" ").toLowerCase(),
  }));

  return [...fromArticles, ...fromCssDocs, ...fromJsDocs];
}

let cached: SearchResult[] | undefined;

export function getSearchIndex(): SearchResult[] {
  if (!cached) cached = buildIndex();
  return cached;
}

export function search(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getSearchIndex().filter((entry) => entry.haystack.includes(q));
}
