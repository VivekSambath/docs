import type { ReactNode } from "react";

// Shared between DocContent (renders callout sections inline) and
// SectionRail (surfaces a section's callout in the sticky spotlight card) —
// kept out of DocContent.tsx so both stay pure-component modules for fast refresh.

export const calloutLabel: Record<string, string> = {
  tip: "Tip",
  note: "Note",
  warning: "Warning",
};

export const calloutAccent: Record<string, string> = {
  tip: "border-green-600/70",
  note: "border-accent",
  warning: "border-amber-500/80",
};

// Small monochrome line icons — stroke-only (no fills) to match the site's
// flat, shadow-free visual language; they inherit color via currentColor.
export const calloutIcon: Record<string, ReactNode> = {
  tip: (
    <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden="true">
      <path d="M6 14.5h4" strokeLinecap="round" />
      <path d="M6.5 12.5h3" strokeLinecap="round" />
      <path d="M8 1.5a4.5 4.5 0 0 0-2.5 8.25c.5.35.75.9.75 1.4v.35h3.5v-.35c0-.5.25-1.05.75-1.4A4.5 4.5 0 0 0 8 1.5Z" strokeLinejoin="round" />
    </svg>
  ),
  note: (
    <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7.25v4" strokeLinecap="round" />
      <circle cx="8" cy="4.9" r="0.15" fill="currentColor" stroke="none" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden="true">
      <path d="M8 1.75 14.75 13.5H1.25L8 1.75Z" strokeLinejoin="round" />
      <path d="M8 6.5v3.25" strokeLinecap="round" />
      <circle cx="8" cy="11.75" r="0.15" fill="currentColor" stroke="none" />
    </svg>
  ),
};
