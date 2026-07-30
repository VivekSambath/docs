// Monochrome, stroke-only line-art illustrations — no fills, gradients, or
// shadows, in keeping with the site's restrained visual language (see the
// `design-principles` article). Every shape inherits color via currentColor
// so it adapts automatically to light/dark mode and to whatever text color
// class wraps it.

import type { ReactNode } from "react";

function Svg({
  viewBox,
  strokeWidth = 1.5,
  className,
  children,
}: {
  viewBox: string;
  strokeWidth?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Home page hero — a quiet browser window with a page of text and a button. */
export function HeroIllustration({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 280 200" className={className}>
      <rect x="1.5" y="1.5" width="277" height="197" rx="12" />
      <line x1="1.5" y1="40" x2="278.5" y2="40" />
      <circle cx="21" cy="20.5" r="4" />
      <circle cx="35" cy="20.5" r="4" />
      <circle cx="49" cy="20.5" r="4" />
      <line x1="24" y1="66" x2="210" y2="66" strokeWidth="3" />
      <line x1="24" y1="88" x2="256" y2="88" strokeWidth="3" opacity="0.5" />
      <line x1="24" y1="110" x2="180" y2="110" strokeWidth="3" opacity="0.5" />
      <line x1="24" y1="132" x2="230" y2="132" strokeWidth="3" opacity="0.5" />
      <rect x="24" y="154" width="92" height="28" rx="6" />
      <line x1="44" y1="168" x2="96" y2="168" strokeWidth="2" />
    </Svg>
  );
}

/** design-principles — a circle split evenly, echoing "near-black / near-white". */
export function ContrastIllustration({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 48 48" className={className}>
      <circle cx="24" cy="24" r="18" />
      <path d="M24 6a18 18 0 0 1 0 36Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** full-bleed-css — edge-to-edge bars around an inset one. */
export function BleedIllustration({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 48 48" className={className}>
      <rect x="2" y="8" width="44" height="6" rx="1.5" />
      <rect x="10" y="21" width="28" height="6" rx="1.5" opacity="0.5" />
      <rect x="2" y="34" width="44" height="6" rx="1.5" />
    </Svg>
  );
}

/** reading-disabilities — an eye watching evenly spaced lines of text. */
export function ReadingIllustration({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 48 48" className={className}>
      <circle cx="24" cy="13" r="6" />
      <circle cx="24" cy="13" r="1.6" fill="currentColor" stroke="none" />
      <line x1="8" y1="27" x2="40" y2="27" />
      <line x1="8" y1="34.5" x2="32" y2="34.5" opacity="0.5" />
      <line x1="8" y1="42" x2="36" y2="42" opacity="0.5" />
    </Svg>
  );
}

/** touch-events — a tap: a point with expanding ripples. */
export function TouchIllustration({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 48 48" className={className}>
      <circle cx="24" cy="24" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="24" cy="24" r="9" />
      <circle cx="24" cy="24" r="17" opacity="0.5" />
    </Svg>
  );
}

// --- Home page feature-strip icons ------------------------------------------
// Small, deliberately literal icons that echo specific design-principles
// rules (the spacing scale, the single accent, short ease-out motion) —
// used with `text-accent` at the call site rather than a fill, so the accent
// stays reserved for interactive/callout use per rule 29.

/** Rule 11 — the mathematical spacing scale, as ascending bars. */
export function ScaleIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 32 32" className={className}>
      <path d="M6 26V20M13.3 26V15M20.7 26V10M28 26V4" strokeWidth="2.2" />
    </Svg>
  );
}

/** Rule 29 — one accent, used deliberately: a single filled ring. */
export function AccentIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 32 32" className={className}>
      <circle cx="16" cy="16" r="11" strokeWidth="2.2" />
      <circle cx="16" cy="16" r="3" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** Rule 30 — short, ease-out motion: a dot mid-travel along a track. */
export function MotionIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 32 32" className={className}>
      <path d="M4 16h24" strokeWidth="2.2" strokeDasharray="2 5" opacity="0.5" />
      <circle cx="21" cy="16" r="4" fill="currentColor" stroke="none" />
    </Svg>
  );
}

// --- Small nav / UI icons ----------------------------------------------------
// 20x20, slightly heavier stroke than the illustrations above so they hold up
// at 16-18px next to text. Same stroke-only, currentColor language (rule 28
// keeps these muted relative to their label wherever they're paired with one).

/** A doorway with a peaked roof line — used for the Home nav item. */
export function HomeIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 20 20" strokeWidth={1.6} className={className}>
      <path d="M3 9.5 10 3l7 6.5" strokeLinejoin="round" />
      <path d="M5 8.5V17h10V8.5" strokeLinejoin="round" />
      <path d="M8 17v-5h4v5" strokeLinejoin="round" />
    </Svg>
  );
}

/** A stacked pair of ruled pages — used for the Articles nav item. */
export function ArticlesIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 20 20" strokeWidth={1.6} className={className}>
      <rect x="4.5" y="2.5" width="11" height="14" rx="1.5" />
      <path d="M7 6.5h6M7 9.5h6M7 12.5h3.5" />
    </Svg>
  );
}

