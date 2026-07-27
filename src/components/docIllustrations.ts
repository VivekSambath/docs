import type { JSX } from "react";
import {
  ContrastIllustration,
  BleedIllustration,
  ReadingIllustration,
  TouchIllustration,
} from "./illustrations";

/** Maps each doc article's slug to its illustration, for cards and headers. */
export const docIllustrations: Record<
  string,
  (props: { className?: string }) => JSX.Element
> = {
  "design-principles": ContrastIllustration,
  "full-bleed-css": BleedIllustration,
  "reading-disabilities": ReadingIllustration,
  "touch-events": TouchIllustration,
};
