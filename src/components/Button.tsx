import type { ComponentPropsWithoutRef } from "react";
import { Link, type LinkProps } from "react-router-dom";

type CommonProps = {
  variant?: "solid" | "outline";
};

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium no-underline transition-colors duration-150";

const variants = {
  solid: "border border-fg bg-fg text-fg-invert hover:bg-fg-invert hover:text-fg",
  outline: "border border-fg bg-transparent text-fg hover:bg-fg hover:text-fg-invert",
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
