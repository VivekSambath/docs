import { useState } from "react";
import { Link } from "react-router-dom";
import { tips } from "../content/tips";
import { BulbIcon, CloseIcon } from "./illustrations";

const DISMISS_KEY = "tip-widget-dismissed";

function pickTip() {
  return tips[Math.floor(Math.random() * tips.length)];
}

function getInitialDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export default function TipWidget() {
  const [tip] = useState(pickTip);
  const [dismissed, setDismissed] = useState(getInitialDismissed);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // storage may be unavailable (e.g. a sandboxed preview) — dismissal just won't persist
    }
  }

  if (dismissed) return null;

  return (
    <div className="flex gap-3 rounded-md border-l-4 border-fg bg-surface/60 py-3 pl-4 pr-3">
      <span className="mt-0.5 h-4 w-4 shrink-0 text-fg">
        <BulbIcon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-base text-body">
          <span className="font-semibold text-fg">Did you know:</span>{" "}
          <Link
            to={`/articles/design-principles#${tip.anchor}`}
            className="text-fg underline decoration-divider underline-offset-2 hover:decoration-fg"
          >
            {tip.title}
          </Link>
          {" — "}
          {tip.body}
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss tip"
        className="h-5 w-5 shrink-0 self-start text-muted transition-colors duration-150 hover:text-fg"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
