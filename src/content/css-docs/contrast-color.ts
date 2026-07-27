import type { CssDoc } from "../cssDocs";

// --- Live demo HTML generators ----------------------------------------------
// Sandboxed iframes (sandbox="", no scripts) — everything here is real CSS.

const TOGGLE_COLORS = { on: "#eab308", off: "#1e3a8a" } as const;

const autoContrastHtml = (on: boolean) => {
  const hex = on ? TOGGLE_COLORS.on : TOGGLE_COLORS.off;
  const name = on ? "gold" : "navy";
  return `<!doctype html>
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
    width: 220px;
    padding: 22px;
    border-radius: 10px;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    background: ${hex};
    color: #fff;
    color: contrast-color(${hex});
  }
  .swatch span {
    display: block;
    margin-top: 6px;
    font-weight: 400;
    font-size: 11px;
    opacity: .85;
    font-family: ui-monospace, monospace;
  }
</style>
</head>
<body>
  <div class="swatch">
    color: contrast-color(${hex})
    <span>background: ${hex} (${name})</span>
  </div>
</body>
</html>`;
};

// A saturated, bright royal blue — deliberately kept as-is because it's the
// rare case worth showing: pure white against it only just clears 4.5:1
// (~4.52:1), which leaves almost no luminance headroom. Any off-white tint,
// even one that "looks fine" and feels calmer next to the blue, drops below
// the minimum — #fdf6e3 measures ~4.19:1 here and fails AA outright. That's
// the point: contrast-color()'s flat-looking pure-white answer isn't being
// overly conservative, it's the *only* value that actually passes.
const MID_TONE = "#2277d3";

function midToneHtml(chosen: "auto" | "manual") {
  const color = chosen === "auto" ? `contrast-color(${MID_TONE})` : "#fdf6e3";
  const verdict = chosen === "auto" ? "Passes WCAG AA (4.52:1)" : "Fails WCAG AA (4.19:1)";
  const note =
    chosen === "auto"
      ? "contrast-color() picked pure white — it's the only color with enough luminance to clear 4.5:1 against this particular blue."
      : "Chosen by hand because it looked calmer next to the blue — but it's measurably darker than white, and that's enough to drop it under the 4.5:1 minimum.";
  return `<!doctype html>
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
    padding: 12px;
  }
  .swatch {
    width: 100%;
    max-width: 220px;
    padding: 20px;
    border-radius: 10px;
    background: ${MID_TONE};
    color: ${color};
    text-align: center;
  }
  .swatch strong { display: block; font-size: 14px; margin-bottom: 6px; }
  .swatch span { display: block; font-size: 11px; opacity: .9; }
</style>
</head>
<body>
  <div class="swatch">
    <strong>${verdict}</strong>
    <span>${note}</span>
  </div>
</body>
</html>`;
}

const ACCENT = { light: "#0060df", dark: "#75bfff" } as const;

const accentHtml = (on: boolean) => {
  const hex = on ? ACCENT.light : ACCENT.dark;
  const themeName = on ? "light-mode accent" : "dark-mode accent";
  return `<!doctype html>
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
  .btn {
    padding: 12px 22px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    font-size: 13px;
    background: var(--accent);
    color: white;
    color: contrast-color(var(--accent));
  }
  .btn span { display: block; margin-top: 4px; font-weight: 400; font-size: 10px; opacity: .85; font-family: ui-monospace, monospace; }
  :root { --accent: ${hex}; }
</style>
</head>
<body>
  <div class="btn">
    Call to action
    <span>--accent: ${hex} (${themeName})</span>
  </div>
</body>
</html>`;
};

const SWATCHES = ["#eab308", "#1e3a8a", "#f97316", "#f5f5f5", "#111111"];

function swatchesHtml(mode: "fixed" | "auto") {
  const items = SWATCHES.map((hex) => {
    const color = mode === "fixed" ? "#fff" : `#fff; color: contrast-color(${hex})`;
    return `<div class="swatch" style="background:${hex};color:${color}"><span>${hex}</span></div>`;
  }).join("");
  return `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body { font: 12px/1.3 system-ui, sans-serif; background: #fff; padding: 14px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(88px, 1fr)); gap: 10px; }
  .swatch { border-radius: 8px; padding: 16px 8px; text-align: center; font-weight: 600; }
  .swatch span { display: block; margin-top: 4px; font-weight: 400; font-size: 10px; font-family: ui-monospace, monospace; opacity: .9; }
</style>
</head>
<body>
  <div class="grid">${items}</div>
</body>
</html>`;
}

// --- Inverted direction: derive background from a fixed color --------------
// Same function, swapped roles — useful when the text color is the value you
// don't control (a CMS brand color, a user's chosen tag color) and the
// background is what needs to stay readable against it.

