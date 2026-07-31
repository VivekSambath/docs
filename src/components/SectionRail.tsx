import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { DocSection } from "../content/articles";
import { getSectionSpotlights, scrollToId } from "./docToc";
import { renderInline } from "./inline";
import { calloutAccent, calloutIcon, calloutLabel } from "./calloutStyles";

/**
 * Sticky right-hand rail shown alongside long-form doc content: a scroll-spy
 * mini outline plus a "spotlight" card that follows along with whichever
 * section is currently in view, surfacing that section's first callout (if
 * it has one).
 *
 * Fixed-positioned in the page margin rather than laid out as a flex sibling
 * of the content column — that way it never steals width from prose/code
 * blocks. It only appears once the viewport is wide enough to fit the full
 * 90rem page shell (max-w-360) *and* the rail's own width in the margin
 * outside it; below that it's simply not rendered (the left Sidebar's
 * per-article heading list already covers navigation on smaller viewports).
 *
 * Portaled straight to document.body: Layout.tsx's route-change wrapper
 * (.page-transition) carries a CSS animation, and any ancestor with a
 * non-`none` transform becomes the containing block for `position: fixed`
 * descendants — which would anchor this rail to that wrapper's box instead
 * of the viewport. Portaling sidesteps that entirely.
 */
export default function SectionRail({ sections }: { sections: DocSection[] }) {
  const spotlights = getSectionSpotlights(sections);
  const spotlightIds = spotlights.map((spotlight) => spotlight.id).join("|");
  const [activeId, setActiveId] = useState<string | undefined>(spotlights[0]?.id);

  useEffect(() => {
    const ids = spotlightIds ? spotlightIds.split("|") : [];
    if (ids.length === 0) return;

    const headingElements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (headingElements.length === 0) return;

    // The active section is whichever heading is the last to have crossed a
    // trigger line near the top of the viewport — i.e. the section the
    // reader is currently inside, not one they haven't reached yet. Recompute
    // on every scroll tick against getBoundingClientRect directly instead of
    // relying on IntersectionObserver callback timing, which only fires when
    // an element crosses the observed root and can miss fast scrolls.
    function updateActive() {
      const line = window.innerHeight * 0.2;
      let current = headingElements[0];
      for (const element of headingElements) {
        if (element.getBoundingClientRect().top <= line) {
          current = element;
        }
      }
      setActiveId(current.id);
    }

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [spotlightIds]);

  if (spotlights.length < 2) return null;

  const active = spotlights.find((spotlight) => spotlight.id === activeId) ?? spotlights[0];

  return createPortal(
    <aside
      className="fixed top-24 hidden w-64 [@media(min-width:132rem)]:block"
      style={{ left: "calc(50% + 47rem)" }}
      aria-label="Section navigation"
    >
      <div className="flex max-h-[calc(100svh-8rem)] flex-col gap-4">
        <nav aria-label="On this page" className="min-h-0 overflow-y-auto">
          <p className="mb-3 text-[13px] font-semibold tracking-wide text-muted uppercase">
            On this page
          </p>
          <ul className="flex flex-col gap-0.5 border-l border-border">
            {spotlights.map((spotlight) => {
              const isActive = spotlight.id === active.id;
              return (
                <li key={spotlight.id}>
                  <a
                    href={`#${spotlight.id}`}
                    onClick={scrollToId(spotlight.id)}
                    className={`-ml-px block border-l-2 py-1 pl-3 text-[15px] leading-5 no-underline transition-colors duration-150 ${
                      spotlight.level === 3 ? "pl-6" : ""
                    } ${
                      isActive
                        ? "border-accent font-medium text-accent"
                        : "border-transparent text-muted hover:text-fg"
                    }`}
                  >
                    {spotlight.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {active.callout && (
          <div
            key={active.id}
            className={`spotlight-in flex shrink-0 flex-col gap-2 rounded-md border-l-4 bg-surface/60 p-4 ${calloutAccent[active.callout.variant]}`}
          >
            <span className="flex items-center gap-2 text-[13px] font-semibold tracking-wide text-muted uppercase">
              <span
                className={`h-3.5 w-3.5 ${
                  active.callout.variant === "tip"
                    ? "text-green-600"
                    : active.callout.variant === "warning"
                      ? "text-amber-600"
                      : "text-accent"
                }`}
              >
                {calloutIcon[active.callout.variant]}
              </span>
              {calloutLabel[active.callout.variant]} for this section
            </span>
            <p className="text-[15px] leading-6 text-body">{renderInline(active.callout.text)}</p>
          </div>
        )}
      </div>
    </aside>,
    document.body,
  );
}
