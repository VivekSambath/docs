import type { DocArticle } from "../articles";

// --- Live demo HTML generators ----------------------------------------------
// Each demo is a self-contained mini "page" rendered inside a sandboxed
// iframe (srcDoc) — no scripts, just real CSS (including real :hover states
// where a rule is about interaction, e.g. the accent and motion rules).

function page(body: string, extraStyle = "") {
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
    padding: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100% - 36px);
    text-align: center;
  }
  ${extraStyle}
</style>
</head>
<body>${body}</body>
</html>`;
}

// Rule 1 — pure black/white vs near-black/near-white
const pureBlackHtml = () =>
  page(
    `<div style="width:100%;max-width:200px;background:#000;color:#fff;padding:22px;border-radius:8px;font-weight:600;">#000 on #fff</div>`,
  );
const nearBlackHtml = () =>
  page(
    `<div style="width:100%;max-width:200px;background:#0a0a0a;color:#fafafa;padding:22px;border-radius:8px;font-weight:600;">#0a0a0a on #fafafa</div>`,
    "body { background: #fafafa; }",
  );
const blackWhiteSeamHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;gap:8px;width:100%;max-width:220px;">
      <div style="display:flex;height:40px;border-radius:6px;overflow:hidden;">
        <div style="flex:1;background:#000;"></div>
        <div style="flex:1;background:#0a0a0a;"></div>
      </div>
      <p style="margin:0;font-size:10px;color:#737373;">#000 (left) vs #0a0a0a (right)</p>
      <div style="display:flex;height:40px;border-radius:6px;overflow:hidden;border:1px solid #e5e5e5;">
        <div style="flex:1;background:#fff;"></div>
        <div style="flex:1;background:#fafafa;"></div>
      </div>
      <p style="margin:0;font-size:10px;color:#737373;">#fff (left) vs #fafafa (right)</p>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; text-align: left; }",
  );

// Rule 2 — saturate your neutrals
const flatNeutralsHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
      <div style="display:flex;gap:10px;">
        <div style="width:48px;height:48px;border-radius:6px;background:#404040;"></div>
        <div style="width:48px;height:48px;border-radius:6px;background:#737373;"></div>
        <div style="width:48px;height:48px;border-radius:6px;background:#a3a3a3;"></div>
      </div>
      <p style="margin:0;font-size:11px;color:#a3a3a3;">Flat grays</p>
    </div>`,
  );
const saturatedNeutralsHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
      <div style="display:flex;gap:10px;">
        <div style="width:48px;height:48px;border-radius:6px;background:#3a4150;"></div>
        <div style="width:48px;height:48px;border-radius:6px;background:#6b7385;"></div>
        <div style="width:48px;height:48px;border-radius:6px;background:#a1a8b8;"></div>
      </div>
      <p style="margin:0;font-size:11px;color:#6b7385;">Grays + a touch of #0060df</p>
    </div>`,
  );

// Rule 3 — high contrast for important elements
const flatHierarchyHtml = () =>
  page(
    `<div style="text-align:left;">
      <p style="margin:0 0 6px;font-size:16px;font-weight:600;color:#737373;">Article title</p>
      <p style="margin:0;font-size:16px;font-weight:600;color:#737373;">Supporting subtitle text</p>
    </div>`,
  );
const contrastHierarchyHtml = () =>
  page(
    `<div style="text-align:left;">
      <p style="margin:0 0 6px;font-size:16px;font-weight:600;color:#0a0a0a;">Article title</p>
      <p style="margin:0;font-size:16px;font-weight:600;color:#a3a3a3;">Supporting subtitle text</p>
    </div>`,
  );

// Rule 4 — everything in your design should be deliberate
const chaosCardHtml = () =>
  page(
    `<div style="width:200px;background:#f3f3f3;border-radius:9px;padding:11px;text-align:left;">
      <p style="margin:0 0 3px;font-size:15px;font-weight:700;color:#333;">Update available</p>
      <p style="margin:0 0 14px;font-size:12px;color:#8a8a8a;padding-left:2px;">New version ready</p>
      <button style="font:600 11px system-ui, sans-serif;padding:7px 10px;border-radius:4px;border:none;background:#555;color:#fff;margin-left:3px;">Install</button>
    </div>`,
  );
const deliberateCardHtml = () =>
  page(
    `<div style="width:200px;background:#f5f5f5;border-radius:8px;padding:16px;text-align:left;">
      <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#0a0a0a;">Update available</p>
      <p style="margin:0 0 16px;font-size:12px;color:#737373;">New version ready</p>
      <button style="font:600 12px system-ui, sans-serif;padding:8px 16px;border-radius:6px;border:none;background:#0a0a0a;color:#fafafa;">Install</button>
    </div>`,
  );

// Rule 5 — optical vs mathematical alignment
const mathCenterHtml = () =>
  page(
    `<div style="position:relative;width:64px;height:64px;border-radius:50%;background:#0a0a0a;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(255,255,255,0.35);"></div>
      <div style="width:0;height:0;border-top:10px solid transparent;border-bottom:10px solid transparent;border-left:16px solid #fafafa;"></div>
    </div>`,
  );
