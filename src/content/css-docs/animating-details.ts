import type { CssDoc } from "../cssDocs";

// --- Live demo HTML generators ----------------------------------------------
// The single-technique demos are editable (MDN-playground style): readers
// edit the CSS textarea and the iframe re-renders instantly, no dev tools
// needed. The accordion comparison stays static/click-driven since it's a
// side-by-side of two full multi-item accordions, not a single rule to tweak.

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

// Shared accordion chrome (borders, summary layout, rotating chevron) so the
// two accordion panes differ only in the open/close technique.
const accordionChrome = `
    .acc { border: 1px solid #d4d4d4; border-radius: 10px; }
    .acc + .acc { border-top: none; border-top-left-radius: 0; border-top-right-radius: 0; }
    .acc:not(:last-child) { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
    .acc summary {
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 14px;
    }
    .acc summary::-webkit-details-marker { display: none; }
    .acc summary .chevron {
      flex-shrink: 0;
      width: 8px;
      height: 8px;
      border-right: 2px solid #737373;
      border-bottom: 2px solid #737373;
      transform: rotate(-45deg);
      transition: transform 200ms ease;
    }
    .acc[open] summary .chevron { transform: rotate(45deg); }
`;

const accordionItems = (wrapped: boolean) =>
  [
    ["Shipping", "Orders ship within 2 business days.", " open"],
    ["Returns", "Free returns within 30 days of delivery.", ""],
    ["Payment", "Cards, PayPal, and Apple Pay accepted.", ""],
  ]
    .map(([title, body, open]) =>
      wrapped
        ? `<details class="acc" name="faq"${open}>
      <summary>${title}<span class="chevron"></span></summary>
      <div class="wrapper"><div class="inner"><p>${body}</p></div></div>
    </details>`
        : `<details class="acc" name="faq"${open}>
      <summary>${title}<span class="chevron"></span></summary>
      <p>${body}</p>
    </details>`,
    )
    .join("\n    ");

const accordionGridRowsHtml = () =>
  shell(
    `${accordionChrome}
    .acc { overflow: hidden; }
    .acc .wrapper {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 260ms ease-in-out;
    }
    .acc[open] .wrapper { grid-template-rows: 1fr; }
    .acc .inner { min-height: 0; overflow: hidden; }
    .acc .inner p { margin: 0 14px 12px; color: #404040; }
  `,
    accordionItems(true),
  );

const accordionModernHtml = () =>
  shell(
    `${accordionChrome}
    :root { interpolate-size: allow-keywords; }
    .acc::details-content {
      overflow: hidden;
      opacity: 0;
      block-size: 0;
      transition: block-size 260ms ease-in-out, opacity 260ms ease-in-out, content-visibility 260ms allow-discrete;
    }
    .acc[open]::details-content { opacity: 1; block-size: auto; }
    @starting-style {
      .acc[open]::details-content { opacity: 0; block-size: 0; }
    }
    .acc p { margin: 0 14px 12px; color: #404040; }
  `,
    accordionItems(false),
  );

// --- Editable pane sources ---------------------------------------------------

const detailsHtml = `<details>
  <summary>Shipping details</summary>
  <p>Orders ship within 2 business days.</p>
</details>`;

const basicTargetingCss = `details {
  border: 1px solid #d4d4d4;
  border-radius: 8px;
}
details[open] {
  border-color: #737373;
}
details::details-content {
  background: #f5f5f5;
  padding: 0 12px;
}
details[open]::details-content {
  background: #dbeafe;
  padding: 8px 12px;
}`;

const fadeCss = `details::details-content {
  overflow: hidden;
  opacity: 0;
  max-height: 0;
  transition:
    max-height 400ms ease-in-out,
    opacity 400ms ease-in-out,
    content-visibility 400ms allow-discrete;
}
details[open]::details-content {
  opacity: 1;
  max-height: 500px;
}`;

const gridRowsCss = `.wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 260ms ease-in-out;
}
details[open] .wrapper {
  grid-template-rows: 1fr;
}
.inner {
  min-height: 0; /* required — grid items default to min-height: auto */
  overflow: hidden;
}`;

const gridRowsHtmlSource = `<details>
  <summary>Shipping details</summary>
  <div class="wrapper">
    <div class="inner">
      <p>Orders ship within 2 business days. Opens smoothly, closes as a jump cut.</p>
    </div>
  </div>
</details>`;

