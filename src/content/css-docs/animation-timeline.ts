import type { CssDoc } from "../cssDocs";

// --- Live demo HTML generators ----------------------------------------------
// Sandboxed iframes (sandbox="", no scripts) — scroll-driven animations are
// pure CSS, so native iframe scrolling is all these demos need.

const scrollProgressHtml = () => `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body { font: 12px/1.6 system-ui, sans-serif; color: #171717; background: #fff; }
  .progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: #0060df;
    transform: scaleX(0);
    transform-origin: left;
    animation: grow-progress linear;
    animation-timeline: scroll(root block);
  }
  @keyframes grow-progress { to { transform: scaleX(1); } }
  .content { padding: 20px; }
  .content p { max-width: 34ch; margin: 0 0 220px; color: #525252; }
  .content p:last-child { margin-bottom: 40px; }
</style>
</head>
<body>
  <div class="progress"></div>
  <div class="content">
    <p>Scroll this preview. The bar above tracks how far down the page you are — no scroll event listener involved, just <code>animation-timeline: scroll(root block)</code>.</p>
    <p>Still going. The animation's progress is driven directly by the scrollbar position, so it can never drift out of sync the way a JS-computed percentage sometimes does.</p>
    <p>Almost at the bottom — the bar should be nearly full.</p>
  </div>
</body>
</html>`;

const localScrollerHtml = () => `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body { font: 12px/1.6 system-ui, sans-serif; color: #171717; background: #fff; padding: 14px; }
  .scroller {
    max-width: 260px;
    margin: 0 auto;
    height: 160px;
    overflow-y: auto;
    border: 1px solid #d4d4d4;
    border-radius: 10px;
    position: relative;
    scroll-timeline: --local block;
  }
  .track {
    position: sticky;
    top: 10px;
    height: 30px;
    margin: 0 8px;
    background: #f5f5f5;
    border-radius: 15px;
  }
  .ball {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #0060df;
    animation: slide linear;
    animation-timeline: --local;
  }
  @keyframes slide { to { left: calc(100% - 28px); } }
  .filler { padding: 10px 12px 480px; color: #737373; }
</style>
</head>
<body>
  <div class="scroller">
    <div class="track"><div class="ball"></div></div>
    <div class="filler">Scroll inside this box. The ball slides right as you scroll down — it's reading a <em>named</em> timeline scoped to this scroller only, not the page.</div>
  </div>
</body>
</html>`;

const viewTimelineHtml = () => {
  const cards = [1, 2, 3]
    .map(
      (n) => `<div class="card">Card ${n} — reveals on entry</div>`,
    )
    .join('<div class="gap"></div>');
  return `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body { font: 12px/1.6 system-ui, sans-serif; color: #171717; background: #fff; }
  .scroller { height: 220px; overflow-y: auto; padding: 16px; }
  .spacer-top { height: 30px; }
  .card {
    height: 64px;
    border-radius: 8px;
    background: #0060df;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    animation: reveal linear;
    animation-timeline: view(block 20%);
    animation-range: entry;
  }
  @keyframes reveal {
    from { opacity: 0; transform: translateY(28px) scale(0.92); }
    to { opacity: 1; transform: none; }
  }
  .gap { height: 60px; }
  .spacer-bottom { height: 40px; }
</style>
</head>
<body>
  <div class="scroller">
    <div class="spacer-top"></div>
    ${cards}
    <div class="spacer-bottom"></div>
  </div>
</body>
</html>`;
};