const invertedContrastHtml = (on: boolean) => {
  const hex = on ? TOGGLE_COLORS.on : TOGGLE_COLORS.off;
  const name = on ? "gold" : "navy";
  return `<!doctype html>
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
    width: 220px;
    padding: 22px;
    border-radius: 10px;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    color: ${hex};
    background: #fff;
    background: contrast-color(${hex});
  }
  .swatch span {
    display: block;
    margin-top: 6px;
    font-weight: 400;
    font-size: 11px;
    opacity: .85;
    font-family: ui-monospace, monospace;
  }
</style>
</head>
<body>
  <div class="swatch">
    background: contrast-color(${hex})
    <span>color: ${hex} (${name})</span>
  </div>
</body>
</html>`;
};

function invertedSwatchesHtml(mode: "fixed" | "auto") {
  const items = SWATCHES.map((hex) => {
    const bg = mode === "fixed" ? "#fff" : `#fff; background: contrast-color(${hex})`;
    return `<div class="swatch" style="color:${hex};background:${bg}"><span>${hex}</span></div>`;
  }).join("");
  return `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body { font: 12px/1.3 system-ui, sans-serif; background: #fff; padding: 14px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(88px, 1fr)); gap: 10px; }
  .swatch { border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px 8px; text-align: center; font-weight: 600; }
  .swatch span { display: block; margin-top: 4px; font-weight: 400; font-size: 10px; font-family: ui-monospace, monospace; opacity: .9; }
</style>
</head>
<body>
  <div class="grid">${items}</div>
</body>
</html>`;
}

