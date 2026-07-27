import type { JSX } from "react";
import { SwatchIcon } from "./illustrations";

/** Maps each CSS doc's slug to its illustration, for cards and headers. */
export const cssDocIllustrations: Record<
  string,
  (props: { className?: string }) => JSX.Element
> = {
  "contrast-color": SwatchIcon,
};
