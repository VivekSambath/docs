import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { search, type SearchResult } from "./searchIndex";
import { SearchIcon } from "./illustrations";

/** True on Mac/iOS — used to label the trigger with the right modifier glyph. */
const isApple = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent);

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [lastQuery, setLastQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = search(query);

  // Reset the active row whenever the query changes, without a separate
  // effect — derived during render (React Compiler flags setState-in-effect).
  if (query !== lastQuery) {
    setLastQuery(query);
    setActiveIndex(0);
  }

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isTypingTarget =
        event.target instanceof HTMLElement &&
        (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA" || event.target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
        return;
      }
      if (event.key === "/" && !isTypingTarget) {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(result: SearchResult) {
    navigate(result.href);
    close();
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      go(results[activeIndex]);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted transition-colors duration-150 hover:border-fg hover:text-fg"
      >
        <SearchIcon className="h-4 w-4 shrink-0" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-sans text-xs text-muted sm:inline">
          {isApple ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-30 flex items-start justify-center bg-fg/20 px-4 pt-24" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="w-full max-w-lg rounded-lg border border-border bg-bg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <SearchIcon className="h-4 w-4 shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                type="text"
                placeholder="Search articles and CSS docs…"
                className="min-w-0 flex-1 bg-transparent text-base text-fg placeholder:text-muted focus:outline-none"
              />
              <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 text-xs text-muted">Esc</kbd>
            </div>

            <ul className="max-h-80 overflow-y-auto py-2">
              {query.trim() === "" && (
                <li className="px-4 py-6 text-center text-sm text-muted">Start typing to search.</li>
              )}
              {query.trim() !== "" && results.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-muted">No results for “{query}”.</li>
              )}
              {results.map((result, index) => (
                <li key={result.href}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => go(result)}
                    className={`flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition-colors duration-150 ${
                      index === activeIndex ? "bg-surface" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-fg">{result.title}</span>
                      <span className="text-xs uppercase tracking-wide text-muted">{result.category}</span>
                    </span>
                    <span className="truncate text-sm text-muted">{result.excerpt}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
