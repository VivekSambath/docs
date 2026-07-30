import type { DocArticle } from "../articles";

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
      text: "Early mobile sites often bound taps to `touchstart` instead of `click` to feel instant — a workaround that created a bug **invisible to whoever wrote it**, but very visible to users who hold their phone the other way. The underlying bug is largely gone today, but ==the same event-choice and touch-target mistakes still land unevenly in the wild==.",
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
      text: "A common pattern in early responsive sites: bind a hamburger menu's tap handler to touchstart instead of click, to feel instant. The problem is timing — touchstart fires the instant a finger touches the glass, before the browser knows if this is a tap, a scroll, or a swipe. If that toggle sits where a thumb naturally lands at the start of a scroll, it pops open mid-scroll, seemingly at random.",
    },
    {
      kind: "callout",
      variant: "warning",
      text: "This is the core of the bug: `touchstart` tells you ==where a touch began, not what the user meant to do==. Treating \"finger touched down here\" as equivalent to \"user chose to activate this\" is the mistake.",
    },
    {
      kind: "paragraph",
      text: "You can feel the difference yourself with a mouse below: hold the button down, drag off, and release outside it — nothing happens, because :active (like click) waits for a completed press-and-release over the same element. That's the guarantee touchstart doesn't give you.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: ":hover only",
          status: "bad",
          editable: true,
          htmlSource: `<button class="btn">Delete</button>`,
          cssSource: `.btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #171717;
  background: #fff;
  color: #171717;
  font: 14px system-ui, sans-serif;
  cursor: pointer;
}

.btn:hover {
  background: #f5f5f5;
}`,
          tailwind: `<button class="rounded-lg border border-neutral-900 bg-white px-4 py-2.5 hover:bg-neutral-100">Delete</button>`,
        },
        {
          label: ":hover + :active",
          status: "good",
          editable: true,
          htmlSource: `<button class="btn">Delete</button>`,
          cssSource: `.btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #171717;
  background: #fff;
  color: #171717;
  font: 14px system-ui, sans-serif;
  cursor: pointer;
  transition: background-color 120ms ease-out, transform 120ms ease-out;
}

.btn:hover {
  background: #f5f5f5;
}

.btn:active {
  background: #171717;
  color: #fff;
  transform: scale(0.96);
}`,
          tailwind: `<button class="rounded-lg border border-neutral-900 bg-white px-4 py-2.5 transition-colors hover:bg-neutral-100 active:scale-[0.96] active:bg-neutral-900 active:text-white">Delete</button>`,
        },
      ],
      height: 140,
      caption:
        "Press and hold either button, then drag your pointer off before releasing — the left button never shows a \"pressed\" state at all, since it only styles :hover. The right button's :active state is the same signal a click handler waits for: press-and-release over the same element, not just contact.",
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
          editable: true,
          htmlSource: `<div class="phone">
  <div class="label">Left-handed grip</div>
  <div class="corner" style="right: 10px;">hard to reach</div>
  <div class="glow" style="background: radial-gradient(circle at bottom left, rgba(23,23,23,0.35), rgba(23,23,23,0.08) 60%, transparent 75%);"></div>
  <div class="dot" style="left: 16px; bottom: 8px;"></div>
</div>`,
          cssSource: `.phone {
  position: relative;
  width: 140px;
  height: 260px;
  margin: 0 auto;
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

.glow {
  position: absolute;
  inset: 0;
}

.dot {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #171717;
  transform: translate(-50%, 50%);
}`,
          onSource: {
            htmlSource: `<div class="phone">
  <div class="label">Right-handed grip</div>
  <div class="corner" style="left: 10px;">hard to reach</div>
  <div class="glow" style="background: radial-gradient(circle at bottom right, rgba(23,23,23,0.35), rgba(23,23,23,0.08) 60%, transparent 75%);"></div>
  <div class="dot" style="right: 16px; bottom: 8px;"></div>
</div>`,
            cssSource: `.phone {
  position: relative;
  width: 140px;
  height: 260px;
  margin: 0 auto;
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

.glow {
  position: absolute;
  inset: 0;
}

.dot {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #171717;
  transform: translate(-50%, 50%);
}`,
          },
        },
      ],
      height: 300,
      caption:
        "Same phone, same UI — only the grip changes. Anything placed in the glowing corner sits in the natural zone for one grip and the hard-to-reach zone for the other. Edit the dot's left/right offset or the glow's radial-gradient position to see how the \"natural zone\" shifts.",
    },

    { kind: "heading", text: "touchstart vs click — the old 300ms delay" },
    {
      kind: "paragraph",
      text: "There was a real reason for it: older mobile browsers waited ~300ms after a tap before firing click, to see if a second tap was coming (double-tap to zoom). That delay made click feel laggy, so touchstart traded correctness for perceived speed.",
    },

    { kind: "heading", text: "Why Modern Browsers Don't Need That Trick" },
    {
      kind: "paragraph",
      text: "Modern browsers drop that 300ms delay by default once a page declares <meta name=\"viewport\" content=\"width=device-width\">, and the CSS touch-action property removes the remaining ambiguity: auto leaves double-tap-to-zoom on the table, while manipulation opts an element out, so taps resolve immediately.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "touch-action: auto",
          status: "bad",
          editable: true,
          htmlSource: `<button class="btn">Double-tap me</button>`,
          cssSource: `.btn {
  touch-action: auto;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #171717;
  background: #fff;
  color: #171717;
  font: 14px system-ui, sans-serif;
  cursor: pointer;
}

.btn:active {
  background: #171717;
  color: #fff;
}`,
          tailwind: `<button class="touch-auto rounded-lg border border-neutral-900 bg-white px-4 py-2.5 active:bg-neutral-900 active:text-white">Double-tap me</button>`,
        },
        {
          label: "touch-action: manipulation",
          status: "good",
          editable: true,
          htmlSource: `<button class="btn">Double-tap me</button>`,
          cssSource: `.btn {
  touch-action: manipulation;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #171717;
  background: #fff;
  color: #171717;
  font: 14px system-ui, sans-serif;
  cursor: pointer;
}

.btn:active {
  background: #171717;
  color: #fff;
}`,
          tailwind: `<button class="touch-manipulation rounded-lg border border-neutral-900 bg-white px-4 py-2.5 active:bg-neutral-900 active:text-white">Double-tap me</button>`,
        },
      ],
      height: 100,
      caption:
        "On a touchscreen, double-tapping the left button can trigger a zoom gesture since the browser still treats double-tap-to-zoom as on the table. manipulation on the right button opts that element out, leaving only panning and pinch-zoom — taps resolve immediately with no ambiguity to wait out.",
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
      text: "Reach for `click` as your default for anything that behaves like a button or a link. It's accessible, it fires uniformly for mouse, touch, and keyboard activation, and ==it only fires once the interaction has actually completed==.",
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
        "Test one-handed, with both hands, and with the opposite hand from your own habitual grip — that's when thumb-reach ergonomics matter most.",
        "Use remote debugging (e.g. chrome://inspect on a physical device) to inspect the real timing and order of touch events, not assumed behavior.",
        "Test with fast swipes that start directly on top of interactive elements — that's exactly the scenario the classic bug depends on.",
      ],
    },

    { kind: "heading", text: "Accessibility Considerations" },
    {
      kind: "paragraph",
      text: "Touch targets should be **at least ~44x44 CSS pixels** (WCAG guidance) — fine for a mouse cursor can still be too small for a thumb. Elements also need to stay reachable by keyboard, not just touch, and focus outlines should stay visible for keyboard users.",
    },
    {
      kind: "callout",
      variant: "note",
      text: "The ~44x44px touch-target guidance isn't an arbitrary number — it approximates the average size of a fingertip's contact area, and it shows up (with minor variations) across WCAG, Apple's Human Interface Guidelines, and Google's Material Design guidance alike.",
    },
    {
      kind: "paragraph",
      text: "In isolation, it's just two CSS declarations — edit the values below and watch the hit area change.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "The rule in isolation",
          editable: true,
          htmlSource: `<button class="target">+</button>`,
          cssSource: `.target {
  min-width: 44px;
  min-height: 44px;
  border-radius: 8px;
  border: 1px solid #171717;
  background: #fff;
  font-size: 18px;
  cursor: pointer;
}`,
          tailwind: `<button class="min-h-11 min-w-11 rounded-lg border border-neutral-900 bg-white text-lg">+</button>`,
        },
      ],
      height: 110,
      caption:
        "Just the two declarations that matter — min-width and min-height at 44px, WCAG's minimum recommended touch-target size. Try dropping both to 24px to feel how much smaller the hit area gets.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "26×26px",
          status: "bad",
          editable: true,
          htmlSource: `<button class="target" aria-label="Delete">×</button>
<span class="hint">26×26px — try tapping it</span>`,
          cssSource: `.target {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 1px solid #171717;
  background: #fff;
  color: #171717;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 120ms ease-out, transform 120ms ease-out;
}

.target:hover {
  background: #f5f5f5;
}

.target:active {
  background: #171717;
  color: #fff;
  transform: scale(0.94);
}

.hint {
  display: block;
  margin-top: 10px;
  font: 11px system-ui, sans-serif;
  color: #737373;
}`,
          tailwind: `<button aria-label="Delete" class="h-6.5 w-6.5 rounded-lg border border-neutral-900 bg-white text-base transition-colors active:scale-[0.94] active:bg-neutral-900 active:text-white hover:bg-neutral-100">×</button>`,
        },
        {
          label: "44×44px",
          status: "good",
          editable: true,
          htmlSource: `<button class="target" aria-label="Delete">×</button>
<span class="hint">44×44px — try tapping it</span>`,
          cssSource: `.target {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  border: 1px solid #171717;
  background: #fff;
  color: #171717;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 120ms ease-out, transform 120ms ease-out;
}

.target:hover {
  background: #f5f5f5;
}

.target:active {
  background: #171717;
  color: #fff;
  transform: scale(0.94);
}

.hint {
  display: block;
  margin-top: 10px;
  font: 11px system-ui, sans-serif;
  color: #737373;
}`,
          tailwind: `<button aria-label="Delete" class="h-11 w-11 rounded-lg border border-neutral-900 bg-white text-base transition-colors active:scale-[0.94] active:bg-neutral-900 active:text-white hover:bg-neutral-100">×</button>`,
        },
      ],
      height: 170,
      caption:
        "Click or tap either button — the hit area is the whole square, not just the × glyph. The smaller target is noticeably harder to land on with a thumb than a mouse cursor.",
    },

    { kind: "heading", text: "Thumb Zones" },
    {
      kind: "paragraph",
      text: "\"Thumb zone\" mapping is a simple model for one-handed use — three tiers, mirrored left-to-right by handedness:",
    },
    {
      kind: "list",
      items: [
        "A natural zone the thumb reaches without shifting grip.",
        "A stretch zone further out.",
        "A hard-to-reach zone, usually the far top corner.",
      ],
    },
    {
      kind: "paragraph",
      text: "Put primary actions in the natural zone, destructive ones further away.",
    },
    {
      kind: "ascii",
      art:
        "Three-tier reach model (either grip)\n\n  +----------------------------+\n  |  hard-to-reach               |\n  |  ................            |\n  |  :   stretch zone   :        |\n  |  :  ..............  :        |\n  |  :  :  natural   :  :        |\n  |  :  :   zone     :  :        |\n  |  :  ..............  :        |\n  |  ................    *       |\n  +----------------------------+",
      caption:
        "The same natural/stretch/hard-to-reach tiers apply regardless of handedness — only which corner is \"natural\" (marked *) flips left-to-right.",
    },

    { kind: "heading", text: "Accidental Touch Targets" },
    {
      kind: "paragraph",
      text: "Two risks compound here:",
    },
    {
      kind: "list",
      items: [
        "A target on a natural resting/scroll-start point invites the classic touchstart misfire.",
        "Targets placed too close together invite fat-finger mis-taps.",
      ],
    },
    {
      kind: "paragraph",
      text: "The fix for both is the same — adequate spacing, ~44px hit areas, and never binding an irreversible action to the earliest possible touch event.",
    },

    { kind: "heading", text: "Common Mistakes" },
    {
      kind: "list",
      items: [
        "Binding navigation or activation logic to touchstart instead of click, so it fires before user intent is known.",
        "Touch targets smaller than roughly 44x44px, or hardcoding touch-only handlers with no click/keyboard equivalent.",
        "Testing only with a right-handed, two-handed grip, and never trying the layout one-handed or with the opposite hand.",
        "Placing destructive actions (delete, remove, discard) inside the natural thumb zone where they're easy to trigger by accident.",
      ],
    },

    { kind: "heading", text: "Best Practices" },
    {
      kind: "list",
      items: [
        "Prefer click for simple tap-to-activate UI; reserve Pointer Events for genuine low-level gesture handling (drag-and-drop, drawing, custom swipes).",
        "Keep touch targets at least ~44x44px, with enough spacing between adjacent targets to avoid mis-taps.",
        "Test one-handed, with both hands, on a real device — not just an emulator with your own habitual grip.",
        "Keep primary, frequent actions in the natural thumb zone; keep destructive or rare actions further away or behind confirmation.",
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
        "touchstart fires the instant a finger touches down, before the browser knows whether the user meant to tap or scroll — binding navigation to it can misfire mid-scroll, and that risk isn't evenly distributed across handedness and grip.",
        "The old 300ms click delay (the original reason developers reached for touchstart) is gone by default on modern mobile browsers with a proper viewport meta tag.",
        "Default to click for ordinary tap-to-activate UI; reserve Pointer Events for low-level gesture control that genuinely needs one unified model across mouse, touch, and pen.",
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