const opticalCenterHtml = () =>
  page(
    `<div style="position:relative;width:64px;height:64px;border-radius:50%;background:#0a0a0a;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(255,255,255,0.35);"></div>
      <div style="width:0;height:0;border-top:10px solid transparent;border-bottom:10px solid transparent;border-left:16px solid #fafafa;transform:translateX(2px);"></div>
    </div>`,
  );

// Rule 6 — tighten large type, loosen small type
const trackingHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;gap:16px;width:100%;">
      <div>
        <p style="margin:0 0 4px;font-size:10px;font-weight:600;color:#737373;">Heading, letter-spacing: 0</p>
        <p style="margin:0;font-size:28px;font-weight:600;letter-spacing:0;">Design that lasts</p>
      </div>
      <div>
        <p style="margin:0 0 4px;font-size:10px;font-weight:600;color:#16a34a;">Heading, letter-spacing: -0.02em</p>
        <p style="margin:0;font-size:28px;font-weight:600;letter-spacing:-0.02em;">Design that lasts</p>
      </div>
      <div>
        <p style="margin:0 0 4px;font-size:10px;font-weight:600;color:#737373;">Label, letter-spacing: 0</p>
        <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0;">Section label</p>
      </div>
      <div>
        <p style="margin:0 0 4px;font-size:10px;font-weight:600;color:#16a34a;">Label, letter-spacing: 0.05em</p>
        <p style="margin:0;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Section label</p>
      </div>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; text-align: left; }",
  );

// Rule 7 — container borders should contrast with both container and background
const borderBlendHtml = () =>
  page(
    `<div style="width:180px;padding:20px;text-align:left;">
      <div style="background:#262626;border:1px solid #1f1f1f;border-radius:8px;padding:16px;font-size:12px;color:#a3a3a3;">Card content</div>
    </div>`,
    "body { background: #171717; }",
  );
const borderPopHtml = () =>
  page(
    `<div style="width:180px;padding:20px;text-align:left;">
      <div style="background:#262626;border:1px solid #404040;border-radius:8px;padding:16px;font-size:12px;color:#d4d4d4;">Card content</div>
    </div>`,
    "body { background: #171717; }",
  );

// Rule 8 — everything should be aligned with something else
const misalignedHtml = () =>
  page(
    `<div style="width:200px;">
      <p style="margin:0 0 8px 4px;font-size:15px;font-weight:600;color:#0a0a0a;">Heading</p>
      <p style="margin:0 0 12px 14px;font-size:12px;color:#737373;">Supporting line of text.</p>
      <button style="margin-left:8px;font:600 12px system-ui, sans-serif;padding:8px 14px;border-radius:6px;border:none;background:#0a0a0a;color:#fafafa;">Continue</button>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; text-align: left; }",
  );
const alignedHtml = () =>
  page(
    `<div style="width:200px;border-left:1px dashed #d4d4d4;">
      <p style="margin:0 0 8px;padding-left:10px;font-size:15px;font-weight:600;color:#0a0a0a;">Heading</p>
      <p style="margin:0 0 12px;padding-left:10px;font-size:12px;color:#737373;">Supporting line of text.</p>
      <button style="margin-left:10px;font:600 12px system-ui, sans-serif;padding:8px 14px;border-radius:6px;border:none;background:#0a0a0a;color:#fafafa;">Continue</button>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; text-align: left; }",
  );

// Rule 9 — distinct brightness values in a palette
const sameBrightnessHtml = () =>
  page(
    `<div style="display:flex;gap:10px;">
      <div style="width:48px;height:48px;border-radius:6px;background:hsl(0,55%,50%);"></div>
      <div style="width:48px;height:48px;border-radius:6px;background:hsl(140,55%,42%);"></div>
      <div style="width:48px;height:48px;border-radius:6px;background:hsl(220,65%,52%);"></div>
    </div>`,
  );
const distinctBrightnessHtml = () =>
  page(
    `<div style="display:flex;gap:10px;align-items:flex-end;">
      <div style="width:48px;height:48px;border-radius:6px;background:hsl(0,60%,72%);"></div>
      <div style="width:48px;height:48px;border-radius:6px;background:hsl(140,45%,45%);"></div>
      <div style="width:48px;height:48px;border-radius:6px;background:hsl(220,70%,28%);"></div>
    </div>`,
  );

// Rule 10 — warm or cool neutrals, not both
const mixedTempHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
      <div style="display:flex;gap:10px;">
        <div style="width:48px;height:48px;border-radius:6px;background:#8a7d6e;"></div>
        <div style="width:48px;height:48px;border-radius:6px;background:#6e7a8a;"></div>
        <div style="width:48px;height:48px;border-radius:6px;background:#8a7d6e;"></div>
      </div>
      <p style="margin:0;font-size:11px;color:#a3a3a3;">Warm + cool, mixed</p>
    </div>`,
  );
const warmOnlyHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;">
      <div style="display:flex;gap:10px;">
        <div style="width:48px;height:48px;border-radius:6px;background:#3d3833;"></div>
        <div style="width:48px;height:48px;border-radius:6px;background:#6b6259;"></div>
        <div style="width:48px;height:48px;border-radius:6px;background:#a39c92;"></div>
      </div>
      <p style="margin:0;font-size:11px;color:#a3a3a3;">Warm grays only</p>
    </div>`,
  );

