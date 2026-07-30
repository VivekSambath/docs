import type { CssDoc } from "../cssDocs";

// --- Live demo HTML generators ----------------------------------------------
// Sandboxed iframes (sandbox="", no scripts) — every demo here is triggered
// by real :hover, so no JS is needed. (A `toggle`-driven demo would remount
// the iframe on every flip, which would defeat the transition entirely.)

const snapVsTransitionHtml = (transitioned: boolean) => `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body {
    font: 13px/1.4 system-ui, sans-serif;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .swatch {
    width: 200px;
    padding: 24px;
    border-radius: 10px;
    text-align: center;
    font-weight: 600;
    background: #eab308;
    color: #171717;
    ${transitioned ? "transition: background-color 220ms ease-out;" : ""}
  }
  .swatch:hover { background: #1e3a8a; color: #fff; }
  .swatch span { display: block; margin-top: 6px; font-weight: 400; font-size: 11px; opacity: .85; }
</style>
</head>
<body>
  <div class="swatch">
    Hover me
    <span>${transitioned ? "transition: background-color 220ms" : "no transition"}</span>
  </div>
</body>
</html>`;

const easingHtml = (fn: string, label: string) => `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body {
    font: 11px/1.4 system-ui, sans-serif;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 16px;
  }
  .track { position: relative; width: 100%; height: 40px; background: #f5f5f5; border-radius: 20px; }
  .track:hover .ball { transform: translateX(calc(100% - 40px)); }
  .ball {
    position: absolute;
    top: 4px;
    left: 4px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #0060df;
    transition: transform 900ms ${fn};
  }
</style>
</head>
<body>
  <div class="track" title="${label}"><div class="ball"></div></div>
</body>
</html>`;

const discreteHtml = () => `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body {
    font: 12px/1.4 system-ui, sans-serif;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 40px;
  }
  .wrap { position: relative; display: inline-block; }
  .btn {
    padding: 10px 18px;
    border-radius: 8px;
    background: #0060df;
    color: #fff;
    font-weight: 600;
    font-size: 12px;
  }
  .tooltip {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    background: #171717;
    color: #fff;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 11px;
    white-space: nowrap;
    display: none;
    opacity: 0;
    transition: opacity 180ms ease-out, display 180ms allow-discrete;
  }
  @starting-style {
    .wrap:hover .tooltip { opacity: 0; }
  }
  .wrap:hover .tooltip {
    display: block;
    opacity: 1;
  }
</style>
</head>
<body>
  <div class="wrap">
    <div class="btn">Hover me</div>
    <div class="tooltip">display: none → block, fading in</div>
  </div>
</body>
</html>`;

const sitewideColorRuleHtml = () => `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body {
    font: 12px/1.4 system-ui, sans-serif;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card {
    width: 220px;
    padding: 20px;
    border-radius: 10px;
    border: 2px solid #d4d4d4;
    background: #fff;
    color: #171717;
    text-align: center;
    font-weight: 600;
    transition-property: background-color, border-color, color, box-shadow;
    transition-duration: 180ms;
    transition-timing-function: ease-out;
  }
  .card:hover {
    background: #171717;
    border-color: #171717;
    color: #fafafa;
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.08);
  }
  .card span { display: block; margin-top: 6px; font-weight: 400; font-size: 11px; opacity: .8; }
</style>
</head>
<body>
  <div class="card">
    Hover me
    <span>background-color, border-color, color, box-shadow</span>
  </div>
</body>
</html>`;

const navLinkHtml = () => `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body {
    font: 13px/1.4 system-ui, sans-serif;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .link {
    display: inline-block;
    padding-bottom: 4px;
    border-bottom: 2px solid transparent;
    color: #171717;
    font-weight: 600;
    text-decoration: none;
    transition: color 150ms ease-out, border-color 150ms ease-out;
  }
  .link:hover { color: #0060df; border-color: #0060df; }
</style>
</head>
<body>
  <a class="link" href="#">Hover this nav link</a>
</body>
</html>`;

