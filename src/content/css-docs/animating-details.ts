import type { CssDoc } from "../cssDocs";

// --- Live demo HTML generators ----------------------------------------------
// Sandboxed iframes (sandbox="", no scripts) — every demo is triggered by
// clicking <summary> directly, so no toggle button is needed to see it work.
// Plain CSS only — matches each pane's `code` field 1:1.

function shell(styleBlock: string, bodyHtml: string) {
  return `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    font: 13px/1.5 system-ui, sans-serif;
    color: #171717;
    background: #fff;
    padding: 16px;
  }
  summary { cursor: pointer; font-weight: 600; }
  p { margin: 8px 0 0; color: #404040; }
  ${styleBlock}
</style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
}

const jumpCutHtml = () =>
  shell(
    "",
    `<details>
      <summary>Shipping details</summary>
      <p>Orders ship within 2 business days.</p>
    </details>`,
  );

const fadeHtml = () =>
  shell(
    `
    details::details-content {
      opacity: 0;
      color: dodgerblue;
      padding: 0.5em;
      border: thin solid grey;
      transition: opacity 600ms, content-visibility 600ms allow-discrete;
    }
    details[open]::details-content { opacity: 1; }
  `,
    `<details>
      <summary>Shipping details</summary>
      <p>Orders ship within 2 business days. Both open and close fade.</p>
    </details>`,
  );

export const animatingDetailsDoc: CssDoc = {
  slug: "animating-details",
  title: "Animating <details>",
  category: "CSS technique",
  excerpt:
    "There's no built-in way to animate <details> open/close. `::details-content` gets you a fade in both directions, using content-visibility: allow-discrete to keep the content visible for the length of the transition.",
  sections: [
    { kind: "heading", text: "The problem" },
    {
      kind: "paragraph",
      text: "MDN is direct about this: **\"there's no built-in way to animate the transition between open and closed.\"** Content just appears and disappears — nothing to interpolate.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Default <details>",
          status: "bad",
          html: jumpCutHtml,
        },
      ],
      height: 110,
      caption: "Click the summary — content appears and disappears instantly, no interpolation at all.",
    },

    { kind: "heading", text: "Syntax" },
    {
      kind: "code",
      language: "css",
      code: "details::details-content {\n  opacity: 0;\n  transition:\n    opacity 600ms,\n    content-visibility 600ms allow-discrete;\n}\n\ndetails[open]::details-content {\n  opacity: 1;\n}",
      caption: "The `::details-content` recipe from MDN — a plain opacity fade.",
    },

    { kind: "heading", text: "The ::details-content fix" },
    {
      kind: "paragraph",
      text: "`::details-content` selects the collapsible region directly, no wrapper element needed. Transitioning its `opacity` fades the content in and out. On its own that's the whole trick — but closing would still cut instantly, because `content-visibility` switches the content to hidden the moment `[open]` is removed, `==before the opacity transition has a chance to play==`.",
    },
    {
      kind: "paragraph",
      text: "`content-visibility 600ms allow-discrete` fixes that: it opts `content-visibility` into a transition, so the content stays visible for the full 600ms instead of vanishing on the first frame.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "::details-content + opacity fade",
          status: "good",
          code: "details::details-content {\n  opacity: 0;\n  color: dodgerblue;\n  padding: 0.5em;\n  border: thin solid grey;\n  transition:\n    opacity 600ms,\n    content-visibility 600ms allow-discrete;\n}\ndetails[open]::details-content {\n  opacity: 1;\n}",
          html: fadeHtml,
        },
      ],
      height: 110,
      caption: "Both open and close fade — no wrapper markup, just the pseudo-element and two rules.",
    },
    {
      kind: "callout",
      variant: "note",
      text: "This is a ==progressive enhancement==, not a baseline: browsers that don't support `::details-content` just get the instant, correct toggle with no animation.",
    },

    { kind: "heading", text: "Can I use" },
    {
      kind: "caniuse",
      feature: "details",
      title: "<details> element",
    },
    {
      kind: "caniuse",
      feature: "mdn-css_selectors_details-content",
      title: "::details-content",
      variant: "link",
    },
    {
      kind: "caniuse",
      feature: "mdn-css_properties_transition-behavior",
      title: "transition-behavior: allow-discrete",
      caption: "Needed so content-visibility can wait until the close transition finishes.",
    },
  ],
};