// Rule 11 — the spacing scale (measurements are mathematically related)
const SPACING_SCALE = [4, 8, 12, 16, 24, 32];
const spacingScaleHtml = () =>
  page(
    `<div style="display:flex;align-items:flex-end;gap:14px;">
      ${SPACING_SCALE.map(
        (v) =>
          `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
            <div style="width:20px;height:${v * 3}px;background:#171717;border-radius:3px;"></div>
            <span style="font-size:10px;color:#737373;">${v}</span>
          </div>`,
      ).join("")}
    </div>`,
  );

// Rule 12 — order elements by visual weight
const randomWeightHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:10px;">
      <span style="font-size:11px;color:#a3a3a3;">Byline text</span>
      <button style="font:600 13px system-ui, sans-serif;padding:10px 20px;border-radius:6px;border:none;background:#0a0a0a;color:#fafafa;">Get started</button>
      <span style="font-size:13px;font-weight:600;color:#0a0a0a;">Section label</span>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; text-align: left; }",
  );
const triangleWeightHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;align-items:flex-start;gap:10px;">
      <button style="font:600 13px system-ui, sans-serif;padding:10px 20px;border-radius:6px;border:none;background:#0a0a0a;color:#fafafa;">Get started</button>
      <span style="font-size:13px;font-weight:600;color:#0a0a0a;">Section label</span>
      <span style="font-size:11px;color:#a3a3a3;">Byline text</span>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; text-align: left; }",
  );

// Rule 13 — a 12-column grid
const gridHtml = () =>
  page(
    `<div style="width:100%;max-width:260px;display:flex;flex-direction:column;gap:10px;">
      <div style="display:grid;grid-template-columns:repeat(12,1fr);gap:3px;">
        ${Array.from({ length: 12 })
          .map(
            (_, i) =>
              `<div style="height:26px;background:${i % 4 === 0 ? "#0a0a0a" : "#d4d4d4"};border-radius:2px;"></div>`,
          )
          .join("")}
      </div>
      <p style="margin:0;font-size:10px;color:#a3a3a3;">12 columns splits evenly into 1, 2, 3, 4, 6, or 12</p>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; text-align: left; }",
  );

// Rule 14 — spacing should go between points of high contrast
const spacingBoxEdgeHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:rgba(10,10,10,0.04);">
          <div style="width:14px;height:14px;border-radius:3px;background:#0a0a0a;"></div>
        </div>
        <span style="font-size:13px;color:#171717;">Label text</span>
      </div>
      <p style="margin:0;font-size:10px;color:#a3a3a3;">gap: 16px — measured to the icon's oversized box</p>
    </div>`,
  );
const spacingContrastEdgeHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
      <div style="display:flex;align-items:center;gap:16px;">
        <div style="width:14px;height:14px;border-radius:3px;background:#0a0a0a;"></div>
        <span style="font-size:13px;color:#171717;">Label text</span>
      </div>
      <p style="margin:0;font-size:10px;color:#a3a3a3;">gap: 16px — measured from the visible edge of the glyph</p>
    </div>`,
  );

// Rule 15 — closer elements should be lighter
const flatLayersHtml = () =>
  page(
    `<div style="position:relative;width:140px;height:100px;">
      <div style="position:absolute;left:0;top:20px;width:100px;height:60px;border-radius:8px;background:#262626;"></div>
      <div style="position:absolute;left:20px;top:10px;width:100px;height:60px;border-radius:8px;background:#262626;"></div>
      <div style="position:absolute;left:40px;top:0;width:100px;height:60px;border-radius:8px;background:#262626;"></div>
    </div>`,
    "body { background: #171717; }",
  );
const lightLayersHtml = () =>
  page(
    `<div style="position:relative;width:140px;height:100px;">
      <div style="position:absolute;left:0;top:20px;width:100px;height:60px;border-radius:8px;background:#262626;"></div>
      <div style="position:absolute;left:20px;top:10px;width:100px;height:60px;border-radius:8px;background:#3a3a3a;"></div>
      <div style="position:absolute;left:40px;top:0;width:100px;height:60px;border-radius:8px;background:#525252;"></div>
    </div>`,
    "body { background: #171717; }",
  );

// Rule 16 — shadow blur values double their distance values
const shadowMismatchHtml = () =>
  page(
    `<div style="width:140px;height:80px;background:#fff;border-radius:8px;box-shadow:0 6px 6px rgba(0,0,0,0.25);"></div>`,
    "body { background: #f2f2f2; }",
  );
