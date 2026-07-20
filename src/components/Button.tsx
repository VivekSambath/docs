import type { ComponentPropsWithoutRef } from "react";
import { Link, type LinkProps } from "react-router-dom";

type CommonProps = {
  variant?: "solid" | "outline";
};

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-neutral-950 px-5 py-3 text-sm font-medium no-underline transition-colors duration-150 dark:border-neutral-50";

const variants = {
  solid:
    "bg-neutral-950 text-neutral-50 hover:bg-neutral-50 hover:text-neutral-950 dark:bg-neutral-50 dark:text-neutral-950 dark:hover:bg-neutral-950 dark:hover:text-neutral-50",
  outline:
    "bg-transparent text-neutral-950 hover:bg-neutral-950 hover:text-neutral-50 dark:text-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-950",
};

type ButtonAsLink = CommonProps & LinkProps;
type ButtonAsButton = CommonProps & ComponentPropsWithoutRef<"button">;

export function Button({
  variant = "outline",
  className = "",
  ...props
}: ButtonAsButton) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...props}
    />
  );
}

export function LinkButton({
  variant = "outline",
  className = "",
  ...props
}: ButtonAsLink) {
  return (
    <Link
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