export const contrastColorDoc: CssDoc = {
  slug: "contrast-color",
  title: "contrast-color()",
  category: "CSS color function",
  excerpt:
    "A CSS color function that picks black or white for you, whichever contrasts better against a given color — no JavaScript, no manual palette pairing.",
  sections: [
    { kind: "heading", text: "What it does" },
    {
      kind: "paragraph",
      text: "contrast-color() takes a color and returns whichever of black or white has the higher contrast against it, based on the WCAG contrast ratio. It's designed for exactly one job: choosing a readable foreground color for a background you don't control ahead of time — a user-picked brand color, a tag color loaded from a CMS, an avatar background generated from a username.",
    },
    {
      kind: "code",
      language: "css",
      code: "color: contrast-color(<color>);\n\n/* example */\n.tag {\n  background-color: var(--tag-color);\n  color: contrast-color(var(--tag-color));\n}",
    },
    {
      kind: "callout",
      variant: "note",
      text: "It only ever returns black or white — never a tinted color. If you need a brand-aware alternative (e.g. a dark navy instead of pure black), pick it yourself with color-contrast logic in your design system instead.",
    },

    { kind: "heading", text: "See it in action" },
    {
      kind: "paragraph",
      text: "Toggle the background below — the text color isn't set explicitly for either state, contrast-color() recalculates it automatically each time.",
    },
    {
      kind: "demo",
      toggle: { label: "Switch background color", defaultOn: true },
      panes: [
        {
          label: "color: contrast-color(background)",
          code: ".swatch {\n  background: var(--bg);\n  color: contrast-color(var(--bg));\n}",
          html: autoContrastHtml,
        },
      ],
      height: 150,
      caption:
        "Gold gets black text, navy gets white text — same declaration, no media query or JavaScript involved.",
    },

    { kind: "heading", text: "Fixed color vs. contrast-color()" },
    {
      kind: "paragraph",
      text: "The problem contrast-color() solves: a single hard-coded text color inevitably fails on some background in the set. Compare the two panels across the same five swatches.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "color: white",
          status: "bad",
          code: ".swatch {\n  color: white;\n}",
          html: () => swatchesHtml("fixed"),
        },
        {
          label: "color: contrast-color(...)",
          status: "good",
          code: ".swatch {\n  color: contrast-color(var(--bg));\n}",
          html: () => swatchesHtml("auto"),
        },
      ],
      height: 200,
      caption:
        "Fixed white text disappears on the light-grey and gold swatches. contrast-color() flips to black on those two and stays white on the rest.",
    },

    { kind: "heading", text: "Inverting it: background from color" },
    {
      kind: "paragraph",
      text: "Everything above fixes the background and derives color. The relationship works just as well flipped: fix the color and derive background: contrast-color(...) from it. Useful when the color is the value you don't control — a CMS-supplied brand color, a user's chosen tag color — and it's the background that needs to stay readable against it.",
    },
    {
      kind: "code",
      language: "css",
      code: ".tag {\n  color: var(--tag-color);\n  background: contrast-color(var(--tag-color));\n}",
    },
    {
      kind: "demo",
      toggle: { label: "Switch text color", defaultOn: true },
      panes: [
        {
          label: "background: contrast-color(color)",
          code: ".swatch {\n  color: var(--fg);\n  background: contrast-color(var(--fg));\n}",
          html: invertedContrastHtml,
        },
      ],
      height: 150,
      caption:
        "Gold text gets a black background, navy text gets a white background — contrast-color() doesn't care which side of the pair it's computing, only that it's handed a <color>.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "background: white",
          status: "bad",
          code: ".swatch {\n  background: white;\n}",
          html: () => invertedSwatchesHtml("fixed"),
        },
        {
          label: "background: contrast-color(...)",
          status: "good",
          code: ".swatch {\n  background: contrast-color(var(--fg));\n}",
          html: () => invertedSwatchesHtml("auto"),
        },
      ],
      height: 200,
      caption:
        "A fixed white background is unreadable behind the light-grey and gold text. contrast-color() flips to black behind those two and stays white behind the rest — the same fix as before, just applied to the other property.",
    },

    { kind: "heading", text: "Fallback for unsupported browsers" },
    {
      kind: "paragraph",
      text: "Declare a plain color first, then contrast-color() right after it. Browsers that don't understand the function treat that line as an invalid value and ignore it, leaving the fallback in place; browsers that do support it apply the override, since the second (valid) declaration always wins over the first when both target the same property.",
    },
    {
      kind: "code",
      language: "css",
      code: ".tag {\n  background-color: var(--tag-color);\n  color: white; /* fallback if contrast-color() isn't supported */\n  color: contrast-color(var(--tag-color));\n}",
    },

    { kind: "heading", text: "Example: driving it from a theme variable" },
    {
      kind: "paragraph",
      text: "The same button, styled against this site's own --accent custom property, which already changes between light and dark mode (see ThemeToggle.tsx). Nothing about the button's own CSS changes — color: contrast-color(var(--accent)) just tracks whatever --accent currently resolves to.",
    },
    {
      kind: "demo",
      toggle: { label: "Swap --accent (light ↔ dark theme value)", defaultOn: true },
      panes: [
        {
          label: "background: var(--accent)",
          code: ":root {\n  --accent: var(--color-accent);\n}\n\n.btn {\n  background: var(--accent);\n  color: white;\n  color: contrast-color(var(--accent));\n}",
          html: accentHtml,
        },
      ],
      height: 140,
      caption:
        "This site's light-theme accent (#0060df) is dark enough for white text; its dark-theme accent (#75bfff) is light enough that contrast-color() flips to black — exactly the kind of value you don't want to hand-maintain two text colors for.",
    },
    {
      kind: "callout",
      variant: "tip",
      text: "If --accent is animated or transitioned (e.g. a hover state easing between two colors), the background will visibly interpolate frame by frame, but the contrast-color() text will not — it recomputes discretely and jumps straight from black to white the instant the background crosses the midpoint, since there's no such thing as a color \"between\" black and white for this function.",
    },

    { kind: "heading", text: "Things to watch for" },
    {
      kind: "list",
      items: [
        "It only chooses between pure black and white — for saturated, mid-tone backgrounds (a royal blue, a hot pink) the WCAG-computed winner can still read as a low-contrast, slightly-off choice; test with real content rather than trusting the ratio blindly.",
        "It's a color value, so it works anywhere a <color> is valid — border-color, box-shadow, fill, not just color.",
        "Combine with light-dark() for the two cases together: light-dark() handles the reader's OS theme, contrast-color() handles a background whose exact value you don't control (like a user-chosen accent).",
        "It recalculates live off whatever the background color resolves to, including CSS custom properties — animating or theming --bg is enough to keep text readable without extra rules.",
      ],
    },
    {
      kind: "demo",
      panes: [
        {
          label: "color: contrast-color(#2277d3)",
          status: "good",
          html: () => midToneHtml("auto"),
        },
        {
          label: "color: #fdf6e3 (picked by eye)",
          status: "bad",
          html: () => midToneHtml("manual"),
        },
      ],
      height: 150,
      caption:
        "The rare case: this blue is bright enough that white itself barely clears 4.5:1, leaving no headroom for any softer off-white — one that looks perfectly reasonable by eye fails AA outright here. On saturated mid-tone backgrounds like this, don't eyeball a substitute for contrast-color()'s pick; if you want one anyway, run it through a contrast checker first.",
    },
    {
      kind: "code",
      language: "css",
      caption: "Points 2 and 3 together: contrast-color() on a non-color property, alongside light-dark() handling the site's own theme.",
      code: ".avatar {\n  --user-color: var(--cms-accent); /* not under your control */\n  background: light-dark(#fff, #111); /* your own theme colors */\n  border-color: var(--user-color);\n  box-shadow: 0 0 0 2px contrast-color(var(--user-color));\n}",
    },

    { kind: "heading", text: "Can I use" },
    {
      kind: "caniuse",
      feature: "mdn-css_types_color_contrast-color",
      title: "contrast-color()",
      variant: "link",
      caption:
        "Reached Baseline in 2026. Older browser versions ignore the declaration entirely, which is why the fallback pattern above is worth using in production.",
    },
  ],
};