const modernCss = `:root {
  interpolate-size: allow-keywords;
}
details::details-content {
  overflow: hidden;
  opacity: 0;
  block-size: 0;
  transition:
    block-size 260ms ease-out,
    opacity 260ms ease-out,
    content-visibility 260ms allow-discrete;
}
details[open]::details-content {
  opacity: 1;
  block-size: auto;
}
@starting-style {
  details[open]::details-content {
    opacity: 0;
    block-size: 0;
  }
}`;

const iconHtmlSource = `<details>
  <summary>
    Shipping details
    <span class="icon"></span>
  </summary>
  <p>Orders ship within 2 business days.</p>
</details>`;

// --- @starting-style: without vs. with ---------------------------------------

const startingStyleChrome = `
  details { border: 1px solid #d4d4d4; border-radius: 8px; }
  :root { interpolate-size: allow-keywords; }
  details::details-content {
    overflow: hidden;
    opacity: 0;
    block-size: 0;
    transition: block-size 260ms ease-in-out, opacity 260ms ease-in-out, content-visibility 260ms allow-discrete;
  }
  details[open]::details-content { opacity: 1; block-size: auto; }
  details p { margin: 0 14px 12px; }
`;

const withoutStartingStyleHtml = () =>
  shell(startingStyleChrome, detailsHtml);

const withStartingStyleHtml = () =>
  shell(
    `${startingStyleChrome}
  @starting-style {
    details[open]::details-content { opacity: 0; block-size: 0; }
  }
  `,
    detailsHtml,
  );

const iconCss = `summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  list-style: none; /* remove default triangle marker */
}
summary::-webkit-details-marker {
  display: none; /* Safari's equivalent of list-style: none */
}
.icon {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(45deg);
  transition: transform 200ms ease;
}
details[open] .icon {
  transform: rotate(-135deg);
}`;

