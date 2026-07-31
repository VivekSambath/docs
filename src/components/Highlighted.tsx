import { useEffect, useState } from "react";
import { highlight } from "./highlighter";

/**
 * Syntax-highlighted code via Shiki (VS Code's own highlighter/themes).
 * Shiki emits its own <pre><code> (needed for its per-token dual-theme CSS
 * vars — see global.css's .shiki rules), so this replaces the plain
 * <pre><code> a call site would otherwise render, not wrap it. Renders the
 * plain string first and swaps in tokenized HTML once the highlighter
 * loads, so first paint isn't blocked on the wasm grammar engine.
 */
export default function Highlighted({
  code,
  language,
  preClassName,
}: {
  code: string;
  language: string;
  preClassName: string;
}) {
  const [result, setResult] = useState<{ code: string; language: string; html: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    highlight(code, language).then((html) => {
      if (!cancelled) setResult({ code, language, html });
    });
    return () => {
      cancelled = true;
    };
  }, [code, language]);

  const html = result?.code === code && result.language === language ? result.html : null;

  if (!html) {
    return (
      <pre className={preClassName}>
        <code className="font-mono">{code}</code>
      </pre>
    );
  }

  // Shiki's own <pre class="shiki"> supplies syntax colors (see global.css);
  // preClassName still applies the site's layout/border/padding/scroll
  // chrome on the wrapper, same as the plain-text fallback above.
  return (
    <div className={`${preClassName} font-mono`} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
