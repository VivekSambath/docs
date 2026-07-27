import type { DocArticle } from "../articles";

// --- Live demo HTML generators ----------------------------------------------
// Each takes the shared toggle's on/off state and returns a full mini "page"
// rendered inside a sandboxed iframe (srcDoc) — no scripts, just real CSS.

function shell(bodyStyle: string, heroLabel: string, heroStyle: string, note: string) {
  return `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    font: 13px/1.4 system-ui, sans-serif;
    color: #111;
    background: #fff;
    ${bodyStyle}
  }
  .col { max-width: 220px; margin: 0 auto; background: #eee; padding: 10px; border-radius: 6px; }
  .hero {
    height: 56px;
    margin: 16px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 600;
    font-size: 12px;
    ${heroStyle}
  }
</style>
</head>
<body>
  <div class="col">Article column</div>
  <div class="hero">${heroLabel}</div>
  <div class="col">${note}</div>
</body>
</html>`;
}

const badHtml = (on: boolean) =>
  shell(
    `padding: 16px 20px ${on ? 400 : 16}px;`,
    "width: 100vw",
    "width: 100vw; margin-left: calc(50% - 50vw); background: #dc2626;",
    on
      ? "Scroll down &mdash; this page is tall on purpose."
      : "Toggle the switch above to make this page tall.",
  );

const goodHtml = (on: boolean) =>
  shell(
    `container: body / inline-size; overflow-x: clip; padding: 16px 20px ${on ? 400 : 16}px;`,
    "inline-size: 100cqi",
    "inline-size: 100cqi; margin-inline-start: calc(50% - 50cqi); background: #16a34a;",
    on
      ? "Scroll down &mdash; same height as the other example."
      : "Toggle the switch above to make this page tall.",
  );

const overflowHiddenHtml = (on: boolean) =>
  shell(
    `padding: 16px 20px 400px;${on ? " overflow-x: hidden;" : ""}`,
    on ? "100vw + overflow-x: hidden" : "100vw (unpatched)",
    "width: 100vw; margin-left: calc(50% - 50vw); background: #dc2626;",
    on
      ? "The scrollbar is gone &mdash; but the banner is still too wide underneath."
      : "Scroll down &mdash; the horizontal scrollbar is back.",
  );

const gutterHtml = (on: boolean) => `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  html { ${on ? "scrollbar-gutter: stable;" : ""} }
  body {
    font: 13px/1.4 system-ui, sans-serif;
    color: #111;
    background: #fff;
    padding: 16px 0;
  }
  .ruler {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 2px;
    background: #dc2626;
  }
  .band {
    height: 40px;
    margin: 0 16px;
    background: #111;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
  }
  p { text-align: center; font-size: 11px; color: #666; margin: 10px 16px 0; }
</style>
</head>
<body>
  <div class="ruler"></div>
  <div class="band">width: 100%</div>
  <p>${on ? "Gap reserved for a scrollbar this short page doesn&rsquo;t need." : "No gap &mdash; nothing here needs to scroll."}</p>
</body>
</html>`;

const nestedHtml = (on: boolean) => `<!doctype html>
<html>
<head>
<style>
  ${on ? '@property --body-size {\n    syntax: "<length-percentage>";\n    inherits: true;\n    initial-value: 100%;\n  }' : ""}
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    container: body / inline-size;
    font: 13px/1.4 system-ui, sans-serif;
    background: #f4f4f4;
    color: #111;
    padding: 20px;
  }
  .card {
    ${on ? "--body-size: 100cqi;" : ""}
    container-type: inline-size;
    max-width: 220px;
    margin: 0 auto;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 14px;
    overflow: hidden;
  }
  .full-bleed {
    ${
      on
        ? "inline-size: var(--body-size); margin-inline-start: calc(50% - (0.5 * var(--body-size)));"
        : "inline-size: 100cqi; margin-inline-start: calc(50% - 50cqi);"
    }
    height: 44px;
    margin-block: 10px;
    background: ${on ? "#16a34a" : "#dc2626"};
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 11px;
  }
  p { margin: 0; font-size: 12px; }
</style>
</head>
<body>
  <div class="card">
    <p>A card component</p>
    <div class="full-bleed">${on ? "var(--body-size)" : "100cqi"}</div>
    <p>${on ? "Breaks out to the real page edge." : "Trapped inside the card, not the page."}</p>
  </div>
</body>
</html>`;