export const animatingDetailsDoc: CssDoc = {
  slug: "animating-details",
  title: "Animating <details>",
  category: "CSS technique",
  excerpt:
    "`<details>` has no built-in way to animate open/close. Three ways to fix it — a max-height + opacity fade, a grid-based height animation, and a modern interpolate-size approach that animates both open and close with no wrapper div.",
  sections: [
    { kind: "heading", text: "Syntax" },
    {
      kind: "paragraph",
      text: "Two building blocks matter here. The `open` attribute is the boolean state on `<details>` itself — present when expanded, absent when collapsed — and it's what `[open]`/`:not([open])` selectors and the DOM `.open` property key off of. `::details-content` is a pseudo-element (Baseline 2025) that targets the collapsible region — everything except the `<summary>` — directly, without needing a wrapper `<div>`.",
    },
    {
      kind: "callout",
      variant: "note",
      text: "`::details-content` works exclusively on `<details>` — it represents the browser-generated content wrapper that holds everything **except** the `<summary>`, so it can't be used on any other element.",
    },
    {
      kind: "code",
      language: "html",
      code: '<!-- open is a plain boolean attribute, toggled by the browser on click -->\n<details open>\n  <summary>Shipping details</summary>\n  <p>Orders ship within 2 business days.</p>\n</details>',
      caption: "::details-content has no markup of its own — it's an implicit box the browser wraps around everything but <summary>.",
    },
    {
      kind: "code",
      language: "css",
      code: '/* the open attribute — present only while expanded */\ndetails[open] { /* ... */ }\ndetails:not([open]) { /* ... */ }\n\n/* ::details-content — the collapsible region, no wrapper needed */\ndetails::details-content {\n  /* styles applied at all times */\n}\ndetails[open]::details-content {\n  /* styles applied only while open */\n}',
      caption: "`[open]` toggles synchronously with no transition of its own; `::details-content` is what actually gets animated, below.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Targeting [open] and ::details-content",
          status: "good",
          editable: true,
          htmlSource: detailsHtml,
          cssSource: basicTargetingCss,
        },
      ],
      height: 130,
      caption: "Click the summary — the border and the content region's background both key off `[open]`, no animation involved yet.",
    },

    { kind: "heading", text: "The problem" },
    {
      kind: "paragraph",
      text: "`<details>` resists animation for **three reasons at once**: `display` flips discretely, with no interpolation; `height: auto` isn't an animatable endpoint; and `[open]` is removed ==synchronously on close== — the content is hidden before any transition can start.",
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

    { kind: "heading", text: "Three ways to fix it" },
    {
      kind: "list",
      items: [
        "**Fix #1 — basic:** `max-height` + `opacity` on `::details-content`, open only.",
        "**Fix #2 — grid-based:** `grid-template-rows` height animation, open only.",
        "**Fix #3 — modern:** `interpolate-size` on `::details-content`, both open and close.",
      ],
    },

    { kind: "heading", text: "Fix #1: basic animation — height and opacity together" },
    {
      kind: "paragraph",
      text: "`::details-content` targets the collapsible region directly, no wrapper div needed. Transition its `opacity` alongside `max-height` — a large fixed value down to `0` — plus `content-visibility: allow-discrete` so the content stays visible long enough for the fade to play:",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "::details-content + max-height + opacity",
          status: "good",
          editable: true,
          htmlSource: detailsHtml,
          cssSource: fadeCss,
        },
      ],
      height: 150,
      caption: "Edit the CSS above and watch it update live as you type — try raising 400ms, or dropping max-height to see the fade run alone.",
    },
    {
      kind: "callout",
      variant: "note",
      text: "`max-height` needs a guessed ceiling (`500px` here) bigger than the content will ever be, and easing looks uneven near the end since the animated range is mostly empty space above the real height. Fine for small, bounded content — for anything taller or more variable, Fix #2's `grid-template-rows` tracks the real height exactly.",
    },
    {
      kind: "callout",
      variant: "note",
      text: "It only animates the open, though — closing still jump-cuts, because the browser hides the content the instant `[open]` is removed. Fine for a single collapsible, distracting for an accordion where items open and close in sequence.",
    },

    { kind: "heading", text: "Fix #2: grid-based animation" },
    {
      kind: "paragraph",
      text: "To track the real height instead of guessing a `max-height` ceiling, transition `grid-template-rows` from `0fr` to `1fr` on a wrapper, and clip an inner `overflow: hidden` element to whatever the row cuts off. Works in every evergreen browser today — but it needs an extra wrapper div, and like Fix #1, it can only animate the open.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "grid-template-rows: 0fr → 1fr",
          status: "good",
          editable: true,
          htmlSource: gridRowsHtmlSource,
          cssSource: gridRowsCss,
          tailwind:
            '<div class="grid grid-rows-[0fr] transition-[grid-template-rows] duration-260 ease-in-out [details[open]_&]:grid-rows-[1fr]">\n  <div class="min-h-0 overflow-hidden">...</div>\n</div>',
        },
      ],
      height: 150,
      caption: "Open animates in smoothly; close still jump-cuts, same as Fix #1. Try raising 260ms to see the height slow down.",
    },
    {
      kind: "callout",
      variant: "warning",
      text: "Forgetting `min-height: 0` on the inner element is **the most common bug here** — grid items default to `min-height: auto`, so `grid-template-rows: 0fr` ==silently does nothing== without it.",
    },

    { kind: "heading", text: "Fix #3: modern animation — height, both directions" },
    {
      kind: "paragraph",
      text: "Combine `::details-content` with `interpolate-size` and both problems disappear at once — no wrapper div, and both open and close animate the actual height:",
    },
    {
      kind: "list",
      items: [
        "`interpolate-size` makes `height: auto` itself animatable.",
        "`::details-content` targets the collapsible region directly — **no wrapper div**.",
        "`@starting-style` plus transitioning `content-visibility` as `allow-discrete` is ==what finally lets the close animate too== — see the transition doc for how that pair works in general.",
      ],
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Open and close it — height animates too",
          status: "good",
          editable: true,
          htmlSource: detailsHtml,
          cssSource: modernCss,
          tailwind:
            '<details class="details-content:overflow-hidden details-content:opacity-0 details-content:h-0 details-content:transition-[height,opacity,content-visibility] details-content:duration-260 details-content:transition-discrete open:details-content:opacity-100 open:details-content:h-auto starting:open:details-content:opacity-0 starting:open:details-content:h-0">',
        },
      ],
      height: 150,
      caption:
        "No wrapper markup, and closing animates too. interpolate-size has no Tailwind utility — it stays as one plain :root rule.",
    },
    {
      kind: "callout",
      variant: "tip",
      text: "This is a ==progressive enhancement, not a baseline== — unsupported browsers just fall back to an instant, correct toggle with no animation. **It's safe to ship without a manual fallback.**",
    },

    { kind: "heading", text: "Bonus: rotating the disclosure icon" },
    {
      kind: "paragraph",
      text: "The default `<summary>` marker (a triangle in most browsers) can't be animated directly, so swap it for a small element built from CSS borders and drive its rotation off the same `[open]` attribute the content transitions key off. Hide the native marker with `list-style: none` (`::-webkit-details-marker` for Safari), then transition `transform` on the icon — no JavaScript, no SVG, and it composes with any of the three fixes above.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Chevron rotates 180deg on [open]",
          status: "good",
          editable: true,
          htmlSource: iconHtmlSource,
          cssSource: iconCss,
          tailwind:
            '<summary class="flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">\n  ...\n  <span class="size-2 shrink-0 rotate-45 border-r-2 border-b-2 border-current transition-transform duration-200 [details[open]_&]:-rotate-135"></span>\n</summary>',
        },
      ],
      height: 130,
      caption: "Click the summary — the chevron flips in place instead of the browser's abrupt marker swap. Two borders on an empty span form the arrow, so it inherits `currentColor` for free and needs no image asset.",
    },
    {
      kind: "callout",
      variant: "note",
      text: "A plus/cross toggle works the same way: give the icon a `::before` and `::after`, one for each bar of a `+`, then `rotate(45deg)` the whole icon on `[open]` so it reads as a `×`.",
    },

    { kind: "heading", text: "The accordion — where fix #2 falls apart" },
    {
      kind: "paragraph",
      text: "name=\"faq\" on each <details> gives you an exclusive accordion natively, no JavaScript: opening one item closes the others. But that forced close is still a close — [open] vanishes synchronously — so with the grid-rows technique every switch snaps the old item shut while the new one eases open. Half-animated, and the accordion feel is gone. Only the ::details-content approach animates both directions, so it's the one that makes a <details> accordion actually feel like an accordion.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "grid-rows — switching snaps shut",
          status: "bad",
          code: "/* same chrome + rotating chevron in both panes */\n.acc .wrapper {\n  display: grid;\n  grid-template-rows: 0fr;\n  transition: grid-template-rows 260ms ease-in-out;\n}\n.acc[open] .wrapper { grid-template-rows: 1fr; }\n.acc .inner { min-height: 0; overflow: hidden; }",
          html: accordionGridRowsHtml,
        },
        {
          label: "::details-content — both directions ease",
          status: "good",
          code: ":root { interpolate-size: allow-keywords; }\n.acc::details-content {\n  overflow: hidden;\n  opacity: 0;\n  block-size: 0;\n  transition:\n    block-size 260ms ease-in-out,\n    opacity 260ms ease-in-out,\n    content-visibility 260ms allow-discrete;\n}\n.acc[open]::details-content {\n  opacity: 1;\n  block-size: auto;\n}\n@starting-style {\n  .acc[open]::details-content {\n    opacity: 0;\n    block-size: 0;\n  }\n}",
          html: accordionModernHtml,
        },
      ],
      height: 250,
      caption:
        "Click between items in both accordions. Left: the newly-opened item eases in but the forced-shut one vanishes instantly. Right: the closing item eases shut while the new one eases open — the real accordion feel.",
    },
    {
      kind: "callout",
      variant: "tip",
      text: "The reason the right pane eases shut instead of snapping: `@starting-style` gives the browser a defined **from** state for the newly-opened item the instant it's inserted, so `opacity`/`block-size` can transition from those starting values instead of jumping straight to their final ones — and the forced-closed item transitions normally because `[open]` was already present a frame earlier. Without it, the `::details-content` version would jump-cut exactly like the grid-rows one.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Without @starting-style — opens instantly",
          status: "bad",
          code: "details[open]::details-content {\n  opacity: 1;\n  block-size: auto;\n}\n/* no @starting-style block — no \"from\" frame to ease in from */",
          html: withoutStartingStyleHtml,
        },
        {
          label: "With @starting-style — eases in",
          status: "good",
          code: "details[open]::details-content {\n  opacity: 1;\n  block-size: auto;\n}\n@starting-style {\n  details[open]::details-content {\n    opacity: 0;\n    block-size: 0;\n  }\n}",
          html: withStartingStyleHtml,
        },
      ],
      height: 150,
      caption: "Both panes share the exact same interpolate-size + ::details-content setup — only the @starting-style block differs. Click to open, then close, and compare.",
    },
    {
      kind: "table",
      headers: ["", "Without @starting-style", "With @starting-style"],
      rows: [
        ["block-size and opacity are animatable", "Yes — interpolate-size covers that", "Yes — same"],
        ["\"From\" frame when opening", "None defined — browser has nothing to ease from", "opacity: 0; block-size: 0, set explicitly"],
        ["Opening", "Jump cut — pops straight to full height, opacity 1", "Eases in from 0 → full height, opacity 0 → 1"],
        ["Closing", "Eases out normally", "Eases out normally — identical to the left pane"],
        ["Why closing isn't affected", "The open state was already a real, rendered frame a moment earlier, so there's already a \"from\" to ease from", "Same — @starting-style only supplies a missing starting frame, it doesn't change one that already exists"],
      ],
    },
    {
      kind: "callout",
      variant: "note",
      text: "Bonus you keep for free: find-in-page (Ctrl+F) can match text inside a closed <details> in Chromium, and the browser auto-opens the matching item. Both techniques preserve this, because the content is clipped — never display: none.",
    },

    { kind: "heading", text: "Choosing a technique" },
    {
      kind: "table",
      headers: ["", "grid-template-rows", "::details-content + interpolate-size"],
      rows: [
        ["Animates open", "Yes", "Yes"],
        ["Animates close", "No — jump cut", "Yes"],
        ["Exclusive accordion (name=\"\")", "Switching snaps", "Both items ease"],
        ["Extra wrapper div", "Required", "None"],
        ["Browser support", "Every evergreen browser", "Newer, Chromium-first"],
        ["If unsupported", "—", "Falls back to an instant, correct toggle"],
      ],
    },
    {
      kind: "callout",
      variant: "note",
      text: "Whichever you pick, wrap the transitions in @media (prefers-reduced-motion: no-preference), or zero the duration inside prefers-reduced-motion: reduce.",
    },

    { kind: "heading", text: "Using it with Tailwind" },
    {
      kind: "callout",
      variant: "tip",
      text: "Does Tailwind support this? Mostly yes — details-content:, transition-discrete, and starting: are first-class v4.1 features; the grid-rows track values and the [open] state need arbitrary values; only interpolate-size has no utility at all and stays as one plain :root rule. The demo panes above each carry their Tailwind version under the CSS.",
    },
    {
      kind: "table",
      headers: ["CSS", "Tailwind"],
      rows: [
        ["grid-template-rows: 0fr / 1fr", "grid-rows-[0fr] / grid-rows-[1fr] (arbitrary value)"],
        ["details[open] <descendant>", "[details[open]_&]: (arbitrary variant)"],
        ["::details-content", "details-content: (native in v4.1)"],
        ["transition-behavior: allow-discrete", "transition-discrete"],
        ["@starting-style { ... }", "starting: variant, e.g. starting:open:details-content:h-0"],
        ["interpolate-size: allow-keywords", "No utility — one plain :root rule"],
      ],
    },

    { kind: "heading", text: "Can I use" },
    {
      kind: "caniuse",
      feature: "details",
      title: "<details> element",
    },
    {
      kind: "caniuse",
      feature: "mdn-html_elements_details_name",
      title: "details name attribute",
      variant: "link",
      caption: "The attribute behind the no-JS one-open-at-a-time accordion above.",
    },
    {
      kind: "caniuse",
      feature: "mdn-css_properties_interpolate-size",
      title: "interpolate-size",
      variant: "link",
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
      caption: "Needed so content-visibility can wait until the close transition finishes — paired with @starting-style below.",
    },
    {
      kind: "caniuse",
      feature: "mdn-css_at-rules_starting-style",
      title: "@starting-style",
      variant: "link",
      caption: "What lets the accordion's close animate instead of jump-cutting — see the transition doc for how the pair works in general.",
    },
  ],
};
