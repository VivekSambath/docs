import type { ReactNode } from "react";

/*
 * Mini inline-markup renderer for prose strings in the DocSection content
 * model. Content stays plain strings (no JSX in content files); these tokens
 * become styled elements wherever prose renders (DocContent paragraphs,
 * lists, callouts, tables, comparison points, captions, rule bodies):
 *
 *   **text**        → <strong> — key terms, bolded
 *   `text`          → inline <code> chip — property/function/value names
 *   ==text==        → <mark> with a translucent accent wash — the one line
 *                     to remember from a section
 *   __text__        → accent underline — important phrases that aren't links
 *   [label](https…) → external link, accent + underline, opens in a new tab
 *
 * Tokens don't nest. Strings without any marker char return unchanged, so
 * existing content pays no cost.
 */

const INLINE_TOKEN =
  /\*\*(.+?)\*\*|`([^`]+)`|==(.+?)==|__(.+?)__|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

export function renderInline(text: string): ReactNode {
  if (!/[*`=_[]/.test(text)) return text;

  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_TOKEN)) {
    const index = match.index;
    if (index > last) nodes.push(text.slice(last, index));
    const [token, strong, code, mark, underline, linkLabel, linkHref] = match;

    if (strong !== undefined) {
      nodes.push(
        <strong key={index} className="font-semibold text-fg">
          {strong}
        </strong>,
      );
    } else if (code !== undefined) {
      nodes.push(
        <code
          key={index}
          className="rounded-sm border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.85em] text-fg"
        >
          {code}
        </code>,
      );
    } else if (mark !== undefined) {
      nodes.push(
        <mark key={index} className="rounded-sm bg-highlight px-1 text-fg">
          {mark}
        </mark>,
      );
    } else if (underline !== undefined) {
      nodes.push(
        <span
          key={index}
          className="underline decoration-accent decoration-2 underline-offset-4"
        >
          {underline}
        </span>,
      );
    } else if (linkLabel !== undefined) {
      nodes.push(
        <a
          key={index}
          href={linkHref}
          target="_blank"
          rel="noreferrer"
          className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors duration-150 hover:text-accent-hover hover:decoration-accent-hover"
        >
          {linkLabel}
        </a>,
      );
    } else {
      nodes.push(token);
    }
    last = index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));

  return nodes.length === 1 ? nodes[0] : nodes;
}