export const animationTimelineDoc: CssDoc = {
  slug: "animation-timeline",
  title: "animation-timeline",
  category: "CSS property (scroll-driven animations)",
  excerpt:
    "Ties a CSS animation's progress to scroll position instead of wall-clock time — progress bars, reveal-on-scroll, and parallax-style effects without a scroll event listener.",
  sections: [
    { kind: "heading", text: "What it does" },
    {
      kind: "paragraph",
      text: "Every animation normally advances with time: animation-duration says how many seconds it takes to go from 0% to 100%. animation-timeline replaces that clock with a scroll position — the animation's progress becomes a direct function of how far a scroller (or an element within it) has scrolled, updating on the compositor thread in sync with the scrollbar rather than on a JS-driven rAF loop.",
    },
    {
      kind: "code",
      language: "css",
      code: "animation-timeline: none;                 /* default: time-driven, as normal */\nanimation-timeline: scroll(<scroller> <axis>);  /* progress = scroll position */\nanimation-timeline: view(<axis> <inset>);       /* progress = position in viewport */\nanimation-timeline: --custom-name;         /* a named timeline, see below */",
      tailwind: '<div class="[animation-timeline:scroll(root_block)]">',
    },
    {
      kind: "callout",
      variant: "note",
      text: "Once animation-timeline is set to a scroll() or view() timeline, animation-duration is ignored — the browser computes progress from scroll position instead. animation-timing-function, animation-fill-mode, and multi-step @keyframes still work exactly as they do for time-driven animations.",
    },

    { kind: "heading", text: "scroll(): tied to a scroller's position" },
    {
      kind: "paragraph",
      text: "scroll(root block) ties progress to the document's own scrollbar: 0% at the top, 100% at the bottom. A classic reading-progress bar is a couple of lines of CSS, no scroll listener required.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "animation-timeline: scroll(root block)",
          code: ".progress {\n  transform: scaleX(0);\n  transform-origin: left;\n  animation: grow linear;\n  animation-timeline: scroll(root block);\n}\n@keyframes grow {\n  to { transform: scaleX(1); }\n}",
          tailwind: '<div class="scale-x-0 origin-left animate-[grow_linear] [animation-timeline:scroll(root_block)]">',
          html: scrollProgressHtml,
        },
      ],
      height: 260,
      caption: "Scroll the preview — the blue bar's width is the page's own scroll fraction, recomputed by the browser on every frame.",
    },

    { kind: "heading", text: "Named timelines: scoped to a local scroller" },
    {
      kind: "paragraph",
      text: "scroll(root block) always reads the page's own scrollbar. To drive an animation off a different scroller — a chat panel, a horizontally-scrolling gallery, a sidebar — give that element scroll-timeline-name (or the scroll-timeline shorthand) and reference the same name from animation-timeline on whatever element you're animating, even if it lives elsewhere in the DOM.",
    },
    {
      kind: "code",
      language: "css",
      code: ".scroller {\n  scroll-timeline: --local block; /* name + axis, on the scroller */\n}\n.ball {\n  animation: slide linear;\n  animation-timeline: --local;    /* read it from anywhere */\n}",
      tailwind: '<div class="[scroll-timeline:--local_block]">\n  <div class="animate-[slide_linear] [animation-timeline:--local]">',
    },
    {
      kind: "demo",
      panes: [
        {
          label: "A timeline scoped to one scroll container",
          html: localScrollerHtml,
        },
      ],
      height: 220,
      caption: "This timeline only reacts to the little box's own scrollbar — scrolling the rest of the page (or this doc) doesn't move the ball at all.",
    },
    {
      kind: "callout",
      variant: "tip",
      text: "timeline-scope on a shared ancestor extends a named timeline's reach to elements that aren't descendants of the scroller that defines it — useful when the scroller and the thing you're animating are siblings rather than nested.",
    },

    { kind: "heading", text: "view(): tied to viewport visibility" },
    {
      kind: "paragraph",
      text: "scroll() timelines track the scroller as a whole; view() timelines instead track one specific element's position as it passes through its scroller's visible area — 0% as it starts entering, 100% as it finishes leaving. That's the mechanism behind \"reveal on scroll into view\" effects, without an IntersectionObserver.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "animation-timeline: view(block 20%)",
          code: ".card {\n  animation: reveal linear;\n  animation-timeline: view(block 20%);\n  animation-range: entry;\n}\n@keyframes reveal {\n  from { opacity: 0; transform: translateY(28px) scale(.92); }\n  to   { opacity: 1; transform: none; }\n}",
          tailwind: '<div class="animate-[reveal_linear] [animation-timeline:view(block_20%)] [animation-range:entry]">',
          html: viewTimelineHtml,
        },
      ],
      height: 260,
      caption: "Scroll the list — each card fades and slides into place purely while it's entering the container's viewport, then holds steady once animation-range: entry has finished.",
    },

    { kind: "heading", text: "animation-range: trimming the attachment range" },
    {
      kind: "paragraph",
      text: "By default a view() timeline spans an element's entire time in view — from fully offscreen-below to fully offscreen-above. animation-range narrows that down to just the part of the journey you actually want to animate, using named ranges instead of raw percentages.",
    },
    {
      kind: "table",
      headers: ["Keyword", "Covers"],
      rows: [
        ["entry", "While the element is still entering the viewport (not yet fully visible)."],
        ["contain", "While the element is fully contained within the viewport."],
        ["exit", "While the element is leaving the viewport."],
        ["cover", "The entire time any part of the element is visible — entry + contain + exit."],
        ["entry-crossing", "While the element's leading edge is crossing into the viewport."],
        ["exit-crossing", "While the element's trailing edge is crossing out of the viewport."],
      ],
    },
    {
      kind: "code",
      language: "css",
      code: "/* animate only while the card is entering, not for its whole time on screen */\nanimation-range: entry;\n\n/* or trim to an explicit slice of the cover range */\nanimation-range: cover 0% cover 40%;",
      tailwind: '<div class="[animation-range:entry]">\n<div class="[animation-range:cover_0%_cover_40%]">',
    },

    { kind: "heading", text: "Fallback for unsupported browsers" },
    {
      kind: "paragraph",
      text: "There's no CSS-only fallback value the way there is for e.g. color: contrast-color() — browsers that don't support animation-timeline just ignore the declaration and the element keeps whatever its non-animated state is (its first @keyframes rule, effectively). Wrap the enhancement in @supports so unsupported browsers get a sane, fully-visible starting state instead of a permanently invisible or half-collapsed one.",
    },
    {
      kind: "code",
      language: "css",
      code: ".card {\n  opacity: 1; /* sane default for browsers without support */\n}\n\n@supports (animation-timeline: view()) {\n  .card {\n    opacity: 0;\n    animation: reveal linear;\n    animation-timeline: view(block 20%);\n    animation-range: entry;\n  }\n}",
    },
    {
      kind: "callout",
      variant: "warning",
      text: "prefers-reduced-motion applies here too — scroll-driven reveals are still motion. Wrap the animation rules in an additional @media (prefers-reduced-motion: no-preference) guard so readers who've asked for less motion just see content in its resting state.",
    },

    { kind: "heading", text: "Things to watch for" },
    {
      kind: "list",
      items: [
        "animation-duration is meaningless once a scroll/view timeline is set — don't leave a duration in the shorthand expecting it to matter; only the timing function and keyframe percentages control pacing.",
        "A scroll(root block) timeline only ever reaches 100% if the document is actually taller than the viewport — test with real content length, not a half-empty page.",
        "Named timelines (scroll-timeline-name / view-timeline-name) must be unique per scroller; animation-timeline: --name just looks up that name in the current scope, it doesn't search the whole document.",
        "Because progress comes from layout/scroll position rather than a clock, DevTools' normal animation-duration inspection tools don't apply the same way — use the Chrome DevTools \"Animations\" or \"Scroll-driven animations\" panel instead.",
      ],
    },

    { kind: "heading", text: "Using it with Tailwind" },
    {
      kind: "paragraph",
      text: "Scroll-driven animations are recent enough that Tailwind has no dedicated utilities for animation-timeline, scroll-timeline, view-timeline, or animation-range — every one of them has to go through Tailwind's arbitrary-property syntax, [property:value], with spaces in the value replaced by underscores.",
    },
    {
      kind: "code",
      language: "html",
      code: '<!-- a named local scroll timeline, then reading it from the animated element -->\n<div class="[scroll-timeline:--local_block]">\n  <div class="animate-[slide_linear] [animation-timeline:--local]"></div>\n</div>',
      caption: "animate-[slide_linear] is Tailwind's arbitrary-value form of animation: slide linear — it still points at a @keyframes rule you define in real CSS, Tailwind utilities can't declare keyframes inline.",
    },
    {
      kind: "list",
      items: [
        "The @keyframes block itself always stays plain CSS (in global.css or a <style> block) — there's no Tailwind utility that generates keyframe steps, only ones that reference a keyframe name you've already defined.",
        "Chain multiple arbitrary properties by just adding another bracketed class: [animation-timeline:view(block_20%)] [animation-range:entry] is two separate utilities, not one.",
        "animation-range's raw value has commas and percent signs in odd places (cover_0%_cover_40%) — double-check the underscore substitution renders the CSS you expect; when a value gets hard to read as a class name, it's often clearer to keep it in a plain CSS rule instead and reserve Tailwind for the surrounding layout.",
      ],
    },

    { kind: "heading", text: "Can I use" },
    {
      kind: "caniuse",
      feature: "mdn-css_properties_animation-timeline",
      title: "animation-timeline",
      caption: "The core mechanism: swaps an animation's driver from wall-clock time to a scroll or view position.",
    },
    {
      kind: "caniuse",
      feature: "mdn-css_properties_view-timeline",
      title: "view-timeline",
      caption: "Shorthand for view-timeline-name + view-timeline-axis, used for the reveal-on-scroll demo above.",
    },
    {
      kind: "caniuse",
      feature: "mdn-css_properties_timeline-scope",
      title: "timeline-scope",
      caption: "Extends a named scroll/view timeline's reach beyond the scroller's own descendants.",
    },
  ],
};