const shadowRatioHtml = () =>
  page(
    `<div style="width:140px;height:80px;background:#fff;border-radius:8px;box-shadow:0 6px 12px rgba(0,0,0,0.18);"></div>`,
    "body { background: #f2f2f2; }",
  );

// Rule 17 — put simple on complex, or complex on simple
const STRIPES =
  "repeating-linear-gradient(45deg,#e5e5e5,#e5e5e5 6px,#f5f5f5 6px,#f5f5f5 12px)";
const complexOnComplexHtml = () =>
  page(
    `<div style="width:140px;height:100px;border-radius:8px;background:${STRIPES};display:flex;align-items:center;justify-content:center;">
      <div style="position:relative;width:44px;height:44px;">
        <div style="position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#0a0a0a;"></div>
        <div style="position:absolute;right:0;bottom:0;width:22px;height:22px;border-radius:4px;background:#525252;transform:rotate(15deg);"></div>
        <div style="position:absolute;left:14px;bottom:4px;width:18px;height:18px;border-radius:3px;border:2px solid #0a0a0a;"></div>
      </div>
    </div>`,
  );
const simpleOnComplexHtml = () =>
  page(
    `<div style="width:140px;height:100px;border-radius:8px;background:${STRIPES};display:flex;align-items:center;justify-content:center;">
      <div style="width:36px;height:36px;border-radius:50%;background:#0a0a0a;"></div>
    </div>`,
  );
const complexOnSimpleHtml = () =>
  page(
    `<div style="width:140px;height:100px;border-radius:8px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;">
      <div style="position:relative;width:44px;height:44px;">
        <div style="position:absolute;left:0;top:0;width:26px;height:26px;border-radius:50%;background:#0a0a0a;"></div>
        <div style="position:absolute;right:0;bottom:0;width:22px;height:22px;border-radius:4px;background:#525252;transform:rotate(15deg);"></div>
        <div style="position:absolute;left:14px;bottom:4px;width:18px;height:18px;border-radius:3px;border:2px solid #0a0a0a;"></div>
      </div>
    </div>`,
  );

// Rule 18 — keep container colours within brightness limits
const brightnessTooMuchHtml = () =>
  page(
    `<div style="width:160px;padding:16px;">
      <div style="background:#d0d0d0;border-radius:8px;padding:16px;font-size:11px;color:#525252;">~18% brightness jump</div>
    </div>`,
    "body { background: #fff; }",
  );
const brightnessOkHtml = () =>
  page(
    `<div style="width:160px;padding:16px;">
      <div style="background:#f5f5f5;border-radius:8px;padding:16px;font-size:11px;color:#525252;">~4% brightness jump</div>
    </div>`,
    "body { background: #fff; }",
  );

// Rule 19 — outer padding should be the same or more than inner padding
const paddingWrongHtml = () =>
  page(
    `<div style="width:180px;background:#f5f5f5;border-radius:8px;padding:8px;display:flex;flex-direction:column;gap:16px;text-align:left;">
      <div style="font-size:12px;color:#171717;">First item</div>
      <div style="font-size:12px;color:#171717;">Second item</div>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; }",
  );
const paddingRightHtml = () =>
  page(
    `<div style="width:180px;background:#f5f5f5;border-radius:8px;padding:20px;display:flex;flex-direction:column;gap:12px;text-align:left;">
      <div style="font-size:12px;color:#171717;">First item</div>
      <div style="font-size:12px;color:#171717;">Second item</div>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; }",
  );

// Rule 20 — body text size
const SAMPLE_TEXT =
  "Reading small text asks the eye to lean in and work harder than it should.";
const smallTextHtml = () =>
  page(
    `<p style="max-width:200px;font-size:13px;line-height:1.4;margin:0;text-align:left;">${SAMPLE_TEXT}</p>`,
  );
const comfortableTextHtml = () =>
  page(
    `<p style="max-width:220px;font-size:17px;line-height:1.55;margin:0;text-align:left;">${SAMPLE_TEXT}</p>`,
  );

// Rule 21 — line length / measure
const LONG_TEXT =
  "Long lines make the eye lose its place on the way back to the start, which is why unrestrained paragraphs feel more tiring to read the wider the browser window gets, even though nothing about the words themselves has changed.";
const lineLengthHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;gap:16px;width:100%;">
      <div>
        <p style="margin:0 0 4px;font-size:10px;font-weight:600;color:#dc2626;">No max-width</p>
        <p style="margin:0;font-size:13px;line-height:1.5;">${LONG_TEXT}</p>
      </div>
      <div>
        <p style="margin:0 0 4px;font-size:10px;font-weight:600;color:#16a34a;">max-width: 65ch</p>
        <p style="margin:0;max-width:65ch;font-size:13px;line-height:1.5;">${LONG_TEXT}</p>
      </div>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; text-align: left; }",
  );

// Rule 22 — button padding ratio
const squareButtonHtml = () =>
  page(
    `<button style="font:600 13px system-ui, sans-serif;padding:12px 14px;border-radius:6px;border:1px solid #0a0a0a;background:#0a0a0a;color:#fafafa;">Continue</button>`,
  );