export const transitionsDoc: CssDoc = {
  slug: "transitions",
  title: "transition",
  category: "CSS property",
  excerpt:
    "Eases a property from one value to another over time instead of snapping instantly — the mechanism behind hover states, theme toggles, and every other 'this UI feels smooth' detail.",
  sections: [
    { kind: "heading", text: "What it does" },
    {
      kind: "paragraph",
      text: "Change a CSS property's value — via `:hover`, a class toggle, a media query flip — and by default the new value applies **instantly, in a single frame**. `transition` tells the browser to ==interpolate between the old and new value over a given duration== instead, animating it frame by frame **without a single line of JavaScript**.",
    },
    { kind: "heading", text: "Syntax" },
    {
      kind: "code",
      language: "css",
      code: "/* shorthand: property duration timing-function delay */\ntransition: background-color 200ms ease-out;\ntransition: background-color 200ms ease-out, transform 150ms ease-in;\n\n/* or the four longhands separately */\ntransition-property: background-color;\ntransition-duration: 200ms;\ntransition-timing-function: ease-out;\ntransition-delay: 0ms;",
      tailwind: '<div class="transition-colors duration-200 ease-out">',
    },
    {
      kind: "table",
      headers: ["Longhand", "Controls"],
      rows: [
        ["transition-property", "Which propert(ies) animate. all means every animatable property; explicit names (e.g. background-color, transform) are usually the better choice."],
        ["transition-duration", "How long the interpolation takes."],
        ["transition-timing-function", "The easing curve — ease, ease-out, linear, cubic-bezier(...), steps(...)."],
        ["transition-delay", "How long to wait before starting."],
      ],
    },
    {
      kind: "demo",
      panes: [
        {
          label: "no transition",
          status: "bad",
          code: ".swatch:hover { background: #1e3a8a; }",
          tailwind: '<div class="hover:bg-blue-900">',
          html: () => snapVsTransitionHtml(false),
        },
        {
          label: "transition: background-color 220ms",
          status: "good",
          code: ".swatch {\n  transition: background-color 220ms ease-out;\n}\n.swatch:hover { background: #1e3a8a; }",
          tailwind: '<div class="transition-colors duration-220 ease-out hover:bg-blue-900">',
          html: () => snapVsTransitionHtml(true),
        },
      ],
      height: 170,
      caption: "Hover both swatches. The left one's color change is a single instant frame; the right one eases over 220ms — same hover rule, only the transition declaration differs.",
    },

    { kind: "heading", text: "Timing functions" },
    {
      kind: "paragraph",
      text: "The same duration can feel completely different depending on the curve. linear moves at a constant rate and reads as mechanical; ease-out starts fast and settles in, which is why it's the default choice for most UI motion; a custom cubic-bezier() can overshoot for a springier feel.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "linear",
          code: "transition: transform 900ms linear;",
          tailwind: '<div class="transition-transform duration-900 ease-linear">',
          html: () => easingHtml("linear", "linear"),
        },
        {
          label: "ease-out",
          code: "transition: transform 900ms ease-out;",
          tailwind: '<div class="transition-transform duration-900 ease-out">',
          html: () => easingHtml("ease-out", "ease-out"),
        },
        {
          label: "cubic-bezier (overshoot)",
          code: "transition: transform 900ms cubic-bezier(.34, 1.56, .64, 1);",
          tailwind: '<div class="transition-transform duration-900 ease-[cubic-bezier(.34,1.56,.64,1)]">',
          html: () => easingHtml("cubic-bezier(.34, 1.56, .64, 1)", "bouncy"),
        },
      ],
      height: 90,
      caption: "Hover each track. Same 900ms duration, same distance — only the curve changes how the motion feels.",
    },

    { kind: "heading", text: "Transitioning discrete properties" },
    {
      kind: "paragraph",
      text: "Properties like display and visibility don't have intermediate values — an element is either display: none or it isn't, there's nothing to interpolate. transition-behavior: allow-discrete lets a browser still transition them, by flipping the value at the very end of the transition instead of the start, combined with @starting-style to define what the 'before' state was for a value that has no natural starting frame (an element that was just display: none has no prior opacity to ease from).",
    },
    {
      kind: "code",
      language: "css",
      code: ".tooltip {\n  display: none;\n  opacity: 0;\n  transition: opacity 180ms ease-out, display 180ms allow-discrete;\n}\n@starting-style {\n  .wrap:hover .tooltip { opacity: 0; }\n}\n.wrap:hover .tooltip {\n  display: block;\n  opacity: 1;\n}",
      tailwind: '<div class="hidden opacity-0 transition-[display,opacity] duration-180 ease-out transition-discrete starting:opacity-0 group-hover:block group-hover:opacity-100">',
      caption: "transition-discrete maps to transition-behavior: allow-discrete; starting: maps to @starting-style. Both landed in Tailwind v4.1 — check the caniuse embed below before relying on the underlying CSS in production.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "display: none → block, fading in on hover",
          html: discreteHtml,
        },
      ],
      height: 140,
      caption: "Hover the button. Without allow-discrete + @starting-style, the tooltip would just pop in the instant display switches from none to block — this makes it fade instead.",
    },

    { kind: "heading", text: "Applied across this site" },
    {
      kind: "paragraph",
      text: "This site itself leans on transition in two layers. A sitewide base rule in global.css puts every element's color-related properties on a 180ms ease-out transition by default — so the light/dark theme toggle, hover states, and active nav items all ease instead of snapping, without each component declaring its own transition.",
    },
    {
      kind: "code",
      language: "css",
      code: "@media (prefers-reduced-motion: no-preference) {\n  *, *::before, *::after {\n    transition-property: background-color, border-color, color, fill, stroke, box-shadow;\n    transition-duration: 180ms;\n    transition-timing-function: ease-out;\n  }\n}",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "The sitewide default (180ms, color properties only)",
          tailwind: '<div class="transition-colors duration-180 ease-out hover:bg-neutral-900">',
          html: sitewideColorRuleHtml,
        },
      ],
      height: 160,
      caption: "Hover the card. Layout and transform are deliberately left out of the sitewide rule (only color-ish properties are listed) so it can never fight a component's own layout animation.",
    },
    {
      kind: "paragraph",
      text: "Individual components override that default with their own faster transition-colors duration-150 utility wherever a hover response needs to feel more immediate than the 180ms baseline — nav links, the footer's back-to-top link, and buttons all use it.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Per-component override (150ms)",
          code: ".link {\n  transition: color 150ms ease-out, border-color 150ms ease-out;\n}\n.link:hover { color: #0060df; border-color: #0060df; }",
          tailwind: '<a class="transition-colors duration-150 hover:text-fg">',
          html: navLinkHtml,
        },
      ],
      height: 100,
      caption: "Hover the link. Because Tailwind's utility layer loads after the base layer, any element with its own transition-colors utility wins over the sitewide 180ms rule.",
    },
    {
      kind: "callout",
      variant: "note",
      text: "The sitewide rule is also wrapped in @media (prefers-reduced-motion: no-preference) — readers who've asked their OS for reduced motion get instant, un-eased state changes everywhere on the site, not just on the handful of components that remembered to check.",
    },

    { kind: "heading", text: "Things to watch for" },
    {
      kind: "list",
      items: [
        "transition-property: all animates every animatable property that changes, including layout ones like width and padding — usually more than you meant, and more expensive to composite. List the exact properties you want instead.",
        "There's nothing to transition on the very first paint: a transition only fires when a property changes value while the element already exists in a rendered state, not when the page first loads with that value already set.",
        "You can't reliably transition to/from auto (e.g. height: auto) — the browser doesn't have a numeric start or end value to interpolate. Animate a fixed value, max-height with headroom, or use the Grid track trick (grid-template-rows: 0fr → 1fr) instead.",
        "transition and animation solve different problems: transition eases between two states triggered by something else (hover, class change); animation runs a self-contained, potentially looping sequence via @keyframes with no trigger needed.",
        "Respect prefers-reduced-motion — wrap non-essential transitions (or at least layout/transform ones) in @media (prefers-reduced-motion: no-preference) the way this site's global rule does.",
      ],
    },

    { kind: "heading", text: "Using it with Tailwind" },
    {
      kind: "callout",
      variant: "tip",
      text: "Does Tailwind support transitions? Yes, natively — unlike contrast-color() or scroll-driven animations, transition-property, transition-duration, transition-timing-function, and transition-delay all have first-class Tailwind utilities. No arbitrary-value escape hatch needed for the everyday cases.",
    },
    {
      kind: "table",
      headers: ["CSS", "Tailwind"],
      rows: [
        ["transition-property: color, background-color, border-color, ...", "transition-colors"],
        ["transition-property: transform", "transition-transform"],
        ["transition-property: opacity", "transition-opacity"],
        ["transition-property: box-shadow", "transition-shadow"],
        ["transition-property: all", "transition (bare) or transition-all"],
        ["transition-property: <custom list>", "transition-[color,transform] (arbitrary value)"],
        ["transition-duration: <n>ms", "duration-<n> (e.g. duration-150), or duration-[<n>ms] for anything unusual"],
        ["transition-timing-function: ease-out / linear / ...", "ease-out, ease-in, ease-in-out, ease-linear, or ease-[cubic-bezier(...)] for a custom curve"],
        ["transition-delay: <n>ms", "delay-<n>, or delay-[<n>ms]"],
      ],
    },
    {
      kind: "code",
      language: "html",
      code: '<button class="transition-colors duration-200 ease-out hover:bg-blue-600">\n  Save\n</button>',
      caption: "The everyday case: one property family (colors), a duration, an easing curve, all as named utilities — no arbitrary-value brackets needed.",
    },
    {
      kind: "paragraph",
      text: "Two newer pieces — transitioning discrete properties and @starting-style — are also yes, natively supported: both shipped as first-class Tailwind v4.1 features rather than staying arbitrary-value-only.",
    },
    {
      kind: "list",
      items: [
        "transition-discrete sets transition-behavior: allow-discrete.",
        "The starting: variant wraps a utility in @starting-style — e.g. starting:opacity-0 is the Tailwind equivalent of the @starting-style { opacity: 0; } block used in the demo above.",
        "A property list that mixes a discrete property (display) with a continuous one (opacity) still needs the arbitrary-value form for transition-property, since there's no named utility that bundles an arbitrary property pair — transition-[display,opacity].",
      ],
    },
    {
      kind: "callout",
      variant: "note",
      text: "Tailwind support isn't the constraint for any of this — the underlying CSS is. transition-property/duration/timing-function/delay are supported everywhere that matters; transition-behavior: allow-discrete and @starting-style are newer, so check the last two Can I use tables below before relying on the fade-in-from-display-none pattern in production.",
    },

    { kind: "heading", text: "Can I use" },
    {
      kind: "caniuse",
      feature: "css-transitions",
      title: "CSS Transitions",
      caption: "The core transition/transition-* properties — supported everywhere that matters today.",
    },
    {
      kind: "caniuse",
      feature: "mdn-css_properties_transition-behavior",
      title: "transition-behavior",
      caption: "Needed for the allow-discrete keyword used in the display: none → block demo above.",
    },
    {
      kind: "caniuse",
      feature: "mdn-css_at-rules_starting-style",
      title: "@starting-style",
      caption: "Defines the 'before' state for a value with no natural starting frame — paired with allow-discrete above.",
    },
  ],
};
