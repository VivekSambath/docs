import type { ComponentPropsWithoutRef } from "react";
import { Link, type LinkProps } from "react-router-dom";

type CommonProps = {
  variant?: "solid" | "outline" | "shadow";
};

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium no-underline transition-colors duration-150";

const variants = {
  solid:
    "border border-neutral-950 bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-950 dark:hover:text-neutral-50",
  outline:
    "border border-neutral-950 bg-transparent text-neutral-950 hover:bg-neutral-950 hover:text-neutral-50 dark:border-neutral-50 dark:text-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-950",
  shadow:
    "border-0 bg-neutral-50 text-neutral-950 shadow-lg shadow-neutral-950/20 transition-shadow hover:shadow-md dark:bg-neutral-900 dark:text-neutral-50 dark:shadow-black/60",
};

type ButtonAsLink = CommonProps & LinkProps;
type ButtonAsButton = CommonProps & ComponentPropsWithoutRef<"button">;

const cx = (variant: CommonProps["variant"] = "outline", className = "") =>
  `${base} ${variants[variant]} ${className}`.trim();

export function Button({ variant, className, ...props }: ButtonAsButton) {
  return <button className={cx(variant, className)} {...props} />;
}

export function LinkButton({ variant, className, ...props }: ButtonAsLink) {
  return <Link className={cx(variant, className)} {...props} />;
}