const ratioButtonHtml = () =>
  page(
    `<button style="font:600 13px system-ui, sans-serif;padding:12px 24px;border-radius:6px;border:1px solid #0a0a0a;background:#0a0a0a;color:#fafafa;">Continue</button>`,
  );

// Rule 23 — two typefaces at most
const threeTypefacesHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;gap:8px;text-align:left;">
      <p style="margin:0;font:700 18px Georgia, serif;color:#0a0a0a;">Heading in serif</p>
      <p style="margin:0;font:13px 'Courier New', monospace;color:#171717;">Body copy in monospace</p>
      <p style="margin:0;font:600 11px system-ui, sans-serif;letter-spacing:0.05em;text-transform:uppercase;color:#737373;">Label in sans</p>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; }",
  );
const twoTypefacesHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;gap:8px;text-align:left;">
      <p style="margin:0;font:700 18px system-ui, sans-serif;color:#0a0a0a;">Heading in sans</p>
      <p style="margin:0;font:13px system-ui, sans-serif;color:#171717;">Body copy in the same sans</p>
      <p style="margin:0;font:12px 'Courier New', monospace;color:#737373;">A code label in monospace</p>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; }",
  );

// Rule 24 — nested corner radii
const radiiMismatchHtml = () =>
  page(
    `<div style="width:160px;background:#eee;border-radius:16px;padding:16px;">
      <div style="background:#fff;border:1px solid #ddd;border-radius:16px;height:60px;"></div>
    </div>`,
  );
const radiiProportionalHtml = () =>
  page(
    `<div style="width:160px;background:#eee;border-radius:16px;padding:16px;">
      <div style="background:#fff;border:1px solid #ddd;border-radius:8px;height:60px;"></div>
    </div>`,
  );

// Rule 25 — don't put two hard divides next to each other
const doubleDivideHtml = () =>
  page(
    `<div style="width:180px;text-align:left;">
      <div style="border-bottom:1px solid #d4d4d4;padding-bottom:10px;margin-bottom:2px;font-size:12px;color:#171717;">Section one</div>
      <div style="border-top:1px solid #d4d4d4;padding-top:10px;font-size:12px;color:#171717;">Section two</div>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; }",
  );
const singleDivideHtml = () =>
  page(
    `<div style="width:180px;text-align:left;">
      <div style="padding-bottom:12px;font-size:12px;color:#171717;">Section one</div>
      <div style="border-top:1px solid #d4d4d4;padding-top:12px;font-size:12px;color:#171717;">Section two</div>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; }",
  );

// Rule 26 — no shadows in dark interfaces
const darkShadowHtml = () =>
  page(
    `<div style="width:140px;height:80px;background:#262626;border-radius:8px;box-shadow:0 8px 16px rgba(0,0,0,0.4);"></div>`,
    "body { background: #171717; }",
  );
const darkBorderHtml = () =>
  page(
    `<div style="width:140px;height:80px;background:#262626;border:1px solid #404040;border-radius:8px;"></div>`,
    "body { background: #171717; }",
  );

// Rule 27 — don't mix depth techniques (border vs. shadow on the same surface)
const borderShadowHtml = () =>
  page(
    `<div style="width:100%;max-width:180px;background:#fff;border:1px solid #ddd;box-shadow:0 12px 24px rgba(0,0,0,0.18);border-radius:8px;padding:20px;font-size:12px;color:#525252;">Border + shadow</div>`,
  );
const borderOnlyHtml = () =>
  page(
    `<div style="width:100%;max-width:180px;background:#fff;border:1px solid #ddd;border-radius:8px;padding:20px;font-size:12px;color:#525252;">Border only</div>`,
  );

// Rule 28 — lower the contrast of icons paired with text
const iconHeavyHtml = () =>
  page(
    `<div style="display:flex;align-items:center;gap:8px;">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="#0a0a0a"><circle cx="8" cy="8" r="7"/></svg>
      <span style="font-size:13px;color:#0a0a0a;">Notifications</span>
    </div>`,
  );
const iconMutedHtml = () =>
  page(
    `<div style="display:flex;align-items:center;gap:8px;">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="#a3a3a3"><circle cx="8" cy="8" r="7"/></svg>
      <span style="font-size:13px;color:#0a0a0a;">Notifications</span>
    </div>`,
  );

// Rule 29 (beyond the source) — one accent color, used deliberately (real CSS :hover, no JS needed)
const noAccentLinkHtml = () =>
  page(
    `<p style="max-width:220px;font-size:14px;line-height:1.5;color:#171717;">Read the <a href="#" style="color:inherit;text-decoration:underline;">full guide</a> for details.</p>`,
    "body { align-items: flex-start; justify-content: flex-start; text-align: left; }",
  );
const accentUsageHtml = () =>
  page(
    `<div style="display:flex;flex-direction:column;gap:14px;width:100%;max-width:220px;">
      <p style="margin:0;font-size:14px;line-height:1.5;color:#171717;">Read the <a href="#" style="color:#0060df;text-decoration:underline;">full guide</a> for details.</p>
      <div style="border-left:3px solid #0060df;padding:4px 0 4px 10px;font-size:13px;font-weight:600;color:#0060df;">Current page</div>
    </div>`,
    "body { align-items: flex-start; justify-content: flex-start; text-align: left; }",
  );
