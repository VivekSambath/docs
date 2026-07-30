import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { DocDemoPaneEditable, DocSection } from "../content/articles";
import { slugify } from "./docToc";
import { renderInline } from "./inline";
import Reveal from "./Reveal";

const calloutLabel: Record<string, string> = {
  tip: "Tip",
  note: "Note",
  warning: "Warning",
};

const calloutAccent: Record<string, string> = {
  tip: "border-green-600/70",
  note: "border-accent",
  warning: "border-amber-500/80",
};

// Small monochrome line icons — stroke-only (no fills) to match the site's
// flat, shadow-free visual language; they inherit color via currentColor.
const calloutIcon: Record<string, ReactNode> = {
  tip: (
    <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden="true">
      <path d="M6 14.5h4" strokeLinecap="round" />
      <path d="M6.5 12.5h3" strokeLinecap="round" />
      <path d="M8 1.5a4.5 4.5 0 0 0-2.5 8.25c.5.35.75.9.75 1.4v.35h3.5v-.35c0-.5.25-1.05.75-1.4A4.5 4.5 0 0 0 8 1.5Z" strokeLinejoin="round" />
    </svg>
  ),
  note: (
    <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M8 7.25v4" strokeLinecap="round" />
      <circle cx="8" cy="4.9" r="0.15" fill="currentColor" stroke="none" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 16 16" fill="none" strokeWidth="1.4" stroke="currentColor" aria-hidden="true">
      <path d="M8 1.75 14.75 13.5H1.25L8 1.75Z" strokeLinejoin="round" />
      <path d="M8 6.5v3.25" strokeLinecap="round" />
      <circle cx="8" cy="11.75" r="0.15" fill="currentColor" stroke="none" />
    </svg>
  ),
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard may be unavailable (e.g. a sandboxed preview) — button just does nothing
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy code"}
      className={`inline-flex items-center gap-1.5 rounded border border-transparent px-1.5 py-0.5 font-medium transition-colors duration-150 ${copied ? "text-green-600" : "text-muted hover:border-border hover:text-fg"}`}
    >
      {copied ? (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="m3 8.5 3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
          <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
          <path d="M10.5 3.5v-1a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h1" strokeLinecap="round" />
        </svg>
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/**
 * Hover "#" button on section headings — scrolls the heading into view and
 * copies a shareable deep link. Built as a button (not a native <a href="#id">)
 * because the hash router owns location.hash: the deep-link format is
 * origin/path#/route#heading-id, which Article.tsx resolves manually.
 */
function HeadingAnchor({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    const [base, route = ""] = window.location.href.split("#");
    navigator.clipboard
      .writeText(`${base}#${route}#${id}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => {
        // clipboard unavailable — scrolling still happened, which is the main job
      });
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy link to this section"
      title="Copy link to this section"
      className={`ml-3 align-middle font-mono text-[0.6em] font-normal transition-[opacity,color] duration-150 focus-visible:opacity-100 ${copied ? "text-green-600 opacity-100" : "text-accent opacity-0 hover:text-accent-hover group-hover:opacity-100"}`}
    >
      {copied ? "✓ copied" : "#"}
    </button>
  );
}

function CodeBlock({
  language,
  code,
  label,
  caption,
  tailwind,
}: {
  language: string;
  code: string;
  label?: "Bad" | "Good";
  caption?: string;
  tailwind?: string;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between rounded-t-md border border-b-0 border-border bg-surface px-4 py-2 text-xs text-muted">
        <span className="font-mono uppercase tracking-wide">{language}</span>
        <span className="flex items-center gap-3">
          {label && (
            <span className="font-medium">
              {label === "Bad" ? "✕ Bad" : "✓ Good"}
            </span>
          )}
          <CopyButton text={code} />
        </span>
      </div>
      <pre
        className={`overflow-x-auto border-x border-t border-border bg-bg p-4 text-base ${tailwind ? "" : "rounded-b-md border-b"}`}
      >
        <code className="font-mono">{code}</code>
      </pre>
      {tailwind && (
        <pre className="overflow-x-auto rounded-b-md border border-border bg-bg p-4 text-base">
          <code className="font-mono text-muted">
            <span className="mr-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
              Tailwind
            </span>
            {tailwind}
          </code>
        </pre>
      )}
      {caption && (
        <p className="mt-2 text-base text-muted">{renderInline(caption)}</p>
      )}
    </div>
  );
}

const demoStatusLabel: Record<"bad" | "good", string> = {
  bad: "✕ Bad",
  good: "✓ Good",
};

function DemoBlock({ panes, toggle, height = 220, caption }: Extract<DocSection, { kind: "demo" }>) {
  const [on, setOn] = useState(toggle?.defaultOn ?? true);
  const gridClass =
    panes.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : panes.length === 2 ? "sm:grid-cols-2" : "";

  return (
    <figure className="mt-8">
      {toggle && (
        <button
          type="button"
          onClick={() => setOn((current) => !current)}
          aria-pressed={on}
          className="mb-3 inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-body transition-colors duration-150 hover:bg-fg hover:text-fg-invert"
        >
          <span aria-hidden="true">{on ? "☑" : "☐"}</span>
          {toggle.label}
        </button>
      )}
      <div className={`grid gap-6 ${gridClass}`}>
        {panes
          .filter((pane): pane is Extract<typeof pane, { editable?: false }> => !pane.editable)
          .map((pane, paneIndex) => (
          <div
            key={paneIndex}
            className={`min-w-0 overflow-hidden rounded-md border border-border ${pane.status === "bad" ? "border-t-2 border-t-red-500/70" : pane.status === "good" ? "border-t-2 border-t-green-600/70" : ""}`}
          >
            <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2 text-sm text-muted">
              <span className="font-medium text-body">{pane.label}</span>
              {pane.status && (
                <span className="font-medium">{demoStatusLabel[pane.status]}</span>
              )}
            </div>
            {pane.code && (
              <pre className="overflow-x-auto border-b border-border bg-bg p-3 text-base">
                <code className="font-mono">{pane.code}</code>
              </pre>
            )}
            {pane.tailwind && (
              <pre className="overflow-x-auto border-b border-border bg-bg p-3 text-base">
                <code className="font-mono text-muted">
                  <span className="mr-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Tailwind
                  </span>
                  {pane.tailwind}
                </code>
              </pre>
            )}
            <iframe
              key={String(on)}
              title={pane.label}
              srcDoc={pane.html(on)}
              sandbox=""
              style={{ height }}
              className="block w-full bg-bg"
            />
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-2 text-base text-muted">
          {renderInline(caption)}
        </figcaption>
      )}
    </figure>
  );
}

// Wraps an editable pane's raw htmlSource/cssSource into a full document for
// the sandboxed iframe. Kept deliberately minimal (box-sizing reset + system
// font) so the reader's CSS is the only thing controlling the result.
function buildEditableDoc(htmlSource: string, cssSource: string) {
  return `<!doctype html>
<html>
<head>
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; }
  body { font: 14px/1.5 system-ui, sans-serif; color: #171717; background: #fff; padding: 16px; }
${cssSource}
</style>
</head>
<body>
${htmlSource}
</body>
</html>`;
}

function EditablePane({ pane, on }: { pane: DocDemoPaneEditable; on: boolean }) {
  const original = pane.onSource && on
    ? { htmlSource: pane.onSource.htmlSource ?? pane.htmlSource, cssSource: pane.onSource.cssSource }
    : { htmlSource: pane.htmlSource, cssSource: pane.cssSource };

  const [htmlSource, setHtmlSource] = useState(original.htmlSource);
  const [cssSource, setCssSource] = useState(original.cssSource);
  const [dirty, setDirty] = useState(false);
  const [lastOn, setLastOn] = useState(on);

  // Toggle flipped and the reader hasn't hand-edited yet — load the new preset.
  if (on !== lastOn) {
    setLastOn(on);
    if (!dirty) {
      setHtmlSource(original.htmlSource);
      setCssSource(original.cssSource);
    }
  }

  const srcDoc = useMemo(() => buildEditableDoc(htmlSource, cssSource), [htmlSource, cssSource]);

  function reset() {
    setHtmlSource(original.htmlSource);
    setCssSource(original.cssSource);
    setDirty(false);
  }

  const editorClass =
    "block w-full resize-y overflow-auto border-x border-border bg-bg p-3 font-mono text-sm text-body focus:outline-none focus:bg-surface/40";

  const statusAccent =
    pane.status === "bad"
      ? "border-t-2 border-t-red-500/70"
      : pane.status === "good"
        ? "border-t-2 border-t-green-600/70"
        : "";

  return (
    <div className={`min-w-0 overflow-hidden rounded-md border border-border ${statusAccent}`}>
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2 text-sm text-muted">
        <span className="font-medium text-body">{pane.label}</span>
        <div className="flex items-center gap-3">
          {pane.status && <span className="font-medium">{demoStatusLabel[pane.status]}</span>}
          {dirty && (
            <button
              type="button"
              onClick={reset}
              className="rounded border border-border px-2 py-0.5 text-xs font-medium text-body transition-colors duration-150 hover:bg-fg hover:text-fg-invert"
            >
              ↺ Reset
            </button>
          )}
        </div>
      </div>
      <label className="flex items-center gap-1.5 border-t border-border bg-surface/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
        HTML
      </label>
      <textarea
        spellCheck={false}
        value={htmlSource}
        onChange={(event) => {
          setDirty(true);
          setHtmlSource(event.target.value);
        }}
        rows={Math.min(8, Math.max(2, htmlSource.split("\n").length))}
        className={editorClass}
      />
      <label className="flex items-center gap-1.5 border-t border-border bg-surface/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
        CSS
      </label>
      <textarea
        spellCheck={false}
        value={cssSource}
        onChange={(event) => {
          setDirty(true);
          setCssSource(event.target.value);
        }}
        rows={Math.min(10, Math.max(2, cssSource.split("\n").length))}
        className={editorClass}
      />
      {pane.tailwind && (
        <pre className="overflow-x-auto border-x border-t border-border bg-bg p-3 text-sm">
          <code className="font-mono text-muted">
            <span className="mr-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
              Tailwind
            </span>
            {pane.tailwind}
          </code>
        </pre>
      )}
      <div className="flex items-center gap-1.5 border-t border-border bg-surface/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-green-600" />
        Live preview
      </div>
      <iframe
        title={pane.label}
        srcDoc={srcDoc}
        sandbox=""
        style={{ height: 220 }}
        className="block w-full bg-bg"
      />
    </div>
  );
}

function EditableDemoBlock({ panes, toggle, caption }: Extract<DocSection, { kind: "demo" }>) {
  const [on, setOn] = useState(toggle?.defaultOn ?? true);
  const gridClass =
    panes.length >= 3 ? "sm:grid-cols-2 lg:grid-cols-3" : panes.length === 2 ? "sm:grid-cols-2" : "";

  return (
    <figure className="mt-8">
      {toggle && (
        <button
          type="button"
          onClick={() => setOn((current) => !current)}
          aria-pressed={on}
          className="mb-3 inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-body transition-colors duration-150 hover:bg-fg hover:text-fg-invert"
        >
          <span aria-hidden="true">{on ? "☑" : "☐"}</span>
          {toggle.label}
        </button>
      )}
      <div className={`grid gap-6 ${gridClass}`}>
        {panes.map((pane, paneIndex) =>
          pane.editable ? (
            <EditablePane key={paneIndex} pane={pane} on={on} />
          ) : (
            <div
              key={paneIndex}
              className={`min-w-0 overflow-hidden rounded-md border border-border ${pane.status === "bad" ? "border-t-2 border-t-red-500/70" : pane.status === "good" ? "border-t-2 border-t-green-600/70" : ""}`}
            >
              <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2 text-sm text-muted">
                <span className="font-medium text-body">{pane.label}</span>
                {pane.status && <span className="font-medium">{demoStatusLabel[pane.status]}</span>}
              </div>
              {pane.code && (
                <pre className="overflow-x-auto border-b border-border bg-bg p-3 text-sm">
                  <code className="font-mono">{pane.code}</code>
                </pre>
              )}
              {pane.tailwind && (
                <pre className="overflow-x-auto border-b border-border bg-bg p-3 text-sm">
                  <code className="font-mono text-muted">
                    <span className="mr-2 text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Tailwind
                    </span>
                    {pane.tailwind}
                  </code>
                </pre>
              )}
              <iframe
                key={String(on)}
                title={pane.label}
                srcDoc={pane.html(on)}
                sandbox=""
                style={{ height: 220 }}
                className="block w-full bg-bg"
              />
            </div>
          ),
        )}
      </div>
      {caption && <figcaption className="mt-2 text-base text-muted">{renderInline(caption)}</figcaption>}
    </figure>
  );
}

function CaniuseEmbed({ feature, title, caption, variant = "embed" }: Extract<DocSection, { kind: "caniuse" }>) {
  return (
    <figure className="mt-8">
      <div className="flex items-center justify-between rounded-t-md border border-b-0 border-border bg-surface px-4 py-2 text-xs text-muted">
        <span className="font-medium">{title ?? feature}</span>
        <a
          href={`https://caniuse.com/${feature}`}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] underline decoration-neutral-400 underline-offset-2 hover:text-fg"
        >
          caniuse.com ↗
        </a>
      </div>
      {variant === "image" ? (
        <img
          alt={`Can I use: ${title ?? feature} — browser support table`}
          src={`https://caniuse.bitsofco.de/image/${feature}.png`}
          loading="lazy"
          className="block w-full rounded-b-md border border-border bg-white"
        />
      ) : variant === "link" ? (
        <a
          href={`https://caniuse.com/${feature}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-4 rounded-b-md border border-border bg-bg px-4 py-4 no-underline transition-colors duration-150 hover:bg-surface"
        >
          <span className="text-base text-body">
            View live browser support data for{" "}
            <span className="font-mono font-medium text-fg">{title ?? feature}</span>{" "}
            on caniuse.com
          </span>
          <span aria-hidden="true" className="shrink-0 text-muted">
            &rarr;
          </span>
        </a>
      ) : (
        <iframe
          title={`Can I use: ${title ?? feature}`}
          src={`https://caniuse.bitsofco.de/embed/index.html?feat=${feature}&periods=future_1,current,past_1,past_2`}
          loading="lazy"
          style={{ height: 300 }}
          className="block w-full rounded-b-md border border-border bg-white"
        />
      )}
      {caption && (
        <figcaption className="mt-2 text-base text-muted">
          {renderInline(caption)}
        </figcaption>
      )}
    </figure>
  );
}

function MindMap({ root, branches, caption }: Extract<DocSection, { kind: "mindmap" }>) {
  return (
    <figure className="mt-8">
      <div className="flex flex-col items-center">
        <div className="rounded-md border border-fg bg-fg px-4 py-2 text-center text-sm font-semibold text-fg-invert">
          {root}
        </div>
        <div className="h-6 w-px bg-divider" />
        <div className="mx-auto flex w-fit flex-wrap justify-center gap-x-8 gap-y-6 border-t border-divider">
          {branches.map((branch, branchIndex) => (
            <div key={branchIndex} className="flex w-44 flex-col items-center text-center">
              <div className="h-4 w-px bg-divider" />
              <div className="rounded-md border border-border px-3 py-2 text-sm font-medium">
                {branch.label}
              </div>
              {branch.children && branch.children.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1">
                  {branch.children.map((child, childIndex) => (
                    <li key={childIndex} className="text-xs text-muted">
                      {child}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-6 text-center text-sm text-muted">
          {renderInline(caption)}
        </figcaption>
      )}
    </figure>
  );
}

export default function DocContent({ sections }: { sections: DocSection[] }) {
  return (
    <div className="flex flex-col">
      {sections.map((section, index) => {
        const content = (() => {
          switch (section.kind) {
          case "heading": {
            const id = slugify(section.text);
            const level = section.level ?? 2;
            // Doc articles that number their sections (e.g. "12. Rule text")
            // get the number pulled out into its own accent-ringed badge;
            // anything else (including h3s) renders as plain heading text.
            const numbered = level === 2 ? /^(\d+)\.\s+(.+)$/.exec(section.text) : null;
            // Each section now renders inside its own <Reveal> wrapper (see
            // below), so a heading is always its wrapper's only child —
            // CSS `first:` no longer identifies "the first section in the
            // article" like it did when headings were direct flex-col
            // siblings. Use the map index instead.
            const className =
              level === 2
                ? index === 0
                  ? "group text-3xl"
                  : "group mt-20 border-t border-border pt-10 text-3xl"
                : "group mt-10 text-xl";
            const headingContent = numbered ? (
              <span className="flex items-center gap-4">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent font-mono text-base font-semibold text-accent">
                  {numbered[1]}
                </span>
                <span>
                  {numbered[2]}
                  <HeadingAnchor id={id} />
                </span>
              </span>
            ) : (
              <>
                {section.text}
                <HeadingAnchor id={id} />
              </>
            );
            return level === 2 ? (
              <h2 key={index} id={id} className={className}>
                {headingContent}
              </h2>
            ) : (
              <h3 key={index} id={id} className={className}>
                {headingContent}
              </h3>
            );
          }

          case "paragraph":
            return (
              <p
                key={index}
                className="mt-8 max-w-prose text-body"
              >
                {renderInline(section.text)}
              </p>
            );

          case "ascii":
            return (
              <figure key={index} className="mt-6">
                <pre className="overflow-x-auto rounded-md border border-border bg-surface/60 p-4 font-mono text-sm leading-relaxed text-body">
                  {section.art}
                </pre>
                {section.caption && (
                  <figcaption className="mt-2 text-base text-muted">
                    {renderInline(section.caption)}
                  </figcaption>
                )}
              </figure>
            );

          case "code":
            return <CodeBlock key={index} {...section} />;

          case "demo":
            return section.panes.some((pane) => pane.editable) ? (
              <EditableDemoBlock key={index} {...section} />
            ) : (
              <DemoBlock key={index} {...section} />
            );

          case "mindmap":
            return <MindMap key={index} {...section} />;

          case "caniuse":
            return <CaniuseEmbed key={index} {...section} />;

          case "callout":
            return (
              <div
                key={index}
                className={`mt-8 flex gap-3 rounded-md border-l-4 bg-surface/60 py-3 pl-4 pr-4 ${calloutAccent[section.variant]}`}
              >
                <span className={`mt-0.5 h-4 w-4 shrink-0 ${section.variant === "tip" ? "text-green-600" : section.variant === "warning" ? "text-amber-600" : "text-accent"}`}>
                  {calloutIcon[section.variant]}
                </span>
                <p className="text-base text-body">
                  <span className="font-semibold text-fg">
                    {calloutLabel[section.variant]}:
                  </span>{" "}
                  {renderInline(section.text)}
                </p>
              </div>
            );

          case "list":
            return section.ordered ? (
              <ol key={index} className="mt-8 flex flex-col gap-2">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex gap-3 text-body"
                  >
                    <span className="font-mono text-base text-muted">
                      {itemIndex + 1}.
                    </span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="mt-8 flex flex-col gap-2">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex gap-3 text-body"
                  >
                    <span className="text-muted">&bull;</span>
                    <span>{renderInline(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case "comparison":
            return (
              <div key={index} className="mt-8 grid gap-6 sm:grid-cols-2">
                {[section.before, section.after].map((side, sideIndex) => (
                  <div
                    key={sideIndex}
                    className={`min-w-0 rounded-md border border-border p-4 border-t-2 ${sideIndex === 0 ? "border-t-red-500/70" : "border-t-green-600/70"}`}
                  >
                    <p className="mb-3 text-base font-semibold text-fg">
                      {side.label}
                    </p>
                    {side.code && (
                      <pre className="mb-3 overflow-x-auto rounded-md border border-border bg-surface/60 p-3 text-sm">
                        <code className="font-mono">{side.code}</code>
                      </pre>
                    )}
                    <ul className="flex flex-col gap-1.5">
                      {side.points.map((point, pointIndex) => (
                        <li
                          key={pointIndex}
                          className="flex gap-2 text-base text-body"
                        >
                          <span className="text-muted">&bull;</span>
                          <span>{renderInline(point)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );

          case "table":
            return (
              <div key={index} className="mt-8 overflow-x-auto rounded-md border border-border">
                <table className="w-full border-collapse text-base">
                  <thead>
                    <tr className="border-b border-border bg-surface">
                      {section.headers.map((header, headerIndex) => (
                        <th
                          key={headerIndex}
                          className="px-4 py-2 text-left font-semibold text-fg"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="border-b border-border last:border-b-0 hover:bg-surface/60"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-2 text-body"
                          >
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

            default:
              return null;
          }
        })();

        return (
          <Reveal key={index}>
            {content}
          </Reveal>
        );
      })}
    </div>
  );
}
