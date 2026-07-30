import type { DocArticle } from "../articles";

export const designPrinciples: DocArticle = {
  kind: "doc",
  slug: "design-principles",
  title: "The design rules this site follows",
  excerpt:
    "The 28 rules from Anthony Hobday's Rules for Visual Design, plus two more this site adds of its own — each one with a live demo you can look at (and sometimes hover) to see the difference.",
  date: "2026-07-21",
  category: "Design Principles",
  credit: {
    label: "Adapted from Anthony Hobday's “Rules for Visual Design”",
    href: "https://anthonyhobday.com/sideprojects/saferules/",
  },
  sections: [
    {
      kind: "paragraph",
      text: "Anthony Hobday's 28 \"safe to follow\" rules for visual design, plus two of this site's own — each demonstrated with a live, editable ✕ Bad / ✓ Good CSS pane.",
    },
    {
      kind: "mindmap",
      root: "30 design rules",
      branches: [
        {
          label: "Color & contrast",
          children: [
            "1. Near-black, not pure black",
            "2. Saturate your neutrals",
            "3. High contrast for important elements",
            "9. Distinct palette brightness",
            "10. Warm or cool, not both",
            "18. Container brightness limits",
            "28. Lower-contrast icons",
          ],
        },
        {
          label: "Spacing, alignment & layout",
          children: [
            "4. Everything deliberate",
            "5. Optical alignment",
            "8. Align with something else",
            "11. Mathematical scale",
            "12. Order by visual weight",
            "13. 12-column grid",
            "14. Spacing at contrast points",
            "19. Outer ≥ inner padding",
          ],
        },
        {
          label: "Typography",
          children: [
            "6. Tracking by size",
            "20. Body text ≥ 16px",
            "21. Line length ~70ch",
            "23. Two typefaces max",
          ],
        },
        {
          label: "Depth, surface & components",
          children: [
            "7. Borders contrast both sides",
            "15. Closer elements, lighter",
            "16. Shadow blur = 2× distance",
            "17. Simple on complex",
            "22. Button padding ratio",
            "24. Proportional radii",
            "25. No adjacent hard divides",
            "26. No shadows in dark UI",
            "27. Don't mix depth techniques",
          ],
        },
        {
          label: "Beyond the source",
          children: ["29. One deliberate accent", "30. Short, ease-out motion"],
        },
      ],
      caption: "The whole article in one map — jump to any branch via the table of contents.",
    },

    { kind: "heading", text: "1. Never use pure black or pure white" },
    {
      kind: "paragraph",
      text: "Near-black on near-white keeps the same contrast as pure black on white, with less strain on the eye.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Pure black/white",
          status: "bad",
          editable: true,
          tailwind: '<div class="bg-black text-white">',
          htmlSource: `<div class="swatch">#000 on #fff</div>`,
          cssSource: `.swatch {
  width: 100%;
  max-width: 200px;
  background: #000;
  color: #fff;
  padding: 22px;
  border-radius: 8px;
  font-weight: 600;
}`,
        },
        {
          label: "Near-black/near-white",
          status: "good",
          editable: true,
          tailwind: '<div class="bg-neutral-950 text-neutral-50">',
          htmlSource: `<div class="swatch">#0a0a0a on #fafafa</div>`,
          cssSource: `body { background: #fafafa; }
.swatch {
  width: 100%;
  max-width: 200px;
  background: #0a0a0a;
  color: #fafafa;
  padding: 22px;
  border-radius: 8px;
  font-weight: 600;
}`,
        },
        {
          label: "Seam test",
          editable: true,
          htmlSource: `<div class="stack">
  <div class="row">
    <div class="a"></div>
    <div class="b"></div>
  </div>
  <p class="caption">#000 (left) vs #0a0a0a (right)</p>
  <div class="row bordered">
    <div class="c"></div>
    <div class="d"></div>
  </div>
  <p class="caption">#fff (left) vs #fafafa (right)</p>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; text-align: left; }
.stack { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 220px; }
.row { display: flex; height: 40px; border-radius: 6px; overflow: hidden; }
.row.bordered { border: 1px solid #e5e5e5; }
.a { flex: 1; background: #000; }
.b { flex: 1; background: #0a0a0a; }
.c { flex: 1; background: #fff; }
.d { flex: 1; background: #fafafa; }
.caption { margin: 0; font-size: 10px; color: #737373; }`,
        },
      ],
      height: 200,
      caption: "Alone the first two panes look identical; edge to edge in the third, the seam appears — enough difference to soften pure black without losing contrast.",
    },
    {
      kind: "callout",
      variant: "tip",
      text: "This seam trick generalizes to any two close colors: put them edge to edge with no gap and the eye catches a boundary it would miss in isolated swatches.",
    },

    { kind: "heading", text: "2. Saturate your neutrals" },
    {
      kind: "paragraph",
      text: "Mixing a touch of your accent hue into flat grays makes the whole palette read as one coherent system.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Flat grays",
          status: "bad",
          editable: true,
          htmlSource: `<div class="stack">
  <div class="row">
    <div class="sw sw-1"></div>
    <div class="sw sw-2"></div>
    <div class="sw sw-3"></div>
  </div>
  <p class="caption">Flat grays</p>
</div>`,
          cssSource: `.stack { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.row { display: flex; gap: 10px; }
.sw { width: 48px; height: 48px; border-radius: 6px; }
.sw-1 { background: #404040; }
.sw-2 { background: #737373; }
.sw-3 { background: #a3a3a3; }
.caption { margin: 0; font-size: 11px; color: #a3a3a3; }`,
        },
        {
          label: "Saturated toward the accent",
          status: "good",
          editable: true,
          htmlSource: `<div class="stack">
  <div class="row">
    <div class="sw sw-1"></div>
    <div class="sw sw-2"></div>
    <div class="sw sw-3"></div>
  </div>
  <p class="caption">Grays + a touch of #0060df</p>
</div>`,
          cssSource: `.stack { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.row { display: flex; gap: 10px; }
.sw { width: 48px; height: 48px; border-radius: 6px; }
.sw-1 { background: #3a4150; }
.sw-2 { background: #6b7385; }
.sw-3 { background: #a1a8b8; }
.caption { margin: 0; font-size: 11px; color: #6b7385; }`,
        },
      ],
      height: 130,
      caption: "Same lightness steps in both rows — the second row's grays lean toward this site's accent blue, so they feel related to it instead of arbitrary.",
    },

    { kind: "heading", text: "3. Use high contrast for important elements" },
    {
      kind: "paragraph",
      text: "Give the most important element the highest contrast, and let anything the user doesn't need to notice fade into low contrast.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Same color, same size",
          status: "bad",
          editable: true,
          tailwind: '<h2 class="text-neutral-500">\n<p class="text-neutral-500">',
          htmlSource: `<div class="wrap">
  <p class="title">Article title</p>
  <p class="subtitle">Supporting subtitle text</p>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; text-align: left; }
.title, .subtitle { margin: 0 0 6px; font-size: 16px; font-weight: 600; color: #737373; }
.subtitle { margin-bottom: 0; }`,
        },
        {
          label: "Near-black + muted gray",
          status: "good",
          editable: true,
          tailwind: '<h2 class="text-neutral-950">\n<p class="text-neutral-400">',
          htmlSource: `<div class="wrap">
  <p class="title">Article title</p>
  <p class="subtitle">Supporting subtitle text</p>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; text-align: left; }
.title { margin: 0 0 6px; font-size: 16px; font-weight: 600; color: #0a0a0a; }
.subtitle { margin: 0; font-size: 16px; font-weight: 600; color: #a3a3a3; }`,
        },
      ],
      height: 110,
      caption: "Font size and weight are identical in both panes — only the color changes, and it's enough to establish which line matters more.",
    },

    { kind: "heading", text: "4. Everything in your design should be deliberate" },
    {
      kind: "paragraph",
      text: "Whitespace, alignment, size, spacing, color, and shadow should all be deliberate decisions, not leftover defaults.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Leftover defaults",
          status: "bad",
          editable: true,
          htmlSource: `<div class="card">
  <p class="title">Update available</p>
  <p class="subtitle">New version ready</p>
  <button class="btn">Install</button>
</div>`,
          cssSource: `.card { width: 200px; background: #f3f3f3; border-radius: 9px; padding: 11px; text-align: left; }
.title { margin: 0 0 3px; font-size: 15px; font-weight: 700; color: #333; }
.subtitle { margin: 0 0 14px; font-size: 12px; color: #8a8a8a; padding-left: 2px; }
.btn { font: 600 11px system-ui, sans-serif; padding: 7px 10px; border-radius: 4px; border: none; background: #555; color: #fff; margin-left: 3px; }`,
        },
        {
          label: "Deliberate values",
          status: "good",
          editable: true,
          htmlSource: `<div class="card">
  <p class="title">Update available</p>
  <p class="subtitle">New version ready</p>
  <button class="btn">Install</button>
</div>`,
          cssSource: `.card { width: 200px; background: #f5f5f5; border-radius: 8px; padding: 16px; text-align: left; }
.title { margin: 0 0 4px; font-size: 15px; font-weight: 600; color: #0a0a0a; }
.subtitle { margin: 0 0 16px; font-size: 12px; color: #737373; }
.btn { font: 600 12px system-ui, sans-serif; padding: 8px 16px; border-radius: 6px; border: none; background: #0a0a0a; color: #fafafa; }`,
        },
      ],
      height: 160,
      caption: "Same card, same content — the left one uses whatever numbers felt close enough; the right one uses this site's actual tokens for spacing, color, and radius.",
    },

    { kind: "heading", text: "5. Optical alignment is often better than mathematical alignment" },
    {
      kind: "paragraph",
      text: "Some shapes' visual center differs from their mathematical one — a play-icon triangle needs a nudge by eye, not by math.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Mathematically centered",
          status: "bad",
          editable: true,
          tailwind: '<div class="flex items-center justify-center">',
          htmlSource: `<div class="icon">
  <div class="guide"></div>
  <div class="triangle"></div>
</div>`,
          cssSource: `.icon {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
}
.guide { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.35); }
.triangle {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 16px solid #fafafa;
}`,
        },
        {
          label: "Nudged 2px right",
          status: "good",
          editable: true,
          tailwind: '<div class="translate-x-0.5">',
          htmlSource: `<div class="icon">
  <div class="guide"></div>
  <div class="triangle"></div>
</div>`,
          cssSource: `.icon {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
}
.guide { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,255,255,0.35); }
.triangle {
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 16px solid #fafafa;
  transform: translateX(2px);
}`,
        },
      ],
      height: 130,
      caption: "The triangle's own visual weight sits toward its point — centering its bounding box on the guideline leaves it reading as left-heavy until it's nudged.",
    },

    { kind: "heading", text: "6. Lower letter-spacing and line-height with larger text, raise them with smaller text" },
    {
      kind: "paragraph",
      text: "The bigger the text, the tighter its letter-spacing and line-height should be — and the smaller the text, the looser.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Letter-spacing by size",
          editable: true,
          tailwind: '<h1 class="tracking-tight">\n<span class="tracking-wider">',
          htmlSource: `<div class="stack">
  <div>
    <p class="note note-flat">Heading, letter-spacing: 0</p>
    <p class="heading heading-flat">Design that lasts</p>
  </div>
  <div>
    <p class="note note-good">Heading, letter-spacing: -0.02em</p>
    <p class="heading heading-tight">Design that lasts</p>
  </div>
  <div>
    <p class="note note-flat">Label, letter-spacing: 0</p>
    <p class="label label-flat">Section label</p>
  </div>
  <div>
    <p class="note note-good">Label, letter-spacing: 0.05em</p>
    <p class="label label-wide">Section label</p>
  </div>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; text-align: left; }
.stack { display: flex; flex-direction: column; gap: 16px; width: 100%; }
.note { margin: 0 0 4px; font-size: 10px; font-weight: 600; }
.note-flat { color: #737373; }
.note-good { color: #16a34a; }
.heading { margin: 0; font-size: 28px; font-weight: 600; }
.heading-flat { letter-spacing: 0; }
.heading-tight { letter-spacing: -0.02em; }
.label { margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; }
.label-flat { letter-spacing: 0; }
.label-wide { letter-spacing: 0.05em; }`,
        },
      ],
      height: 290,
      caption: "The heading tightens with negative tracking; the small uppercase label loosens with positive tracking.",
    },

    { kind: "heading", text: "7. Container borders should contrast with both the container and the background" },
    {
      kind: "paragraph",
      text: "A 1px border should sit outside the brightness range of both surfaces it separates — not at a value in between, or it disappears into a blend instead of reading as an edge.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Border between the two",
          status: "bad",
          editable: true,
          htmlSource: `<div class="wrap">
  <div class="card">Card content</div>
</div>`,
          cssSource: `body { background: #171717; }
.wrap { width: 180px; padding: 20px; text-align: left; }
.card { background: #262626; border: 1px solid #1f1f1f; border-radius: 8px; padding: 16px; font-size: 12px; color: #a3a3a3; }`,
        },
        {
          label: "Border lighter than both",
          status: "good",
          editable: true,
          htmlSource: `<div class="wrap">
  <div class="card">Card content</div>
</div>`,
          cssSource: `body { background: #171717; }
.wrap { width: 180px; padding: 20px; text-align: left; }
.card { background: #262626; border: 1px solid #404040; border-radius: 8px; padding: 16px; font-size: 12px; color: #d4d4d4; }`,
        },
      ],
      height: 150,
      caption: "The first border sits between the page and card and nearly vanishes; the second is lighter than both and reads as a clear edge.",
    },

    { kind: "heading", text: "8. Everything should be aligned with something else" },
    {
      kind: "paragraph",
      text: "Alignment signals relationship — an element that doesn't line up with anything else reads as unrelated, no matter what it says.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Each on its own offset",
          status: "bad",
          editable: true,
          htmlSource: `<div class="wrap">
  <p class="heading">Heading</p>
  <p class="sub">Supporting line of text.</p>
  <button class="btn">Continue</button>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; text-align: left; }
.wrap { width: 200px; }
.heading { margin: 0 0 8px 4px; font-size: 15px; font-weight: 600; color: #0a0a0a; }
.sub { margin: 0 0 12px 14px; font-size: 12px; color: #737373; }
.btn { margin-left: 8px; font: 600 12px system-ui, sans-serif; padding: 8px 14px; border-radius: 6px; border: none; background: #0a0a0a; color: #fafafa; }`,
        },
        {
          label: "Shared left edge",
          status: "good",
          editable: true,
          htmlSource: `<div class="wrap">
  <p class="heading">Heading</p>
  <p class="sub">Supporting line of text.</p>
  <button class="btn">Continue</button>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; text-align: left; }
.wrap { width: 200px; border-left: 1px dashed #d4d4d4; }
.heading { margin: 0 0 8px; padding-left: 10px; font-size: 15px; font-weight: 600; color: #0a0a0a; }
.sub { margin: 0 0 12px; padding-left: 10px; font-size: 12px; color: #737373; }
.btn { margin-left: 10px; font: 600 12px system-ui, sans-serif; padding: 8px 14px; border-radius: 6px; border: none; background: #0a0a0a; color: #fafafa; }`,
        },
      ],
      height: 170,
      caption: "Same three elements, same content — sharing one left edge (dashed guide) is what makes them read as a single group instead of three unrelated pieces.",
    },

    { kind: "heading", text: "9. Colours in a palette should have distinct brightness values" },
    {
      kind: "paragraph",
      text: "Colors that only differ by hue, not lightness, are hard to tell apart at a glance — especially for anyone with reduced color vision.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Same brightness, different hue",
          status: "bad",
          editable: true,
          htmlSource: `<div class="row">
  <div class="sw sw-1"></div>
  <div class="sw sw-2"></div>
  <div class="sw sw-3"></div>
</div>`,
          cssSource: `.row { display: flex; gap: 10px; }
.sw { width: 48px; height: 48px; border-radius: 6px; }
.sw-1 { background: hsl(0, 55%, 50%); }
.sw-2 { background: hsl(140, 55%, 42%); }
.sw-3 { background: hsl(220, 65%, 52%); }`,
        },
        {
          label: "Distinct brightness values",
          status: "good",
          editable: true,
          htmlSource: `<div class="row">
  <div class="sw sw-1"></div>
  <div class="sw sw-2"></div>
  <div class="sw sw-3"></div>
</div>`,
          cssSource: `.row { display: flex; gap: 10px; align-items: flex-end; }
.sw { width: 48px; height: 48px; border-radius: 6px; }
.sw-1 { background: hsl(0, 60%, 72%); }
.sw-2 { background: hsl(140, 45%, 45%); }
.sw-3 { background: hsl(220, 70%, 28%); }`,
        },
      ],
      height: 110,
      caption: "The first trio is separated only by hue; the second is separated by lightness too, so it stays distinguishable even in grayscale.",
    },

    { kind: "heading", text: "10. If you saturate your neutrals, use warm or cool colors — not both" },
    {
      kind: "paragraph",
      text: "Tinted neutrals only feel coherent if every one leans the same temperature — mixing warm and cool grays reads as two systems.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Warm and cool mixed",
          status: "bad",
          editable: true,
          htmlSource: `<div class="stack">
  <div class="row">
    <div class="sw sw-1"></div>
    <div class="sw sw-2"></div>
    <div class="sw sw-3"></div>
  </div>
  <p class="caption">Warm + cool, mixed</p>
</div>`,
          cssSource: `.stack { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.row { display: flex; gap: 10px; }
.sw { width: 48px; height: 48px; border-radius: 6px; }
.sw-1 { background: #8a7d6e; /* warm */ }
.sw-2 { background: #6e7a8a; /* cool */ }
.sw-3 { background: #8a7d6e; /* warm */ }
.caption { margin: 0; font-size: 11px; color: #a3a3a3; }`,
        },
        {
          label: "Warm only",
          status: "good",
          editable: true,
          htmlSource: `<div class="stack">
  <div class="row">
    <div class="sw sw-1"></div>
    <div class="sw sw-2"></div>
    <div class="sw sw-3"></div>
  </div>
  <p class="caption">Warm grays only</p>
</div>`,
          cssSource: `.stack { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.row { display: flex; gap: 10px; }
.sw { width: 48px; height: 48px; border-radius: 6px; }
.sw-1 { background: #3d3833; }
.sw-2 { background: #6b6259; }
.sw-3 { background: #a39c92; }
.caption { margin: 0; font-size: 11px; color: #a3a3a3; }`,
        },
      ],
      height: 130,
      caption: "Same three lightness steps — the second row commits to one temperature, so the set reads as one family instead of a clash.",
    },

    { kind: "heading", text: "11. Measurements should be mathematically related" },
    {
      kind: "paragraph",
      text: "Spacing and sizing should come from a fixed scale (4, 8, 12, 16, 24, 32…), not an arbitrary pixel value picked in the moment.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "The spacing scale",
          editable: true,
          tailwind: "gap-1  gap-2  gap-3  gap-4  gap-6  gap-8",
          htmlSource: `<div class="row">
  <div class="step"><div class="bar bar-4"></div><span class="num">4</span></div>
  <div class="step"><div class="bar bar-8"></div><span class="num">8</span></div>
  <div class="step"><div class="bar bar-12"></div><span class="num">12</span></div>
  <div class="step"><div class="bar bar-16"></div><span class="num">16</span></div>
  <div class="step"><div class="bar bar-24"></div><span class="num">24</span></div>
  <div class="step"><div class="bar bar-32"></div><span class="num">32</span></div>
</div>`,
          cssSource: `.row { display: flex; align-items: flex-end; gap: 14px; }
.step { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.bar { width: 20px; background: #171717; border-radius: 3px; }
.bar-4 { height: 12px; }   /* 4  * 3 */
.bar-8 { height: 24px; }   /* 8  * 3 */
.bar-12 { height: 36px; }  /* 12 * 3 */
.bar-16 { height: 48px; }  /* 16 * 3 */
.bar-24 { height: 72px; }  /* 24 * 3 */
.bar-32 { height: 96px; }  /* 32 * 3 */
.num { font-size: 10px; color: #737373; }`,
        },
      ],
      height: 180,
      caption: "Every gap on this site is one of these values — never an arbitrary number in between.",
    },

    { kind: "heading", text: "12. Elements should go in order of visual weight" },
    {
      kind: "paragraph",
      text: "Arrange a row like a triangle — heaviest element first, lightest last — or the eye has to hunt for where to start.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Random order",
          status: "bad",
          editable: true,
          htmlSource: `<div class="stack">
  <span class="byline">Byline text</span>
  <button class="btn">Get started</button>
  <span class="label">Section label</span>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; text-align: left; }
.stack { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.byline { font-size: 11px; color: #a3a3a3; }
.btn { font: 600 13px system-ui, sans-serif; padding: 10px 20px; border-radius: 6px; border: none; background: #0a0a0a; color: #fafafa; }
.label { font-size: 13px; font-weight: 600; color: #0a0a0a; }`,
        },
        {
          label: "Heaviest to lightest",
          status: "good",
          editable: true,
          htmlSource: `<div class="stack">
  <button class="btn">Get started</button>
  <span class="label">Section label</span>
  <span class="byline">Byline text</span>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; text-align: left; }
.stack { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.btn { font: 600 13px system-ui, sans-serif; padding: 10px 20px; border-radius: 6px; border: none; background: #0a0a0a; color: #fafafa; }
.label { font-size: 13px; font-weight: 600; color: #0a0a0a; }
.byline { font-size: 11px; color: #a3a3a3; }`,
        },
      ],
      height: 170,
      caption: "Same three elements — leading with the solid button and closing with the lightest byline text gives the eye a clear entry point and a clear exit.",
    },

    { kind: "heading", text: "13. If you use a horizontal grid, use 12 columns" },
    {
      kind: "paragraph",
      text: "A 12-column grid divides cleanly into halves, thirds, and quarters — enough for most layouts without switching systems mid-page.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "12 columns",
          editable: true,
          htmlSource: `<div class="wrap">
  <div class="grid">
    <div class="col hl"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col hl"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col hl"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
  </div>
  <p class="caption">12 columns splits evenly into 1, 2, 3, 4, 6, or 12</p>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; text-align: left; }
.wrap { width: 100%; max-width: 260px; display: flex; flex-direction: column; gap: 10px; }
.grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 3px; }
.col { height: 26px; background: #d4d4d4; border-radius: 2px; }
.col.hl { background: #0a0a0a; }
.caption { margin: 0; font-size: 10px; color: #a3a3a3; }`,
        },
      ],
      height: 130,
      caption: "12 is divisible by 1, 2, 3, 4, 6, and 12 — highlighted here every 4th column — so almost any column-span you'd want lines up evenly.",
    },
    {
      kind: "caniuse",
      feature: "css-grid",
      title: "CSS Grid Layout",
    },

    { kind: "heading", text: "14. Spacing should go between points of high contrast" },
    {
      kind: "paragraph",
      text: "The eye finds an edge by contrast, not by DOM box — measure spacing from a glyph's visible edge, not its invisible padding.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Measured to the icon's box",
          status: "bad",
          editable: true,
          htmlSource: `<div class="stack">
  <div class="row">
    <div class="icon-box">
      <div class="glyph"></div>
    </div>
    <span class="label">Label text</span>
  </div>
  <p class="caption">gap: 16px — measured to the icon's oversized box</p>
</div>`,
          cssSource: `.stack { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.row { display: flex; align-items: center; gap: 16px; }
.icon-box { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(10,10,10,0.04); }
.glyph { width: 14px; height: 14px; border-radius: 3px; background: #0a0a0a; }
.label { font-size: 13px; color: #171717; }
.caption { margin: 0; font-size: 10px; color: #a3a3a3; }`,
        },
        {
          label: "Measured to the visible edge",
          status: "good",
          editable: true,
          htmlSource: `<div class="stack">
  <div class="row">
    <div class="glyph"></div>
    <span class="label">Label text</span>
  </div>
  <p class="caption">gap: 16px — measured from the visible edge of the glyph</p>
</div>`,
          cssSource: `.stack { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.row { display: flex; align-items: center; gap: 16px; }
.glyph { width: 14px; height: 14px; border-radius: 3px; background: #0a0a0a; }
.label { font-size: 13px; color: #171717; }
.caption { margin: 0; font-size: 10px; color: #a3a3a3; }`,
        },
      ],
      height: 140,
      caption: "Both gaps are set to 16px — the first only looks that wide because of the icon's invisible padding; the second, measured from the glyph itself, actually reads as 16px.",
    },

    { kind: "heading", text: "15. Closer elements should be lighter" },
    {
      kind: "paragraph",
      text: "As surfaces get closer to the viewer, they should get lighter — a depth cue that works without a shadow.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Flat, no depth cue",
          status: "bad",
          editable: true,
          htmlSource: `<div class="stack">
  <div class="card card-1"></div>
  <div class="card card-2"></div>
  <div class="card card-3"></div>
</div>`,
          cssSource: `body { background: #171717; }
.stack { position: relative; width: 140px; height: 100px; }
.card { position: absolute; width: 100px; height: 60px; border-radius: 8px; background: #262626; }
.card-1 { left: 0; top: 20px; }
.card-2 { left: 20px; top: 10px; }
.card-3 { left: 40px; top: 0; }`,
        },
        {
          label: "Lighter toward the front",
          status: "good",
          editable: true,
          htmlSource: `<div class="stack">
  <div class="card card-1"></div>
  <div class="card card-2"></div>
  <div class="card card-3"></div>
</div>`,
          cssSource: `body { background: #171717; }
.stack { position: relative; width: 140px; height: 100px; }
.card { position: absolute; width: 100px; height: 60px; border-radius: 8px; }
.card-1 { left: 0; top: 20px; background: #262626; }
.card-2 { left: 20px; top: 10px; background: #3a3a3a; }
.card-3 { left: 40px; top: 0; background: #525252; }`,
        },
      ],
      height: 150,
      caption: "Same three overlapping cards — brightening each layer as it comes forward is enough to read as depth, with no shadow at all.",
    },

    { kind: "heading", text: "16. Make drop-shadow blur values double their distance values" },
    {
      kind: "paragraph",
      text: "A shadow extending 6px should carry roughly a 12px blur — match them one-to-one and the shadow looks harder and less natural.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "6px distance, 6px blur",
          status: "bad",
          editable: true,
          htmlSource: `<div class="box"></div>`,
          cssSource: `body { background: #f2f2f2; }
.box { width: 140px; height: 80px; background: #fff; border-radius: 8px; box-shadow: 0 6px 6px rgba(0,0,0,0.25); }`,
        },
        {
          label: "6px distance, 12px blur",
          status: "good",
          editable: true,
          htmlSource: `<div class="box"></div>`,
          cssSource: `body { background: #f2f2f2; }
.box { width: 140px; height: 80px; background: #fff; border-radius: 8px; box-shadow: 0 6px 12px rgba(0,0,0,0.18); }`,
        },
      ],
      height: 150,
      caption: "Same distance, same card — doubling the blur relative to the distance is what makes the second shadow read as soft, ambient light rather than a hard smudge.",
    },

    { kind: "heading", text: "17. Put simple on complex, or complex on simple" },
    {
      kind: "paragraph",
      text: "Pair a complex background with a simple foreground, or vice versa — stack complexity on complexity and the two compete.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Complex mark on complex background",
          status: "bad",
          editable: true,
          htmlSource: `<div class="bg stripes">
  <div class="mark">
    <div class="circle"></div>
    <div class="square"></div>
    <div class="ring"></div>
  </div>
</div>`,
          cssSource: `.bg { width: 140px; height: 100px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.stripes { background: repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 6px, #f5f5f5 6px, #f5f5f5 12px); }
.mark { position: relative; width: 44px; height: 44px; }
.circle { position: absolute; left: 0; top: 0; width: 26px; height: 26px; border-radius: 50%; background: #0a0a0a; }
.square { position: absolute; right: 0; bottom: 0; width: 22px; height: 22px; border-radius: 4px; background: #525252; transform: rotate(15deg); }
.ring { position: absolute; left: 14px; bottom: 4px; width: 18px; height: 18px; border-radius: 3px; border: 2px solid #0a0a0a; }`,
        },
        {
          label: "Simple mark on complex background",
          status: "good",
          editable: true,
          htmlSource: `<div class="bg stripes">
  <div class="dot"></div>
</div>`,
          cssSource: `.bg { width: 140px; height: 100px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.stripes { background: repeating-linear-gradient(45deg, #e5e5e5, #e5e5e5 6px, #f5f5f5 6px, #f5f5f5 12px); }
.dot { width: 36px; height: 36px; border-radius: 50%; background: #0a0a0a; }`,
        },
        {
          label: "Complex mark on simple background",
          status: "good",
          editable: true,
          htmlSource: `<div class="bg">
  <div class="mark">
    <div class="circle"></div>
    <div class="square"></div>
    <div class="ring"></div>
  </div>
</div>`,
          cssSource: `.bg { width: 140px; height: 100px; border-radius: 8px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; }
.mark { position: relative; width: 44px; height: 44px; }
.circle { position: absolute; left: 0; top: 0; width: 26px; height: 26px; border-radius: 50%; background: #0a0a0a; }
.square { position: absolute; right: 0; bottom: 0; width: 22px; height: 22px; border-radius: 4px; background: #525252; transform: rotate(15deg); }
.ring { position: absolute; left: 14px; bottom: 4px; width: 18px; height: 18px; border-radius: 3px; border: 2px solid #0a0a0a; }`,
        },
      ],
      height: 150,
      caption: "The first pair stacks complexity on complexity and the two compete; the other two each pair complexity with simplicity — a simple mark on the same striped background, or that same multi-shape mark on a plain one — and both read calmly.",
    },

    { kind: "heading", text: "18. Keep container colours within brightness limits" },
    {
      kind: "paragraph",
      text: "Keep the brightness gap between background and container small — within ~7% for light interfaces, ~12% for dark — or it starts to feel like a separate surface.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Too large a jump",
          status: "bad",
          editable: true,
          htmlSource: `<div class="wrap">
  <div class="card">~18% brightness jump</div>
</div>`,
          cssSource: `body { background: #fff; }
.wrap { width: 160px; padding: 16px; }
.card { background: #d0d0d0; border-radius: 8px; padding: 16px; font-size: 11px; color: #525252; }`,
        },
        {
          label: "Within limits",
          status: "good",
          editable: true,
          htmlSource: `<div class="wrap">
  <div class="card">~4% brightness jump</div>
</div>`,
          cssSource: `body { background: #fff; }
.wrap { width: 160px; padding: 16px; }
.card { background: #f5f5f5; border-radius: 8px; padding: 16px; font-size: 11px; color: #525252; }`,
        },
      ],
      height: 130,
      caption: "Same page background in both — an 18% jump reads as a harshly different material, while a ~4% jump still registers as a container without looking disconnected.",
    },

    { kind: "heading", text: "19. Make outer padding the same as or more than inner padding" },
    {
      kind: "paragraph",
      text: "If a container's outer padding is smaller than the gap between its items, those items end up feeling closer to the edge than to each other.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Outer 8px, inner gap 16px",
          status: "bad",
          editable: true,
          htmlSource: `<div class="card">
  <div class="item">First item</div>
  <div class="item">Second item</div>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; }
.card { width: 180px; background: #f5f5f5; border-radius: 8px; padding: 8px; display: flex; flex-direction: column; gap: 16px; text-align: left; }
.item { font-size: 12px; color: #171717; }`,
        },
        {
          label: "Outer 20px, inner gap 12px",
          status: "good",
          editable: true,
          htmlSource: `<div class="card">
  <div class="item">First item</div>
  <div class="item">Second item</div>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; }
.card { width: 180px; background: #f5f5f5; border-radius: 8px; padding: 20px; display: flex; flex-direction: column; gap: 12px; text-align: left; }
.item { font-size: 12px; color: #171717; }`,
        },
      ],
      height: 150,
      caption: "Same two items — once the outer padding is larger than the inner gap, the pair reads as a single grouped unit instead of two items pinned to the card's edges.",
    },

    { kind: "heading", text: "20. Keep body text at 16px or above" },
    {
      kind: "paragraph",
      text: "16px is the default body size for a reason — below it, text asks the reader to lean in.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "13px / 1.4",
          status: "bad",
          editable: true,
          tailwind: '<p class="text-[13px] leading-snug">',
          htmlSource: `<p class="text">Reading small text asks the eye to lean in and work harder than it should.</p>`,
          cssSource: `.text { max-width: 200px; font-size: 13px; line-height: 1.4; margin: 0; text-align: left; }`,
        },
        {
          label: "17px / 1.55",
          status: "good",
          editable: true,
          tailwind: '<p class="text-[17px] leading-[1.55]">',
          htmlSource: `<p class="text">Reading small text asks the eye to lean in and work harder than it should.</p>`,
          cssSource: `.text { max-width: 220px; font-size: 17px; line-height: 1.55; margin: 0; text-align: left; }`,
        },
      ],
      height: 140,
      caption: "Same sentence, same width — the larger size with more breathing room between lines reads noticeably easier.",
    },

    { kind: "heading", text: "21. Use a line length around 70 characters" },
    {
      kind: "paragraph",
      text: "Lines can run 60-80 characters comfortably; go far past that and readability suffers.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Unconstrained vs. measure: 65ch",
          editable: true,
          tailwind: '<p class="max-w-none">\n<p class="max-w-prose"> <!-- max-w-prose = 65ch -->',
          htmlSource: `<div class="stack">
  <div>
    <p class="note note-bad">No max-width</p>
    <p class="body body-unconstrained">Long lines make the eye lose its place on the way back to the start, which is why unrestrained paragraphs feel more tiring to read the wider the browser window gets, even though nothing about the words themselves has changed.</p>
  </div>
  <div>
    <p class="note note-good">max-width: 65ch</p>
    <p class="body body-measured">Long lines make the eye lose its place on the way back to the start, which is why unrestrained paragraphs feel more tiring to read the wider the browser window gets, even though nothing about the words themselves has changed.</p>
  </div>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; text-align: left; }
.stack { display: flex; flex-direction: column; gap: 16px; width: 100%; }
.note { margin: 0 0 4px; font-size: 10px; font-weight: 600; }
.note-bad { color: #dc2626; }
.note-good { color: #16a34a; }
.body { margin: 0; font-size: 13px; line-height: 1.5; }
.body-measured { max-width: 65ch; }`,
        },
      ],
      height: 210,
      caption: "The unconstrained paragraph stretches edge to edge; the second one wraps at a length the eye can track line to line.",
    },
    {
      kind: "caniuse",
      feature: "ch-unit",
      title: "ch unit",
      caption: "The measure above is set in ch — the width of the '0' character in the current font — rather than px, so it scales with the typeface.",
    },

    { kind: "heading", text: "22. Make horizontal padding twice the vertical padding in buttons" },
    {
      kind: "paragraph",
      text: "A button roughly twice as wide as it is tall gets recognized as a button on sight, before anyone reads its label.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "padding: 12px 14px",
          status: "bad",
          editable: true,
          tailwind: '<button class="px-3.5 py-3">',
          htmlSource: `<button class="btn">Continue</button>`,
          cssSource: `.btn { font: 600 13px system-ui, sans-serif; padding: 12px 14px; border-radius: 6px; border: 1px solid #0a0a0a; background: #0a0a0a; color: #fafafa; }`,
        },
        {
          label: "padding: 12px 24px",
          status: "good",
          editable: true,
          tailwind: '<button class="px-6 py-3">',
          htmlSource: `<button class="btn">Continue</button>`,
          cssSource: `.btn { font: 600 13px system-ui, sans-serif; padding: 12px 24px; border-radius: 6px; border: 1px solid #0a0a0a; background: #0a0a0a; color: #fafafa; }`,
        },
      ],
      height: 110,
      caption: "Same vertical padding, same text — only the horizontal padding changes, and the second button reads as intentional rather than cramped.",
    },

    { kind: "heading", text: "23. Use two typefaces at most" },
    {
      kind: "paragraph",
      text: "A second typeface can reinforce a design's idea; a third rarely adds anything but noise.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Three typefaces",
          status: "bad",
          editable: true,
          htmlSource: `<div class="stack">
  <p class="heading">Heading in serif</p>
  <p class="body">Body copy in monospace</p>
  <p class="label">Label in sans</p>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; }
.stack { display: flex; flex-direction: column; gap: 8px; text-align: left; }
.heading { margin: 0; font: 700 18px Georgia, serif; color: #0a0a0a; }
.body { margin: 0; font: 13px 'Courier New', monospace; color: #171717; }
.label { margin: 0; font: 600 11px system-ui, sans-serif; letter-spacing: 0.05em; text-transform: uppercase; color: #737373; }`,
        },
        {
          label: "Two typefaces",
          status: "good",
          editable: true,
          htmlSource: `<div class="stack">
  <p class="heading">Heading in sans</p>
  <p class="body">Body copy in the same sans</p>
  <p class="label">A code label in monospace</p>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; }
.stack { display: flex; flex-direction: column; gap: 8px; text-align: left; }
.heading { margin: 0; font: 700 18px system-ui, sans-serif; color: #0a0a0a; }
.body { margin: 0; font: 13px system-ui, sans-serif; color: #171717; }
.label { margin: 0; font: 12px 'Courier New', monospace; color: #737373; }`,
        },
      ],
      height: 150,
      caption: "The first mixes a serif heading, a monospace body, and a sans label. The second keeps everything on one sans, reserving the monospace for a single code-like detail.",
    },

    { kind: "heading", text: "24. Nest corners properly" },
    {
      kind: "paragraph",
      text: "An inner corner radius should equal the outer radius minus the padding between them, or the two curves fight instead of feeling concentric.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Outer 16px, inner 16px",
          status: "bad",
          editable: true,
          tailwind: '<div class="rounded-2xl p-4">\n  <div class="rounded-2xl">',
          htmlSource: `<div class="outer">
  <div class="inner"></div>
</div>`,
          cssSource: `.outer { width: 160px; background: #eee; border-radius: 16px; padding: 16px; }
.inner { background: #fff; border: 1px solid #ddd; border-radius: 16px; height: 60px; }`,
        },
        {
          label: "Outer 16px, inner 8px (16 − padding)",
          status: "good",
          editable: true,
          tailwind: '<div class="rounded-2xl p-4">\n  <div class="rounded-lg">',
          htmlSource: `<div class="outer">
  <div class="inner"></div>
</div>`,
          cssSource: `.outer { width: 160px; background: #eee; border-radius: 16px; padding: 16px; }
.inner { background: #fff; border: 1px solid #ddd; border-radius: 8px; height: 60px; }`,
        },
      ],
      height: 150,
      caption: "Same padding both times — matching the inner radius to the outer radius minus that padding is what makes the curves feel concentric.",
    },

    { kind: "heading", text: "25. Don't put two hard divides next to each other" },
    {
      kind: "paragraph",
      text: "Background transitions, container edges, and dividing lines each create a hard visual break — stack two together and they read as clutter.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Two adjacent borders",
          status: "bad",
          editable: true,
          htmlSource: `<div class="wrap">
  <div class="section-a">Section one</div>
  <div class="section-b">Section two</div>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; }
.wrap { width: 180px; text-align: left; }
.section-a { border-bottom: 1px solid #d4d4d4; padding-bottom: 10px; margin-bottom: 2px; font-size: 12px; color: #171717; }
.section-b { border-top: 1px solid #d4d4d4; padding-top: 10px; font-size: 12px; color: #171717; }`,
        },
        {
          label: "One shared divide",
          status: "good",
          editable: true,
          htmlSource: `<div class="wrap">
  <div class="section-a">Section one</div>
  <div class="section-b">Section two</div>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; }
.wrap { width: 180px; text-align: left; }
.section-a { padding-bottom: 12px; font-size: 12px; color: #171717; }
.section-b { border-top: 1px solid #d4d4d4; padding-top: 12px; font-size: 12px; color: #171717; }`,
        },
      ],
      height: 140,
      caption: "Both examples separate the same two sections — the first draws two lines a couple pixels apart; the second commits to a single shared edge.",
    },

    { kind: "heading", text: "26. Don't use shadows in dark interfaces" },
    {
      kind: "paragraph",
      text: "A shadow needs a light background to read against — in dark UI it disappears or smudges, so use a lighter border instead.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Shadow on dark",
          status: "bad",
          editable: true,
          htmlSource: `<div class="box"></div>`,
          cssSource: `body { background: #171717; }
.box { width: 140px; height: 80px; background: #262626; border-radius: 8px; box-shadow: 0 8px 16px rgba(0,0,0,0.4); }`,
        },
        {
          label: "Border on dark",
          status: "good",
          editable: true,
          htmlSource: `<div class="box"></div>`,
          cssSource: `body { background: #171717; }
.box { width: 140px; height: 80px; background: #262626; border: 1px solid #404040; border-radius: 8px; }`,
        },
      ],
      height: 130,
      caption: "The shadow barely registers against the dark page background; the lighter border pops as a clean edge instead.",
    },

    { kind: "heading", text: "27. Don't mix depth techniques" },
    {
      kind: "paragraph",
      text: "Pick one way of implying depth — borders, shadows, or brightness — and use it everywhere; this site sticks to flat borders only.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Border + shadow",
          status: "bad",
          editable: true,
          tailwind: '<div class="border border-neutral-300 shadow-lg">',
          htmlSource: `<div class="card">Border + shadow</div>`,
          cssSource: `.card { width: 100%; max-width: 180px; background: #fff; border: 1px solid #ddd; box-shadow: 0 12px 24px rgba(0,0,0,0.18); border-radius: 8px; padding: 20px; font-size: 12px; color: #525252; }`,
        },
        {
          label: "Border only",
          status: "good",
          editable: true,
          tailwind: '<div class="border border-neutral-300">',
          htmlSource: `<div class="card">Border only</div>`,
          cssSource: `.card { width: 100%; max-width: 180px; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px; font-size: 12px; color: #525252; }`,
        },
      ],
      height: 150,
      caption: "The shadow implies the card is lit and floating; the flat border keeps it on the same plane as the page.",
    },

    { kind: "heading", text: "28. Lower the contrast of icons paired with text" },
    {
      kind: "paragraph",
      text: "An icon at full contrast reads heavier than the text beside it, since a filled shape carries more visual weight than a thin glyph.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Icon at full contrast",
          status: "bad",
          editable: true,
          htmlSource: `<div class="row">
  <svg class="icon" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7"/></svg>
  <span class="label">Notifications</span>
</div>`,
          cssSource: `.row { display: flex; align-items: center; gap: 8px; }
.icon { fill: #0a0a0a; }
.label { font-size: 13px; color: #0a0a0a; }`,
        },
        {
          label: "Icon muted",
          status: "good",
          editable: true,
          htmlSource: `<div class="row">
  <svg class="icon" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7"/></svg>
  <span class="label">Notifications</span>
</div>`,
          cssSource: `.row { display: flex; align-items: center; gap: 8px; }
.icon { fill: #a3a3a3; }
.label { font-size: 13px; color: #0a0a0a; }`,
        },
      ],
      height: 110,
      caption: "Same label, same icon shape — muting the icon's fill is what keeps it from outweighing the text it's paired with.",
    },

    { kind: "heading", text: "Beyond the source: two rules this site adds" },
    {
      kind: "paragraph",
      text: "Hobday's list covers static design; this site is interactive, so it adds two of its own.",
    },

    { kind: "heading", text: "29. One accent color, used deliberately" },
    {
      kind: "paragraph",
      text: "This site reserves a single signature blue for things that are always interactive — links, the current-page indicator, focus rings.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "No accent",
          status: "bad",
          editable: true,
          tailwind: '<a class="text-inherit underline">',
          htmlSource: `<p class="text">Read the <a href="#" class="link">full guide</a> for details.</p>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; text-align: left; }
.text { max-width: 220px; font-size: 14px; line-height: 1.5; color: #171717; margin: 0; }
.link { color: inherit; text-decoration: underline; }`,
        },
        {
          label: "One accent, used deliberately",
          status: "good",
          editable: true,
          tailwind: '<a class="text-accent">\n<div class="border-l-2 border-accent text-accent">',
          htmlSource: `<div class="stack">
  <p class="text">Read the <a href="#" class="link">full guide</a> for details.</p>
  <div class="current">Current page</div>
</div>`,
          cssSource: `body { align-items: flex-start; justify-content: flex-start; text-align: left; }
.stack { display: flex; flex-direction: column; gap: 14px; width: 100%; max-width: 220px; }
.text { margin: 0; font-size: 14px; line-height: 1.5; color: #171717; }
.link { color: #0060df; text-decoration: underline; }
.current { border-left: 3px solid #0060df; padding: 4px 0 4px 10px; font-size: 13px; font-weight: 600; color: #0060df; }`,
        },
      ],
      height: 150,
      caption: "The accent shows up in exactly two places here: the link, and the current-page indicator. Everything else stays near-black or muted gray.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Hover / focus darkens the accent",
          editable: true,
          htmlSource: `<a href="#" class="accent-link">Hover or tab to me</a>`,
          cssSource: `.accent-link {
  font: 600 14px system-ui, sans-serif;
  color: #0060df;
  text-decoration: underline;
  transition: color 160ms ease-out;
}
.accent-link:hover, .accent-link:focus-visible { color: #0345a5; }`,
        },
      ],
      height: 100,
      caption: "Hover or tab to the link — the accent darkens slightly, the only color transition on the page.",
    },
    {
      kind: "callout",
      variant: "note",
      text: "The accent is deliberately a single hue — a second accent for warning/success states would undercut rule 3: contrast, not color, should carry meaning.",
    },
    {
      kind: "caniuse",
      feature: "css-focus-visible",
      title: ":focus-visible",
      caption: "The hover demo above pairs :hover with :focus-visible rather than :focus, so the accent only shows on keyboard focus, not on every mouse click.",
    },

    { kind: "heading", text: "30. Motion is short and eases out" },
    {
      kind: "paragraph",
      text: "Interface transitions here run under 200ms on a gentle ease-out curve — long enough to feel intentional, short enough to never wait on.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "600ms, ease-in-out",
          status: "bad",
          editable: true,
          tailwind: '<div class="transition-transform duration-600 ease-in-out">',
          htmlSource: `<div class="track"><div class="box">Hover</div></div>`,
          cssSource: `.track {
  width: 160px;
  height: 48px;
  border: 1px dashed #d4d4d4;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}
.box {
  position: absolute;
  left: 6px;
  top: 6px;
  width: 60px;
  height: 36px;
  border-radius: 6px;
  background: #0a0a0a;
  color: #fafafa;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 600ms ease-in-out;
}
.track:hover .box { transform: translateX(90px); }`,
        },
        {
          label: "160ms, ease-out",
          status: "good",
          editable: true,
          tailwind: '<div class="transition-transform duration-160 ease-out">',
          htmlSource: `<div class="track"><div class="box">Hover</div></div>`,
          cssSource: `.track {
  width: 160px;
  height: 48px;
  border: 1px dashed #d4d4d4;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}
.box {
  position: absolute;
  left: 6px;
  top: 6px;
  width: 60px;
  height: 36px;
  border-radius: 6px;
  background: #0a0a0a;
  color: #fafafa;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 160ms ease-out;
}
.track:hover .box { transform: translateX(90px); }`,
        },
      ],
      height: 110,
      caption: "Hover each box — the slow one lags noticeably behind the cursor; the fast one feels immediate.",
    },
  ],
};