/** Code brackets — used for the CSS Docs nav item. */
export function CodeIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 20 20" strokeWidth={1.6} className={className}>
      <path d="M7 5 2.5 10 7 15" strokeLinejoin="round" />
      <path d="M13 5l4.5 5-4.5 5" strokeLinejoin="round" />
    </Svg>
  );
}

/** A short right-pointing arrow — the "go" affordance on list cards and CTAs. */
export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 20 20" strokeWidth={1.8} className={className}>
      <path d="M4 10h12" />
      <path d="M11 5.5 15.5 10 11 14.5" strokeLinejoin="round" />
    </Svg>
  );
}

/** An upward arrow over a baseline — used by Footer's back-to-top link. */
export function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 20 20" strokeWidth={1.8} className={className}>
      <path d="M10 15.5V5" />
      <path d="M5.5 9.5 10 5l4.5 4.5" strokeLinejoin="round" />
    </Svg>
  );
}

/** Sun glyph — ThemeToggle's light-mode state. */
export function SunIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 20 20" strokeWidth={1.6} className={className}>
      <circle cx="10" cy="10" r="4" />
      <path d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M15.7 4.3l-1.4 1.4M5.7 14.3l-1.4 1.4M15.7 15.7l-1.4-1.4M5.7 5.7 4.3 4.3" />
    </Svg>
  );
}

/** Crescent moon — ThemeToggle's dark-mode state. */
export function MoonIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 20 20" strokeWidth={1.6} className={className}>
      <path d="M16.5 12.3A7 7 0 1 1 7.7 3.5a5.6 5.6 0 0 0 8.8 8.8Z" strokeLinejoin="round" />
    </Svg>
  );
}

/** A signpost pointing two directions, one snapped off — the 404 page illustration. */
export function LostIllustration({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 160 160" className={className}>
      <line x1="80" y1="20" x2="80" y2="140" />
      <path d="M80 46h48l-10 14 10 14H80Z" strokeLinejoin="round" />
      <path d="M80 74H36l8-10" strokeLinejoin="round" opacity="0.5" />
      <line x1="56" y1="140" x2="104" y2="140" />
    </Svg>
  );
}

/** A magnifying glass — search trigger and empty-state icon. */
export function SearchIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 20 20" strokeWidth={1.6} className={className}>
      <circle cx="9" cy="9" r="6" />
      <path d="M13.5 13.5 18 18" strokeLinecap="round" />
    </Svg>
  );
}

/** A lightbulb — same mark as the "tip" callout variant, reused for the homepage tip widget. */
export function BulbIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 16 16" strokeWidth={1.4} className={className}>
      <path d="M6 14.5h4" strokeLinecap="round" />
      <path d="M6.5 12.5h3" strokeLinecap="round" />
      <path d="M8 1.5a4.5 4.5 0 0 0-2.5 8.25c.5.35.75.9.75 1.4v.35h3.5v-.35c0-.5.25-1.05.75-1.4A4.5 4.5 0 0 0 8 1.5Z" strokeLinejoin="round" />
    </Svg>
  );
}

/** An X — small dismiss affordance. */
export function CloseIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 16 16" strokeWidth={1.5} className={className}>
      <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
    </Svg>
  );
}

/** A panel with a divided left rail — toggles the sidebar's collapsed state. */
export function SidebarIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 20 20" strokeWidth={1.6} className={className}>
      <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
      <line x1="8" y1="3.5" x2="8" y2="16.5" />
    </Svg>
  );
}

/** A filled swatch beside an outlined one — used for the contrast-color CSS doc. */
export function SwatchIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 48 48" className={className}>
      <rect x="4" y="12" width="20" height="20" rx="4" fill="currentColor" stroke="none" opacity="0.55" />
      <rect x="22" y="18" width="20" height="20" rx="4" />
    </Svg>
  );
}

/** A small dot easing along a dashed path into a larger one — used for the transitions CSS doc. */
export function TransitionIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 48 48" className={className}>
      <path d="M10 24h20" strokeDasharray="2 5" opacity="0.5" />
      <circle cx="10" cy="24" r="5" />
      <circle cx="34" cy="24" r="8" fill="currentColor" stroke="none" opacity="0.55" />
    </Svg>
  );
}

/** A progress track filling under a scroll marker — used for the animation-timeline CSS doc. */
export function TimelineIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 48 48" className={className}>
      <rect x="4" y="21" width="40" height="6" rx="3" />
      <rect x="4" y="21" width="24" height="6" rx="3" fill="currentColor" stroke="none" opacity="0.55" />
      <path d="M28 10v8M28 30v8" />
    </Svg>
  );
}

/** A disclosure triangle rotating open beside a growing panel — used for the animating-details CSS doc. */
export function DisclosureIcon({ className }: { className?: string }) {
  return (
    <Svg viewBox="0 0 48 48" className={className}>
      <path d="M8 15l6 5-6 5" strokeLinejoin="round" />
      <rect x="20" y="10" width="20" height="8" rx="2" opacity="0.5" />
      <rect x="20" y="22" width="20" height="16" rx="2" fill="currentColor" stroke="none" opacity="0.55" />
    </Svg>
  );
}
