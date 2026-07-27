import { AccentIcon, ArrowUpIcon } from "./illustrations";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-border px-6 py-6 text-sm text-muted">
      <span className="flex items-center gap-2">
        <AccentIcon className="h-3.5 w-3.5 text-accent" />
        &copy; {new Date().getFullYear()} Web Docs
      </span>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="group flex items-center gap-1.5 no-underline transition-colors duration-150 hover:text-fg"
      >
        Back to top
        <ArrowUpIcon className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:-translate-y-0.5" />
      </button>
    </footer>
  );
}
