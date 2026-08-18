import type { JSX } from "react";
import { PauseResumeIcon, BranchLightIcon, BulbIcon } from "./illustrations";

/** Maps each JS doc's slug to its illustration, for cards and headers. */
export const jsDocIllustrations: Record<
  string,
  (props: { className?: string }) => JSX.Element
> = {
  generators: PauseResumeIcon,
  "generator-methods": BranchLightIcon,
  "generator-tips": BulbIcon,
};
