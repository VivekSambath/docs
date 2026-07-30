import type { DocArticle } from "../articles";

// --- Shared CSS fragments for the live demos --------------------------------
// The editable-pane renderer (DocContent.tsx's EditablePane/buildEditableDoc)
// wraps htmlSource/cssSource into a full document itself — a minimal shell
// with `* { box-sizing: border-box }`, `html, body { margin: 0 }`, and
// `body { font; color; background: #fff; padding: 16px }`. Every cssSource
// below is written to layer on top of that shell (re-declaring `body` rules
// where a demo needs to remove the default padding or force scroll height).

const bleedHtml = (heroLabel: string) => `<div class="col">Article column</div>
<div class="hero">${heroLabel}</div>
<div class="col">More article column</div>`;

const bleedBaseCss = `.col { max-width: 220px; margin: 0 auto; background: #eee; padding: 10px; border-radius: 6px; }
.hero {
  height: 56px;
  margin: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 12px;
}`;

// Tall-page variant used by the two "See it happen" / "real fix" demos —
// padding-bottom simulates enough content to force a vertical scrollbar.
const tallBodyCss = `body { padding: 16px 20px 400px; }
${bleedBaseCss}`;
const shortBodyCss = `body { padding: 16px 20px; }
${bleedBaseCss}`;

const badCssBleed = `.hero { width: 100vw; margin-left: calc(50% - 50vw); background: #dc2626; }`;
const goodCssBleed = `body { container: body / inline-size; overflow-x: clip; }
.hero { inline-size: 100cqi; margin-inline-start: calc(50% - 50cqi); background: #16a34a; }`;