const accentHoverHtml = () =>
  page(
    `<a href="#" class="accent-link">Hover or tab to me</a>`,
    `.accent-link {
      font: 600 14px system-ui, sans-serif;
      color: #0060df;
      text-decoration: underline;
      transition: color 160ms ease-out;
    }
    .accent-link:hover, .accent-link:focus-visible { color: #0345a5; }`,
  );

// Rule 30 (beyond the source) — motion duration/easing (real CSS :hover, no JS needed)
function motionHtml(duration: string, easing: string) {
  return page(
    `<div class="track"><div class="box">Hover</div></div>`,
    `.track {
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
      transition: transform ${duration} ${easing};
    }
    .track:hover .box { transform: translateX(90px); }`,
  );
}
const slowMotionHtml = () => motionHtml("600ms", "ease-in-out");
const fastMotionHtml = () => motionHtml("160ms", "ease-out");

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
      text: "Anthony Hobday's 28 \"safe to follow\" rules for visual design, plus two of this site's own — each one demonstrated with a live, mostly ✕ Bad / ✓ Good CSS pane below.",
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
          code: "background: #000;\ncolor: #fff;",
          tailwind: '<div class="bg-black text-white">',
          html: pureBlackHtml,
        },
        {
          label: "Near-black/near-white",
          status: "good",
          code: "background: #0a0a0a;\ncolor: #fafafa;",
          tailwind: '<div class="bg-neutral-950 text-neutral-50">',
          html: nearBlackHtml,
        },
        { label: "Seam test", html: blackWhiteSeamHtml },
      ],
      height: 200,
      caption: "Alone the first two panes look identical; edge to edge in the third, the seam appears — enough difference to soften pure black without losing contrast.",
    },
    {
      kind: "callout",
      variant: "tip",
      text: "This seam trick generalizes to any two colors that are close enough to look identical when viewed apart: put them edge to edge with no gap. The eye is far better at catching a boundary between near-identical colors than at comparing two isolated swatches.",
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
          code: "background: #404040;\nbackground: #737373;\nbackground: #a3a3a3;",
          html: flatNeutralsHtml,
        },
        {
          label: "Saturated toward the accent",
          status: "good",
          code: "background: #3a4150;\nbackground: #6b7385;\nbackground: #a1a8b8;",
          html: saturatedNeutralsHtml,
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
          code: "h2, p { color: #737373; }",
          tailwind: '<h2 class="text-neutral-500">\n<p class="text-neutral-500">',
          html: flatHierarchyHtml,
        },
        {
          label: "Near-black + muted gray",
          status: "good",
          code: "h2 { color: #0a0a0a; }\np { color: #a3a3a3; }",
          tailwind: '<h2 class="text-neutral-950">\n<p class="text-neutral-400">',
          html: contrastHierarchyHtml,
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
          code: "padding: 11px;\ncolor: #333, #8a8a8a;\nborder-radius: 9px;",
          html: chaosCardHtml,
        },
        {
          label: "Deliberate values",
          status: "good",
          code: "padding: 16px;\ncolor: #0a0a0a, #737373;\nborder-radius: 8px;",
          html: deliberateCardHtml,
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
          code: ".icon {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}",
          tailwind: '<div class="flex items-center justify-center">',
          html: mathCenterHtml,
        },
        {
          label: "Nudged 2px right",
          status: "good",
          code: ".icon-glyph {\n  transform: translateX(2px);\n}",
          tailwind: '<div class="translate-x-0.5">',
          html: opticalCenterHtml,
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
          code: "h1 { letter-spacing: -0.02em; }\nlabel { letter-spacing: 0.05em; }",
          tailwind: '<h1 class="tracking-tight">\n<span class="tracking-wider">',
          html: trackingHtml,
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
          code: "background: #171717;\n.card { background: #262626; border-color: #1f1f1f; }",
          html: borderBlendHtml,
        },
        {
          label: "Border lighter than both",
          status: "good",
          code: "background: #171717;\n.card { background: #262626; border-color: #404040; }",
          html: borderPopHtml,
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
          code: "h2 { margin-left: 4px; }\np { margin-left: 14px; }\nbutton { margin-left: 8px; }",
          html: misalignedHtml,
        },
        {
          label: "Shared left edge",
          status: "good",
          code: "h2, p, button { margin-left: 10px; }",
          html: alignedHtml,
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
          code: "hsl(0, 55%, 50%)\nhsl(140, 55%, 42%)\nhsl(220, 65%, 52%)",
          html: sameBrightnessHtml,
        },
        {
          label: "Distinct brightness values",
          status: "good",
          code: "hsl(0, 60%, 72%)\nhsl(140, 45%, 45%)\nhsl(220, 70%, 28%)",
          html: distinctBrightnessHtml,
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
          code: "background: #8a7d6e; /* warm */\nbackground: #6e7a8a; /* cool */",
          html: mixedTempHtml,
        },
        {
          label: "Warm only",
          status: "good",
          code: "background: #3d3833;\nbackground: #6b6259;\nbackground: #a39c92;",
          html: warmOnlyHtml,
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
          code: "4px  8px  12px  16px  24px  32px",
          tailwind: "gap-1  gap-2  gap-3  gap-4  gap-6  gap-8",
          html: spacingScaleHtml,
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
          html: randomWeightHtml,
        },
        {
          label: "Heaviest to lightest",
          status: "good",
          html: triangleWeightHtml,
        },
      ],
      height: 170,
      caption: "Same three elements — leading with the solid button and closing with the lightest byline text gives the eye a clear entry point and a clear exit.",
    },

    { kind: "heading", text: "13. If you use a horizontal grid, use 12 columns" },
    {
      kind: "paragraph",
      text: "A 12-column grid divides cleanly into halves, thirds, and quarters, which covers most layout needs without switching grid systems partway through a page.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "12 columns",
          html: gridHtml,
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
      text: "The eye finds an edge by contrast, not by DOM box — measure spacing from a glyph's visible edge, or gaps will look uneven even with matching numbers.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Measured to the icon's box",
          status: "bad",
          html: spacingBoxEdgeHtml,
        },
        {
          label: "Measured to the visible edge",
          status: "good",
          html: spacingContrastEdgeHtml,
        },
      ],
      height: 140,
      caption: "Both gaps are set to 16px — the first only looks that wide because of the icon's invisible padding; the second, measured from the glyph itself, actually reads as 16px.",
    },

    { kind: "heading", text: "15. Closer elements should be lighter" },
    {
      kind: "paragraph",
      text: "As surfaces get closer to the viewer, they should get lighter — a cue that works in both light and dark interfaces and reinforces depth without needing a shadow.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Flat, no depth cue",
          status: "bad",
          html: flatLayersHtml,
        },
        {
          label: "Lighter toward the front",
          status: "good",
          html: lightLayersHtml,
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
          code: "box-shadow: 0 6px 6px rgba(0,0,0,0.25);",
          html: shadowMismatchHtml,
        },
        {
          label: "6px distance, 12px blur",
          status: "good",
          code: "box-shadow: 0 6px 12px rgba(0,0,0,0.18);",
          html: shadowRatioHtml,
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
          html: complexOnComplexHtml,
        },
        {
          label: "Simple mark on complex background",
          status: "good",
          html: simpleOnComplexHtml,
        },
        {
          label: "Complex mark on simple background",
          status: "good",
          html: complexOnSimpleHtml,
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
          code: "background: #fff;\n.card { background: #d0d0d0; }",
          html: brightnessTooMuchHtml,
        },
        {
          label: "Within limits",
          status: "good",
          code: "background: #fff;\n.card { background: #f5f5f5; }",
          html: brightnessOkHtml,
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
          code: ".card { padding: 8px; gap: 16px; }",
          html: paddingWrongHtml,
        },
        {
          label: "Outer 20px, inner gap 12px",
          status: "good",
          code: ".card { padding: 20px; gap: 12px; }",
          html: paddingRightHtml,
        },
      ],
      height: 150,
      caption: "Same two items — once the outer padding is larger than the inner gap, the pair reads as a single grouped unit instead of two items pinned to the card's edges.",
    },

    { kind: "heading", text: "20. Keep body text at 16px or above" },
    {
      kind: "paragraph",
      text: "16px is the default body size for a reason — below it, text asks the reader to lean in, so this site uses 20px with generous line-height.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "13px / 1.4",
          status: "bad",
          code: "font-size: 13px;\nline-height: 1.4;",
          tailwind: '<p class="text-[13px] leading-snug">',
          html: smallTextHtml,
        },
        {
          label: "17px / 1.55",
          status: "good",
          code: "font-size: 17px;\nline-height: 1.55;",
          tailwind: '<p class="text-[17px] leading-[1.55]">',
          html: comfortableTextHtml,
        },
      ],
      height: 140,
      caption: "Same sentence, same width — the larger size with more breathing room between lines reads noticeably easier.",
    },

    { kind: "heading", text: "21. Use a line length around 70 characters" },
    {
      kind: "paragraph",
      text: "Lines can run 60–80 characters comfortably, but go far past that and readability suffers — so paragraphs here are capped at a measure.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Unconstrained vs. measure: 65ch",
          code: "p { max-width: none; }\np { max-width: 65ch; }",
          tailwind: '<p class="max-w-none">\n<p class="max-w-prose"> <!-- max-w-prose = 65ch -->',
          html: lineLengthHtml,
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
          code: "padding: 12px 14px;",
          tailwind: '<button class="px-3.5 py-3">',
          html: squareButtonHtml,
        },
        {
          label: "padding: 12px 24px",
          status: "good",
          code: "padding: 12px 24px;",
          tailwind: '<button class="px-6 py-3">',
          html: ratioButtonHtml,
        },
      ],
      height: 110,
      caption: "Same vertical padding, same text — only the horizontal padding changes, and the second button reads as intentional rather than cramped.",
    },

    { kind: "heading", text: "23. Use two typefaces at most" },
    {
      kind: "paragraph",
      text: "A second typeface can reinforce a design's idea — a monospace for code, a serif for warmth — but a third rarely adds anything but noise.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Three typefaces",
          status: "bad",
          html: threeTypefacesHtml,
        },
        {
          label: "Two typefaces",
          status: "good",
          html: twoTypefacesHtml,
        },
      ],
      height: 150,
      caption: "The first mixes a serif heading, a monospace body, and a sans label. The second keeps everything on one sans, reserving the monospace for a single code-like detail.",
    },

    { kind: "heading", text: "24. Nest corners properly" },
    {
      kind: "paragraph",
      text: "An inner element's corner radius should equal the outer radius minus the padding between them, or the two curves visually fight each other instead of feeling concentric.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Outer 16px, inner 16px",
          status: "bad",
          code: ".outer { border-radius: 16px; padding: 16px; }\n.inner { border-radius: 16px; }",
          tailwind: '<div class="rounded-2xl p-4">\n  <div class="rounded-2xl">',
          html: radiiMismatchHtml,
        },
        {
          label: "Outer 16px, inner 8px (16 − padding)",
          status: "good",
          code: ".outer { border-radius: 16px; padding: 16px; }\n.inner { border-radius: 8px; }",
          tailwind: '<div class="rounded-2xl p-4">\n  <div class="rounded-lg">',
          html: radiiProportionalHtml,
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
          code: ".a { border-bottom: 1px solid #d4d4d4; }\n.b { border-top: 1px solid #d4d4d4; }",
          html: doubleDivideHtml,
        },
        {
          label: "One shared divide",
          status: "good",
          code: ".b { border-top: 1px solid #d4d4d4; }",
          html: singleDivideHtml,
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
          code: "box-shadow: 0 8px 16px rgba(0,0,0,0.4);",
          html: darkShadowHtml,
        },
        {
          label: "Border on dark",
          status: "good",
          code: "border: 1px solid #404040;",
          html: darkBorderHtml,
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
          code: "border: 1px solid #ddd;\nbox-shadow: 0 12px 24px rgba(0,0,0,0.18);",
          tailwind: '<div class="border border-neutral-300 shadow-lg">',
          html: borderShadowHtml,
        },
        {
          label: "Border only",
          status: "good",
          code: "border: 1px solid #ddd;",
          tailwind: '<div class="border border-neutral-300">',
          html: borderOnlyHtml,
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
          code: "svg { fill: #0a0a0a; }",
          html: iconHeavyHtml,
        },
        {
          label: "Icon muted",
          status: "good",
          code: "svg { fill: #a3a3a3; }",
          html: iconMutedHtml,
        },
      ],
      height: 110,
      caption: "Same label, same icon shape — muting the icon's fill is what keeps it from outweighing the text it's paired with.",
    },

    { kind: "heading", text: "Beyond the source: two rules this site adds" },
    {
      kind: "paragraph",
      text: "Hobday's list covers static design — this site is interactive, so it adds two rules of its own: color as an interaction cue, and motion.",
    },

    { kind: "heading", text: "29. One accent color, used deliberately" },
    {
      kind: "paragraph",
      text: "This site reserves a single signature blue for the handful of things that are always interactive — links, the current-page indicator, and focus rings.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "No accent",
          status: "bad",
          code: "a { color: inherit; }",
          tailwind: '<a class="text-inherit underline">',
          html: noAccentLinkHtml,
        },
        {
          label: "One accent, used deliberately",
          status: "good",
          code: "a { color: #0060df; }\n.current { border-left: 3px solid #0060df; color: #0060df; }",
          tailwind: '<a class="text-accent">\n<div class="border-l-2 border-accent text-accent">',
          html: accentUsageHtml,
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
          html: accentHoverHtml,
        },
      ],
      height: 100,
      caption: "Hover or tab to the link — the accent darkens slightly, the only color transition on the page.",
    },
    {
      kind: "callout",
      variant: "note",
      text: "The accent is deliberately a single hue. A second accent color for e.g. warning or success states would undercut rule 3's point — contrast, not color, is what should carry meaning.",
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
      text: "Interface transitions here run under 200ms on a gentle ease-out curve — long enough to feel intentional, short enough to never be waited on.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "600ms, ease-in-out",
          status: "bad",
          code: "transition: transform 600ms ease-in-out;",
          tailwind: '<div class="transition-transform duration-600 ease-in-out">',
          html: slowMotionHtml,
        },
        {
          label: "160ms, ease-out",
          status: "good",
          code: "transition: transform 160ms ease-out;",
          tailwind: '<div class="transition-transform duration-160 ease-out">',
          html: fastMotionHtml,
        },
      ],
      height: 110,
      caption: "Hover each box — the slow one lags noticeably behind the cursor; the fast one feels immediate.",
    },
  ],
};
