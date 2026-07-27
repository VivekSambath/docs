import type { DocArticle } from "../articles";

// --- Live demo HTML generators ----------------------------------------------
// Sandboxed iframes (sandbox="", no scripts) — hover/active/focus states and
// real inputs still work natively, so these stay genuinely interactive.

function phoneMockup(inner: string) {
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
  }
  .phone {
    position: relative;
    width: 140px;
    height: 260px;
    border-radius: 22px;
    border: 2px solid #171717;
    overflow: hidden;
    background: #fafafa;
  }
  .label {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    font-size: 10px;
    font-weight: 600;
    color: #737373;
    text-align: center;
  }
  .corner {
    position: absolute;
    top: 26px;
    font-size: 9px;
    color: #a3a3a3;
  }
  .dot {
    position: absolute;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #171717;
    transform: translate(-50%, 50%);
  }
</style>
</head>
<body>
  <div class="phone">${inner}</div>
</body>
</html>`;
}

const thumbZoneHtml = (on: boolean) => {
  const side = on ? "right" : "left";
  const cornerSide = on ? "left" : "right";
  const glow = `radial-gradient(circle at bottom ${side}, rgba(23,23,23,0.35), rgba(23,23,23,0.08) 60%, transparent 75%)`;
  return phoneMockup(`
    <div class="label">${on ? "Right-handed grip" : "Left-handed grip"}</div>
    <div class="corner" style="${cornerSide}: 10px;">hard to reach</div>
    <div style="position:absolute;inset:0;background:${glow};"></div>
    <div class="dot" style="${side}: 16px; bottom: 8px;"></div>
  `);
};

function touchTargetHtml(size: "small" | "large") {
  const px = size === "small" ? 26 : 44;
  return `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body {
    font: 11px/1.3 system-ui, sans-serif;
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }
  button {
    width: ${px}px;
    height: ${px}px;
    border-radius: 8px;
    border: 1px solid #171717;
    background: #fff;
    color: #171717;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 120ms ease-out, transform 120ms ease-out;
  }
  button:hover { background: #f5f5f5; }
  button:active { background: #171717; color: #fff; transform: scale(0.94); }
  span { color: #737373; }
</style>
</head>
<body>
  <button aria-label="Delete">×</button>
  <span>${px}×${px}px — try tapping it</span>
</body>
</html>`;
}

export const touchEvents: DocArticle = {
  kind: "doc",
  slug: "touch-events",
  title: "Touch Events & Left-Handed UX Bugs",
  excerpt:
    "How binding taps to touchstart instead of click created a real ergonomic bug that hit left- and right-handed users differently, and why Pointer Events make the whole problem mostly go away today.",
  date: "2026-07-21",
  category: "Frontend Best Practices",
  sections: [
    { kind: "heading", text: "Introduction" },
    {
      kind: "paragraph",
      text: "Early mobile sites often bound taps to touchstart instead of click to feel instant — a workaround that created a bug invisible to whoever wrote it, but very visible to users who hold their phone the other way. The underlying bug is largely gone today, but the same event-choice and touch-target mistakes still land unevenly in the wild.",
    },
    {
      kind: "mindmap",
      root: "Touch events",
      branches: [
        { label: "The bug", children: ["touchstart fires too early", "Misfires mid-scroll"] },
        { label: "Why it hid", children: ["Handedness shifts thumb reach", "Testers only used one grip"] },
        { label: "The fix", children: ["Prefer click", "Pointer Events for gestures"] },
        { label: "Ergonomics", children: ["44x44px touch targets", "Thumb zones"] },
      ],
      caption: "The whole article in one map — jump to any branch via the table of contents.",
    },

    { kind: "heading", text: "The Classic Touch-Event Bug" },
    {
      kind: "paragraph",
      text: "A common pattern in early responsive sites: bind a hamburger menu's tap handler to touchstart instead of click, to feel instant. The problem is timing — touchstart fires the instant a finger touches the glass, before the browser knows if this is a tap, a scroll, or a swipe. click only fires once the whole gesture completes.",
    },
    {
      kind: "paragraph",
      text: "If that menu toggle sits where a thumb naturally lands at the start of a scroll, it fires the moment the finger touches down — even though the user meant to scroll past it. The menu pops open mid-scroll, seemingly at random.",
    },
    {
      kind: "callout",
      variant: "warning",
      text: "This is the core of the bug: touchstart tells you where a touch began, not what the user meant to do. Treating \"finger touched down here\" as equivalent to \"user chose to activate this\" is the mistake, and it's an easy one to make when touchstart feels more \"instant\" than click.",
    },

    { kind: "heading", text: "Why Only Some Users Noticed" },
    {
      kind: "paragraph",
      text: "This bug didn't affect everyone equally. Left- and right-handed users arc their thumb differently, so the resting zone at the start of a scroll shifts by handedness, hand size, and grip. A team that only tested right-handed, one-handed could ship it invisibly, then see \"random\" complaints from everyone else.",
    },
    { kind: "heading", text: "Right-handed reach", level: 3 },
    {
      kind: "ascii",
      art:
        "Right-handed grip (phone held in right hand)\n\n  +----------------------------+\n  |  hard to reach              |\n  |                             |\n  |               . . .         |\n  |             .       .       |\n  |          . .           .    |\n  |        .   natural   .      |\n  |      .      zone    .       |\n  |    .                 .      |\n  |   .                  .      |\n  |  .                   *      |\n  +----------------------------+",
      caption:
        "* marks the natural thumb rest / scroll-start point for a right-handed grip. The top-left corner is the hardest to reach without shifting your grip.",
    },
    { kind: "heading", text: "Left-handed reach", level: 3 },
    {
      kind: "ascii",
      art:
        "Left-handed grip (phone held in left hand)\n\n  +----------------------------+\n  |              hard to reach  |\n  |                             |\n  |         . . .               |\n  |       .       .             |\n  |    .           . .          |\n  |      .   natural   .        |\n  |       .    zone      .      |\n  |      .                 .    |\n  |      .                  .   |\n  |      *                  .   |\n  +----------------------------+",
      caption:
        "The zone mirrors left-to-right for a left-handed grip. An element placed in the right-handed \"natural zone\" sits in the left-handed user's stretch or hard-to-reach zone instead — exactly where a misfiring touchstart bug is most likely to hide from a right-handed tester.",
    },
    {
      kind: "demo",
      toggle: { label: "Switch grip", defaultOn: true },
      panes: [
        {
          label: "Thumb-zone heat map",
          html: thumbZoneHtml,
        },
      ],
      height: 300,
      caption:
        "Same phone, same UI — only the grip changes. Anything placed in the glowing corner sits in the natural zone for one grip and the hard-to-reach zone for the other.",
    },

    { kind: "heading", text: "touchstart vs click — the old 300ms delay" },
    {
      kind: "paragraph",
      text: "There was a real reason for it: older mobile browsers waited ~300ms after a tap before firing click, to see if a second tap was coming (double-tap to zoom). That delay made click feel laggy, so touchstart traded correctness for perceived speed.",
    },

    { kind: "heading", text: "Why Modern Browsers Don't Need That Trick" },
    {
      kind: "paragraph",
      text: "Modern browsers drop that 300ms delay by default once a page declares <meta name=\"viewport\" content=\"width=device-width\">, and the CSS touch-action property lets a page tell the browser exactly which gestures to handle, removing the guesswork entirely. click now fires quickly everywhere — the original reason for touchstart is gone, even though the pattern still lingers in old code.",
    },

    { kind: "heading", text: "Pointer Events" },
    {
      kind: "paragraph",
      text: "The Pointer Events API (pointerdown, pointerup, pointermove) unifies mouse, touch, and pen behind one set of events — one handler instead of separate touch and mouse listeners. It also carries extra data mouse events never had: pointerType, pressure, and contact size.",
    },

    { kind: "heading", text: "click vs pointerup vs touchstart — decision guidance" },
    {
      kind: "table",
      headers: ["Event", "Fires when", "Use it for", "Watch out for"],
      rows: [
        [
          "click",
          "After a complete tap, mouse click, or keyboard activation (Enter/Space on a focused control)",
          "Buttons, links, menu toggles — almost all simple tap-to-activate UI",
          "Nothing major on modern browsers; historically a ~300ms delay on old mobile browsers",
        ],
        [
          "pointerdown / pointerup",
          "The instant a pointer (touch, mouse, or pen) presses or releases, unified across input types",
          "Drag-and-drop, custom gestures, drawing, sliders — low-level interaction control",
          "You own more of the interaction logic yourself; easy to miss keyboard/accessibility handling",
        ],
        [
          "touchstart",
          "The instant a finger touches the screen, before the browser knows if this is a tap or a scroll/swipe",
          "Rarely — only when you need the earliest possible signal for non-committal feedback (e.g. a visual press state)",
          "Fires before user intent is known; binding navigation or actions here can misfire during scrolling",
        ],
      ],
    },
    {
      kind: "callout",
      variant: "tip",
      text: "Reach for click as your default for anything that behaves like a button or a link. It's accessible, it fires uniformly for mouse, touch, and keyboard activation, and it only fires once the interaction has actually completed.",
    },

    { kind: "heading", text: "Vanilla JavaScript example" },
    {
      kind: "code",
      language: "js",
      label: "Bad",
      code:
        "// Fires the instant a finger touches down —\n// before the browser knows this isn't a scroll.\nmenuButton.addEventListener(\"touchstart\", (e) => {\n  e.preventDefault();\n  toggleMenu();\n});",
    },
    {
      kind: "code",
      language: "js",
      label: "Good",
      code:
        "// Fires only once a full tap/click has completed,\n// for touch, mouse, and keyboard activation alike.\nmenuButton.addEventListener(\"click\", () => {\n  toggleMenu();\n});",
    },

    { kind: "heading", text: "React example" },
    {
      kind: "paragraph",
      text: "The same mistake shows up in React apps as a handler wired to onTouchStart instead of onClick. React's onClick is a synthetic event that already normalizes mouse, touch, and keyboard activation for you, so there's rarely a good reason to reach for a touch-specific handler on a plain button.",
    },
    {
      kind: "code",
      language: "jsx",
      label: "Bad",
      code:
        "function MenuButton({ onToggle }) {\n  return (\n    <button onTouchStart={onToggle}>\n      Menu\n    </button>\n  );\n}",
    },
    {
      kind: "code",
      language: "jsx",
      label: "Good",
      code:
        "function MenuButton({ onToggle }) {\n  return (\n    <button onClick={onToggle}>\n      Menu\n    </button>\n  );\n}",
    },

    { kind: "heading", text: "Mobile Testing Strategies" },
    {
      kind: "list",
      items: [
        "Test on a real device, not just a devices-toolbar emulator — emulated touch events don't always behave like real touchscreen input.",
        "Test with the device held in both hands and in both portrait and landscape orientation, not just however you personally hold your own phone.",
        "Specifically test one-handed use, since that's when thumb-reach ergonomics matter most.",
        "Use remote debugging (e.g. chrome://inspect connected to a physical device) to inspect the real timing and order of touch events, not assumed behavior.",
        "Test with slow, deliberate taps and with fast swipes that start directly on top of interactive elements — that's exactly the scenario the classic bug depends on.",
      ],
    },

    { kind: "heading", text: "Accessibility Considerations" },
    {
      kind: "paragraph",
      text: "Touch targets should be at least ~44x44 CSS pixels (WCAG guidance) — fine for a mouse cursor can still be too small for a thumb. Elements also need to stay reachable by keyboard, not just touch, and focus outlines should stay visible for keyboard users.",
    },
    {
      kind: "callout",
      variant: "note",
      text: "The ~44x44px touch-target guidance isn't an arbitrary number — it approximates the average size of a fingertip's contact area, and it shows up (with minor variations) across WCAG, Apple's Human Interface Guidelines, and Google's Material Design guidance alike.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "26×26px",
          status: "bad",
          html: () => touchTargetHtml("small"),
        },
        {
          label: "44×44px",
          status: "good",
          html: () => touchTargetHtml("large"),
        },
      ],
      height: 160,
      caption:
        "Click or tap either button — the hit area is the whole square, not just the × glyph. The smaller target is noticeably harder to land on with a thumb than a mouse cursor.",
    },

    { kind: "heading", text: "Thumb Zones" },
    {
      kind: "paragraph",
      text: "\"Thumb zone\" mapping is a simple model for one-handed use: a natural zone the thumb reaches without shifting grip, a stretch zone further out, and a hard-to-reach zone (usually the far top corner). It mirrors left-to-right by handedness — so put primary actions in the natural zone, and destructive ones further away or behind a confirmation.",
    },

    { kind: "heading", text: "Accidental Touch Targets" },
    {
      kind: "paragraph",
      text: "Two risks compound here: a target sitting on a natural resting/scroll-start point invites the classic touchstart misfire, and targets placed too close together invite plain fat-finger mis-taps. The fix for both: adequate spacing, ~44px hit areas, and never bind an irreversible action to the earliest possible touch event.",
    },

    { kind: "heading", text: "Common Mistakes" },
    {
      kind: "list",
      items: [
        "Binding navigation or activation logic to touchstart instead of click, so it fires before user intent is known.",
        "Touch targets smaller than roughly 44x44px, especially icon-only buttons.",
        "Hardcoding touch-only handlers (onTouchStart, touchstart) with no click or keyboard equivalent, locking out mouse and assistive-tech users.",
        "Testing only with a right-handed, two-handed grip, and never trying the layout one-handed or with the opposite hand.",
        "Placing destructive actions (delete, remove, discard) inside the natural thumb zone where they're easy to trigger by accident.",
        "Assuming the old 300ms tap delay still exists and over-engineering around it on browsers where it's long gone.",
      ],
    },

    { kind: "heading", text: "Best Practices" },
    {
      kind: "list",
      items: [
        "Prefer click for simple tap-to-activate UI — it's accessible and waits for the interaction to actually complete.",
        "Reserve Pointer Events for genuine low-level gesture handling: drag-and-drop, drawing, custom swipes.",
        "Keep touch targets at least ~44x44px, with enough spacing between adjacent targets to avoid mis-taps.",
        "Test one-handed, with both hands, on a real device — not just an emulator with your own habitual grip.",
        "Keep primary, frequent actions in the natural thumb zone; keep destructive or rare actions further away or behind confirmation.",
        "Don't assume the 300ms tap delay still exists — verify current behavior instead of carrying forward old workarounds.",
      ],
    },

    { kind: "heading", text: "Browser Support" },
    {
      kind: "paragraph",
      text: "Pointer Events are supported in all current evergreen browsers — Chrome, Edge, and Firefox for a long time, Safari more recently but solidly as of 2026. The old 300ms tap delay is gone by default everywhere with a proper viewport meta tag, so there's no need to special-case it.",
    },

    { kind: "heading", text: "Key Takeaways" },
    {
      kind: "list",
      items: [
        "touchstart fires the instant a finger touches down, before the browser knows whether the user meant to tap or scroll — binding navigation to it can misfire mid-scroll.",
        "That misfire risk isn't evenly distributed: thumb-reach ergonomics differ by handedness, hand size, and grip, so the bug hits some users far more than others.",
        "The old 300ms click delay (the original reason developers reached for touchstart) is gone by default on modern mobile browsers with a proper viewport meta tag.",
        "Pointer Events (pointerdown/pointerup) give you one unified event model across mouse, touch, and pen, for the cases that genuinely need low-level input control.",
        "Default to click for ordinary tap-to-activate UI; it's accessible and only fires once the interaction is complete.",
        "Keep touch targets at least ~44x44px, keep primary actions in the natural thumb zone, and keep destructive actions further away.",
      ],
    },

    { kind: "heading", text: "Can I use" },
    {
      kind: "caniuse",
      feature: "pointer",
      title: "Pointer Events",
    },
    {
      kind: "caniuse",
      feature: "css-touch-action",
      title: "touch-action",
    },
  ],
};
