// Monochrome, stroke-only line-art illustrations — no fills, gradients, or
// shadows, in keeping with the site's restrained visual language (see the
// `design-principles` article). Every shape inherits color via currentColor
// so it adapts automatically to light/dark mode and to whatever text color
// class wraps it.

import type { ReactNode } from "react";

function Svg({
  viewBox,
  className,
  children,
}: {
  viewBox: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
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
