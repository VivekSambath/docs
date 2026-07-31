import type { MouseEvent } from "react";
import type { DocSection } from "../content/articles";

// This site uses a hash router (URLs live in location.hash), so real `#id`
// anchor links would hijack routing instead of scrolling. Scroll manually.
export function scrollToId(id: string) {
  return (event: MouseEvent) => {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getHeadings(sections: DocSection[]) {
  return sections
    .filter((section): section is Extract<DocSection, { kind: "heading" }> =>
      section.kind === "heading",
    )
    .map((section) => ({ id: slugify(section.text), text: section.text, level: section.level ?? 2 }));
}

export type SectionSpotlight = {
  id: string;
  text: string;
  level: 2 | 3;
  callout?: Extract<DocSection, { kind: "callout" }>;
};

// Pairs each heading with the first callout that follows it (and precedes the
// next heading) — the "spotlight" a scroll-spy rail can surface for whatever
// section is currently in view.
export function getSectionSpotlights(sections: DocSection[]): SectionSpotlight[] {
  const spotlights: SectionSpotlight[] = [];
  let current: SectionSpotlight | null = null;

  for (const section of sections) {
    if (section.kind === "heading") {
      current = { id: slugify(section.text), text: section.text, level: section.level ?? 2 };
      spotlights.push(current);
    } else if (section.kind === "callout" && current && !current.callout) {
      current.callout = section;
    }
  }

  return spotlights;
}