const projectHtml = () => `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body {
    container: body / inline-size;
    overflow-x: clip;
    font: 13px/1.4 system-ui, sans-serif;
    color: #111;
    background: #fff;
  }
  .hero {
    inline-size: 100cqi;
    margin-inline-start: calc(50% - 50cqi);
    height: 90px;
    background: linear-gradient(135deg, #111, #444);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 13px;
  }
  main { max-width: 320px; margin: 0 auto; padding: 16px 10px; }
  h1 { font-size: 15px; margin: 0 0 6px; }
  p { margin: 0; color: #555; font-size: 12px; }
</style>
</head>
<body>
  <section class="hero">Full-bleed banner image</section>
  <main>
    <h1>Article title</h1>
    <p>Regular width content goes here, comfortably narrower than the banner above.</p>
  </main>
</body>
</html>`;

export const fullBleedCss: DocArticle = {
  kind: "doc",
  slug: "full-bleed-css",
  title: "Fixing Full-Bleed CSS Layouts",
  excerpt:
    "A simple, hands-on walkthrough of why width: 100vw breaks the moment your page scrolls, and how container query units fix it — with live demos you can scroll and toggle yourself.",
  date: "2026-07-27",
  category: "Frontend Best Practices",
  credit: {
    label: "Based on “Fixing full-bleed CSS” by David Bushell",
    href: "https://dbushell.com/2026/07/03/fixing-full-bleed-css/",
  },
  sections: [
    { kind: "heading", text: "The problem" },
    {
      kind: "paragraph",
      text: "A full-bleed section stretches edge-to-edge across the window while the rest of the page stays in a narrower column — like a hero banner inside an article. The classic fix, width: 100vw plus a negative margin, works fine until the page needs a vertical scrollbar.",
    },
    {
      kind: "mindmap",
      root: "Full-bleed CSS",
      branches: [
        { label: "The bug", children: ["100vw ignores the scrollbar", "Horizontal overflow appears"] },
        { label: "Quick patches", children: ["overflow-x: hidden", "scrollbar-gutter: stable"] },
        { label: "Real fix", children: ["container: body / inline-size", "inline-size: 100cqi"] },
        { label: "Gotcha", children: ["Nested containers", "Inherited --body-size fix"] },
      ],
      caption: "The whole article in one map — jump to any branch via the table of contents.",
    },

    { kind: "heading", text: "See it happen" },
    {
      kind: "demo",
      toggle: { label: "Simulate a tall page (forces the vertical scrollbar)", defaultOn: true },
      panes: [
        {
          label: "100vw",
          status: "bad",
          code: ".full-bleed {\n  width: 100vw;\n  margin-left: calc(50% - 50vw);\n}",
          tailwind: '<div class="w-screen ml-[calc(50%-50vw)]">',
          html: badHtml,
        },
      ],
      height: 200,
      caption:
        "Scroll down inside the box above — a horizontal scrollbar shows up at the bottom too. That's the bug: the red banner is wider than the page itself. Turn the toggle off and the page becomes short enough to not need a vertical scrollbar — the bug disappears with it.",
    },
    {
      kind: "paragraph",
      text: "On Windows (and macOS with \"Always show scrollbars\" on), a vertical scrollbar eats into the viewport, but 100vw doesn't know that — it keeps measuring the full width, scrollbar included. The element ends up a few pixels too wide, and the browser adds a horizontal scrollbar to compensate.",
    },
    {
      kind: "callout",
      variant: "note",
      text: "If the demo above never shows a horizontal scrollbar even with the toggle on, your browser is likely using \"overlay\" scrollbars (common on macOS by default) that don't take up layout space. Try it on Windows, or turn on \"Always show scrollbars\" in macOS System Settings, to reproduce it reliably.",
    },

    { kind: "heading", text: "Quick, partial fixes" },
    {
      kind: "paragraph",
      text: "Two common workarounds hide the symptom without fixing the underlying measurement. Toggle each one to see exactly what it does and doesn't fix.",
    },
    {
      kind: "demo",
      toggle: { label: "overflow-x: hidden", defaultOn: false },
      panes: [
        {
          code: "body {\n  overflow-x: hidden;\n}",
          tailwind: '<body class="overflow-x-hidden">',
          label: "Hide the overflow",
          html: overflowHiddenHtml,
        },
      ],
      height: 200,
      caption:
        "With the toggle off you get the raw bug back. Switch it on and the scrollbar vanishes — but the banner is still technically wider than the page underneath, it's just no longer visible.",
    },
    {
      kind: "demo",
      toggle: { label: "scrollbar-gutter: stable", defaultOn: false },
      panes: [
        {
          code: "html {\n  scrollbar-gutter: stable;\n}",
          tailwind: '<html class="scrollbar-gutter-stable">',
          label: "Always reserve scrollbar space",
          html: gutterHtml,
        },
      ],
      height: 130,
      caption:
        "This page is short — nothing needs to scroll. With the toggle off, the dark bar reaches right up to the red edge marker. Switch it on and a permanent gap opens up on the right, reserved for a scrollbar that isn't there.",
    },
    {
      kind: "callout",
      variant: "warning",
      text: "overflow-x: hidden stops the visible scrollbar but the element is still too wide underneath. scrollbar-gutter: stable reserves space for a scrollbar even on short pages that don't need one, which can look like an odd empty strip. Both are patches, not a fix.",
    },

    { kind: "heading", text: "The real fix: container query units" },
    {
      kind: "paragraph",
      text: "Container query units measure a container element, not the raw viewport. Turn body into a container, and 100cqi gives the page's real rendered width — scrollbar already excluded.",
    },
    {
      kind: "demo",
      toggle: { label: "Simulate a tall page (forces the vertical scrollbar)", defaultOn: true },
      panes: [
        {
          label: "100vw",
          status: "bad",
          code: ".full-bleed {\n  width: 100vw;\n  margin-left: calc(50% - 50vw);\n}",
          tailwind: '<div class="w-screen ml-[calc(50%-50vw)]">',
          html: badHtml,
        },
        {
          label: "100cqi",
          status: "good",
          code: "body {\n  container: body / inline-size;\n  overflow-x: clip;\n}\n\n.full-bleed {\n  inline-size: 100cqi;\n  margin-inline-start: calc(50% - 50cqi);\n}",
          tailwind:
            '<body class="@container/body overflow-x-clip">\n  <div class="w-[100cqi] ms-[calc(50%-50cqi)]">',
          html: goodHtml,
        },
      ],
      height: 220,
      caption:
        "Same tall content, same forced vertical scrollbar, on both sides. Scroll each one — only the left panel picks up a horizontal scrollbar. Turn the toggle off to confirm neither needs it once the page is short.",
    },
    {
      kind: "paragraph",
      text: "container: body / inline-size is shorthand for container-type plus a name, so nested elements can query \"body\" specifically. inline-size / margin-inline-start are just the logical versions of width / margin-left.",
    },

    { kind: "heading", text: "Gotcha: nested containers" },
    {
      kind: "paragraph",
      text: "cqi always measures the nearest container, not necessarily body. If .full-bleed lives inside a card or a component that also sets container-type: inline-size, 100cqi resolves against that inner container's (narrower) width instead of the page — so the element ends up trapped inside the card.",
    },
    {
      kind: "code",
      language: "css",
      label: "Bad",
      code: "body {\n  container: body / inline-size;\n}\n\n.card {\n  container-type: inline-size; /* this now wins over body */\n}\n\n.card .full-bleed {\n  inline-size: 100cqi; /* measures .card, not body — wrong */\n}",
    },
    {
      kind: "callout",
      variant: "tip",
      text: "A registered custom property fixes this by capturing the outer container's size once, as a plain value that then inherits normally through any nested containers — because inherited values don't get re-measured, only re-declared ones do.",
    },
    {
      kind: "code",
      language: "css",
      label: "Good",
      code: '@property --body-size {\n  syntax: "<length-percentage>";\n  inherits: true;\n  initial-value: 100%;\n}\n\nbody {\n  container: body / inline-size;\n}\n\n.card {\n  --body-size: 100cqi; /* measured against body, once */\n  container-type: inline-size;\n}\n\n.full-bleed {\n  inline-size: var(--body-size);\n  margin-inline-start: calc(50% - (0.5 * var(--body-size)));\n}',
      tailwind:
        '<div class="w-(--body-size) ms-[calc(50%-(0.5*var(--body-size)))]">\n<!-- @property still has to be real CSS — it registers a type, it isn\'t a utility class -->',
    },
    {
      kind: "demo",
      toggle: { label: "Apply the inherited --body-size fix", defaultOn: false },
      panes: [
        {
          label: "Hero inside a card",
          html: nestedHtml,
        },
      ],
      height: 190,
      caption:
        "Off: the red banner is confined to the white card, not the page. On: the same element reads the real page width through the inherited custom property and breaks out to the true edge.",
    },

    { kind: "heading", text: "Real project example" },
    {
      kind: "paragraph",
      text: "A centered article column with a full-bleed hero banner at the top — the same technique, put together end to end.",
    },
    {
      kind: "code",
      language: "html",
      code: '<body>\n  <section class="hero">\n    <img src="/banner.jpg" alt="Product banner" />\n  </section>\n\n  <main class="content">\n    <h1>Article title</h1>\n    <p>Regular width content goes here...</p>\n  </main>\n</body>',
      tailwind:
        '<body class="@container/body overflow-x-clip">\n  <section class="hero w-[100cqi] ms-[calc(50%-50cqi)]">\n    <img src="/banner.jpg" alt="Product banner" class="block w-full h-auto" />\n  </section>\n\n  <main class="max-w-275 mx-auto">\n    <h1>Article title</h1>\n    <p>Regular width content goes here...</p>\n  </main>\n</body>',
    },
    {
      kind: "code",
      language: "css",
      code: "body {\n  container: body / inline-size;\n  overflow-x: clip;\n}\n\n.content {\n  max-width: 1100px;\n  margin-inline: auto;\n}\n\n.hero {\n  inline-size: 100cqi;\n  margin-inline-start: calc(50% - 50cqi);\n}\n\n.hero img {\n  display: block;\n  width: 100%;\n  height: auto;\n}",
    },
    {
      kind: "demo",
      panes: [{ label: "Result", status: "good", html: projectHtml }],
      height: 190,
      caption: "The finished layout: a full-bleed banner with a centered, comfortably narrow article column below it.",
    },

    { kind: "heading", text: "Best practices" },
    {
      kind: "list",
      items: [
        "Reach for cqi over vw whenever an element's \"full width\" should mean the page, not the raw browser window.",
        "Put container: body / inline-size on body once, near the top of your global stylesheet, rather than re-declaring container-type on every component.",
        "Watch for nested containers — anything with its own container-type between body and a .full-bleed element will hijack the measurement.",
        "Test on Windows (or macOS with classic scrollbars enabled) at least once — overlay scrollbars hide this entire class of bug during development.",
      ],
    },

    { kind: "heading", text: "Browser support" },
    {
      kind: "paragraph",
      text: "container-type and container query units (cqw, cqh, cqi, cqb) have shipped in every evergreen browser — Chrome, Edge, Firefox, and Safari — since 2023, so there's no real support gap for modern frontend work today.",
    },

    { kind: "heading", text: "Key takeaways" },
    {
      kind: "list",
      items: [
        "width: 100vw ignores the scrollbar, so it can render wider than the page itself.",
        "overflow-x: hidden and scrollbar-gutter: stable hide the symptom but don't fix the measurement.",
        "container: body / inline-size + inline-size: 100cqi measures the page's real width, scrollbar already excluded.",
        "cqi always resolves against the nearest container — nested containers can silently break it; an inherited custom property fixes that.",
      ],
    },

    { kind: "heading", text: "Can I use" },
    {
      kind: "caniuse",
      feature: "css-container-queries",
      title: "Container Queries (Size)",
    },
    {
      kind: "caniuse",
      feature: "css-container-query-units",
      title: "Container Query Units (cqi, cqw, cqh, cqb)",
    },
    {
      kind: "caniuse",
      feature: "mdn-css_at-rules_property",
      title: "@property",
      caption: "Only relevant if you're using the registered custom property fix for nested containers.",
    },
  ],
};
