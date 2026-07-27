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