export const fullBleedCss: DocArticle = {
  kind: "doc",
  slug: "full-bleed-css",
  title: "Fixing Full-Bleed CSS Layouts",
  excerpt:
    "A simple, hands-on walkthrough of why width: 100vw breaks the moment your page scrolls, and how container query units fix it — with live, editable demos you can scroll, edit, and toggle yourself.",
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
      text: "A full-bleed section stretches edge-to-edge across the window while the rest of the page stays in a narrower column. The classic fix, `width: 100vw` plus a negative margin, ==breaks the moment the page needs a vertical scrollbar==.",
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

    { kind: "heading", text: "Warm-up: 100vw vs 100%" },
    {
      kind: "paragraph",
      text: "Before the scrollbar complexity, the core difference in one box: 100% measures the parent element, 100vw measures the viewport. Edit either value below and watch the box resize.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "100%",
          status: "good",
          editable: true,
          htmlSource: `<div class="box">width: 100%</div>`,
          cssSource: `.box {
  width: 100%;
  height: 60px;
  background: #16a34a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 600 12px system-ui, sans-serif;
}`,
        },
        {
          label: "100vw",
          status: "bad",
          editable: true,
          htmlSource: `<div class="box">width: 100vw</div>`,
          cssSource: `.box {
  width: 100vw;
  height: 60px;
  background: #dc2626;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font: 600 12px system-ui, sans-serif;
}`,
        },
      ],
      caption:
        "The preview iframe's body has 16px of padding, so 100% here stays inset while 100vw pushes past it to the raw viewport width — a small-scale preview of the same mismatch that causes the full-bleed bug below.",
    },

    { kind: "heading", text: "See it happen" },
    {
      kind: "demo",
      toggle: { label: "Simulate a tall page (forces the vertical scrollbar)", defaultOn: true },
      panes: [
        {
          label: "100vw",
          status: "bad",
          editable: true,
          tailwind: '<div class="w-screen ml-[calc(50%-50vw)]">',
          htmlSource: bleedHtml("Toggle the switch above to make this page tall."),
          cssSource: `${shortBodyCss}
${badCssBleed}`,
          onSource: {
            htmlSource: bleedHtml("Scroll down &mdash; this page is tall on purpose."),
            cssSource: `${tallBodyCss}
${badCssBleed}`,
          },
        },
      ],
      height: 200,
      caption:
        "Scroll down inside the box above — a horizontal scrollbar shows up at the bottom too. That's the bug: the red banner is wider than the page itself. Turn the toggle off and the page becomes short enough to not need a vertical scrollbar — the bug disappears with it.",
    },
    {
      kind: "paragraph",
      text: "A vertical scrollbar eats into the viewport, but `100vw` doesn't know that — ==it keeps measuring the full width, scrollbar included==, so the browser adds a horizontal scrollbar to compensate.",
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
          label: "Hide the overflow",
          editable: true,
          tailwind: '<body class="overflow-x-hidden">',
          htmlSource: bleedHtml("Scroll down &mdash; the horizontal scrollbar is back."),
          cssSource: `${tallBodyCss}
${badCssBleed}`,
          onSource: {
            htmlSource: bleedHtml(
              "The scrollbar is gone &mdash; but the banner is still too wide underneath.",
            ),
            cssSource: `${tallBodyCss}
body { overflow-x: hidden; }
${badCssBleed}`,
          },
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
          label: "Always reserve scrollbar space",
          editable: true,
          tailwind: '<html class="scrollbar-gutter-stable">',
          htmlSource: `<div class="ruler"></div>
<div class="band">width: 100%</div>
<p>No gap &mdash; nothing here needs to scroll.</p>`,
          cssSource: `body { padding: 16px 0; }
.ruler { position: fixed; top: 0; right: 0; bottom: 0; width: 2px; background: #dc2626; }
.band { height: 40px; margin: 0 16px; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; }
p { text-align: center; font-size: 11px; color: #666; margin: 10px 16px 0; }`,
          onSource: {
            htmlSource: `<div class="ruler"></div>
<div class="band">width: 100%</div>
<p>Gap reserved for a scrollbar this short page doesn&rsquo;t need.</p>`,
            cssSource: `html { scrollbar-gutter: stable; }
body { padding: 16px 0; }
.ruler { position: fixed; top: 0; right: 0; bottom: 0; width: 2px; background: #dc2626; }
.band { height: 40px; margin: 0 16px; background: #111; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; }
p { text-align: center; font-size: 11px; color: #666; margin: 10px 16px 0; }`,
          },
        },
      ],
      height: 130,
      caption:
        "This page is short — nothing needs to scroll. With the toggle off, the dark bar reaches right up to the red edge marker. Switch it on and a permanent gap opens up on the right, reserved for a scrollbar that isn't there.",
    },
    {
      kind: "callout",
      variant: "warning",
      text: "`overflow-x: hidden` stops the visible scrollbar but the element is **still too wide underneath**. `scrollbar-gutter: stable` reserves space for a scrollbar even on short pages that don't need one, which can look like an odd empty strip. ==Both are patches, not a fix.==",
    },

    { kind: "heading", text: "The real fix: container query units" },
    {
      kind: "paragraph",
      text: "Container query units measure **a container element, not the raw viewport**. Turn `body` into a container, and `100cqi` gives ==the page's real rendered width — scrollbar already excluded==.",
    },
    {
      kind: "heading", text: "Warm-up: making an element a container", level: 3,
    },
    {
      kind: "paragraph",
      text: "container-type: inline-size is the one declaration that turns a plain element into a query container. Nothing else changes about it — it just becomes something descendants can measure with cq units.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "container-type: inline-size",
          editable: true,
          htmlSource: `<div class="box">I'm a container now</div>`,
          cssSource: `.box {
  container-type: inline-size;
  width: 70%;
  padding: 14px;
  background: #eee;
  border-radius: 6px;
  font: 600 12px system-ui, sans-serif;
  text-align: center;
}`,
        },
      ],
      caption:
        "Resize the box (edit the width in the CSS) and nothing visually changes yet — container-type alone doesn't style anything. It just makes .box a measurable container for the next demo's cqi units.",
    },
    {
      kind: "demo",
      toggle: { label: "Simulate a tall page (forces the vertical scrollbar)", defaultOn: true },
      panes: [
        {
          label: "100vw",
          status: "bad",
          editable: true,
          tailwind: '<div class="w-screen ml-[calc(50%-50vw)]">',
          htmlSource: bleedHtml("Toggle the switch above to make this page tall."),
          cssSource: `${shortBodyCss}
${badCssBleed}`,
          onSource: {
            htmlSource: bleedHtml("Scroll down &mdash; this page is tall on purpose."),
            cssSource: `${tallBodyCss}
${badCssBleed}`,
          },
        },
        {
          label: "100cqi",
          status: "good",
          editable: true,
          tailwind:
            '<body class="@container/body overflow-x-clip">\n  <div class="w-[100cqi] ms-[calc(50%-50cqi)]">',
          htmlSource: bleedHtml("Toggle the switch above to make this page tall."),
          cssSource: `${shortBodyCss}
${goodCssBleed}`,
          onSource: {
            htmlSource: bleedHtml("Scroll down &mdash; same height as the other example."),
            cssSource: `${tallBodyCss}
${goodCssBleed}`,
          },
        },
      ],
      height: 220,
      caption:
        "Same tall content, same forced vertical scrollbar, on both sides. Scroll each one — only the left panel picks up a horizontal scrollbar. Turn the toggle off to confirm neither needs it once the page is short.",
    },
    {
      kind: "paragraph",
      text: "container: body / inline-size is shorthand for container-type plus a name; inline-size / margin-inline-start are the logical versions of width / margin-left.",
    },

    { kind: "heading", text: "Gotcha: nested containers" },
    {
      kind: "paragraph",
      text: "cqi always measures the nearest container, not necessarily body. If a component between .full-bleed and body also sets container-type, 100cqi resolves against that inner container instead of the page.",
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
      text: "A registered custom property fixes this: it captures the outer container's size once, then inherits as a plain value through any nested containers instead of being re-measured.",
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
      kind: "heading", text: "Warm-up: cqi vs % on a nested box", level: 3,
    },
    {
      kind: "paragraph",
      text: "The gotcha in miniature: % always follows the immediate parent, while cqi follows the nearest container — not always the same element once containers nest.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "50%",
          editable: true,
          htmlSource: `<div class="outer">
  <div class="inner">width: 50%</div>
</div>`,
          cssSource: `.outer {
  container-type: inline-size;
  width: 260px;
  padding: 10px;
  background: #f4f4f4;
  border-radius: 6px;
}
.inner {
  width: 50%;
  padding: 10px;
  background: #16a34a;
  color: #fff;
  font: 600 12px system-ui, sans-serif;
  text-align: center;
}`,
        },
        {
          label: "50cqi",
          editable: true,
          htmlSource: `<div class="outer">
  <div class="inner">width: 50cqi</div>
</div>`,
          cssSource: `.outer {
  container-type: inline-size;
  width: 260px;
  padding: 10px;
  background: #f4f4f4;
  border-radius: 6px;
}
.inner {
  width: 50cqi;
  padding: 10px;
  background: #16a34a;
  color: #fff;
  font: 600 12px system-ui, sans-serif;
  text-align: center;
}`,
        },
      ],
      caption:
        "Both look identical here because .outer is the nearest container either way. Change .outer's width in each CSS box and compare — then imagine .inner living one level deeper, inside its own nested container: % would still track its immediate parent, but cqi would suddenly measure that new, narrower container instead of .outer. That's exactly the trap the next demo shows at full scale.",
    },
    {
      kind: "demo",
      toggle: { label: "Apply the inherited --body-size fix", defaultOn: false },
      panes: [
        {
          label: "Hero inside a card",
          editable: true,
          htmlSource: `<div class="card">
  <p>A card component</p>
  <div class="full-bleed">100cqi</div>
  <p>Trapped inside the card, not the page.</p>
</div>`,
          cssSource: `body {
  container: body / inline-size;
  background: #f4f4f4;
}
.card {
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
  inline-size: 100cqi;
  margin-inline-start: calc(50% - 50cqi);
  height: 44px;
  margin-block: 10px;
  background: #dc2626;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 11px;
}
p { margin: 0; font-size: 12px; }`,
          onSource: {
            htmlSource: `<div class="card">
  <p>A card component</p>
  <div class="full-bleed">var(--body-size)</div>
  <p>Breaks out to the real page edge.</p>
</div>`,
            cssSource: `@property --body-size {
  syntax: "<length-percentage>";
  inherits: true;
  initial-value: 100%;
}
body {
  container: body / inline-size;
  background: #f4f4f4;
}
.card {
  --body-size: 100cqi;
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
  inline-size: var(--body-size);
  margin-inline-start: calc(50% - (0.5 * var(--body-size)));
  height: 44px;
  margin-block: 10px;
  background: #16a34a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 11px;
}
p { margin: 0; font-size: 12px; }`,
          },
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
      kind: "demo",
      panes: [
        {
          label: "Result",
          status: "good",
          editable: true,
          htmlSource: `<section class="hero">Full-bleed banner image</section>
<main>
  <h1>Article title</h1>
  <p>Regular width content goes here, comfortably narrower than the banner above.</p>
</main>`,
          cssSource: `body {
  container: body / inline-size;
  overflow-x: clip;
  padding: 0;
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
p { margin: 0; color: #555; font-size: 12px; }`,
        },
      ],
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
