export type ArticleRule = {
  number: number;
  title: string;
  body: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  rules: ArticleRule[];
  credit?: { label: string; href: string };
};

export const articles: Article[] = [
  {
    slug: "design-principles",
    title: "The design rules this site follows",
    excerpt:
      "Twelve small, opinionated rules for restrained, high-contrast interfaces — the ones this site is built on.",
    date: "2026-07-21",
    credit: {
      label: "Inspired by Anthony Hobday's “Rules for Visual Design”",
      href: "https://anthonyhobday.com/sideprojects/saferules/",
    },
    rules: [
      {
        number: 1,
        title: "Never use pure black or pure white",
        body: "Pure #000 on pure #fff is harsher than it needs to be. Near-black on near-white keeps the same contrast with less strain — every color token here is a shade off true black or white.",
      },
      {
        number: 2,
        title: "Every gap should be deliberate",
        body: "Spacing isn't filler between elements, it's the thing that makes hierarchy readable. This site uses one fixed scale (4, 8, 12, 16, 24, 32…) instead of arbitrary pixel values, so every gap means something.",
      },
      {
        number: 3,
        title: "Body text is never smaller than 16px",
        body: "Below 16px, text asks the reader to lean in. This site's base size is 17px with 1.55 line-height — comfortable at arm's length, on any screen.",
      },
      {
        number: 4,
        title: "Keep line length under ~70 characters",
        body: "Long lines make the eye lose its place on the way back. Paragraphs here are capped with a `measure` token so a line of text stays a comfortable read.",
      },
      {
        number: 5,
        title: "Tighten large type, loosen small type",
        body: "Big headings look looser than they read because of the extra white space inside each letterform — negative letter-spacing corrects for it. Small text gets the opposite treatment.",
      },
      {
        number: 6,
        title: "Pick a border or a shadow, not both",
        body: "Mixing hairline borders with drop shadows implies two different lighting models on the same surface. This site uses flat borders only — no shadows.",
      },
      {
        number: 7,
        title: "Nest corner radii proportionally",
        body: "An inner element's corner radius should roughly equal the outer radius minus the padding between them, or the two curves visually fight each other.",
      },
      {
        number: 8,
        title: "Contrast carries hierarchy, not just size",
        body: "A muted gray at the same size as heading text still reads as secondary. This site leans on the near-black/muted-gray pair as much as it leans on font size.",
      },
      {
        number: 9,
        title: "Buttons: width and height are a ratio, not a guess",
        body: "Horizontal padding runs roughly twice the vertical padding, so a button never looks accidentally square or accidentally like a pill.",
      },
      {
        number: 10,
        title: "Alignment is optical, not just mathematical",
        body: "Centering by bounding box can look off for triangular or asymmetric glyphs and icons — nudge by eye when the math technically lines up but visually doesn't.",
      },
      {
        number: 11,
        title: "One accent, used rarely",
        body: "A monochrome palette still needs a way to say “click here.” This site inverts foreground and background on hover/focus instead of introducing a new color.",
      },
      {
        number: 12,
        title: "Motion is short and eases out",
        body: "Interface transitions here run under 200ms on a gentle ease-out curve — long enough to feel intentional, short enough to never be waited on.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
