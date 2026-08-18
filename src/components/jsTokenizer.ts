// Synchronous, single-pass JS tokenizer for the playground's live editor
// overlay. Shiki (used everywhere else on the site for code blocks) loads
// its grammar via wasm and highlights asynchronously — fine for static
// content, but re-highlighting on every keystroke needs something that
// returns immediately with no flicker. This is intentionally small: no AST,
// just enough regex classification to make `yield` and friends pop visually
// while the reader edits.

const TOKEN_RE =
  /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(`(?:\\.|\$\{[^}]*\}|[^`\\])*`)|('(?:\\.|[^'\\])*')|("(?:\\.|[^"\\])*")|(\b\d+\.?\d*\b)|([a-zA-Z_$][\w$]*)/gm;

const CONTROL_KEYWORDS = new Set([
  "if", "else", "for", "while", "do", "switch", "case", "break", "continue",
  "return", "yield", "throw", "try", "catch", "finally", "default", "in", "of",
]);

const KEYWORDS = new Set([
  "function", "const", "let", "var", "new", "class", "extends", "typeof",
  "instanceof", "this", "super", "import", "export", "from", "as", "async",
  "await", "static", "get", "set", "delete", "void", "true", "false", "null",
  "undefined", "NaN", "Infinity",
]);

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function classify(identifier: string, source: string, matchEnd: number): string | null {
  if (CONTROL_KEYWORDS.has(identifier)) return "tok-ctrl";
  if (KEYWORDS.has(identifier)) return "tok-kw";
  if (/[A-Z]/.test(identifier[0]) && identifier.length > 1) return "tok-class";
  const lookahead = source.slice(matchEnd, matchEnd + 20);
  if (/^\s*\(/.test(lookahead)) return "tok-fn";
  return null;
}

/** Highlights `source` into an HTML string of `<span class="tok-*">` runs, for the editor overlay. */
export function highlightForEditor(source: string): string {
  let html = "";
  let lastIndex = 0;
  TOKEN_RE.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = TOKEN_RE.exec(source))) {
    html += escapeHtml(source.slice(lastIndex, match.index));

    const [full, lineComment, blockComment, template, single, double, number, identifier] = match;
    let className: string | null = null;
    if (lineComment !== undefined || blockComment !== undefined) className = "tok-com";
    else if (template !== undefined || single !== undefined || double !== undefined) className = "tok-str";
    else if (number !== undefined) className = "tok-num";
    else if (identifier !== undefined) className = classify(identifier, source, TOKEN_RE.lastIndex);

    html += className ? `<span class="${className}">${escapeHtml(full)}</span>` : escapeHtml(full);
    lastIndex = TOKEN_RE.lastIndex;
  }
  html += escapeHtml(source.slice(lastIndex));
  return html;
}
