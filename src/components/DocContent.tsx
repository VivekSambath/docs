import { useState } from "react";
import type { ReactNode } from "react";
import type { DocSection } from "../content/articles";
import { slugify } from "./docToc";
import Reveal from "./Reveal";

const calloutLabel: Record<string, string> = {
  tip: "Tip",
  note: "Note",
  warning: "Warning",
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
      <div className="flex items-center justify-between rounded-t-md border border-b-0 border-neutral-200 bg-neutral-100 px-4 py-2 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <span className="font-mono uppercase tracking-wide">{language}</span>
        {label && (
          <span className="font-medium">
            {label === "Bad" ? "✕ Bad" : "✓ Good"}
          </span>
        )}
      </div>
      <pre
        className={`overflow-x-auto border-x border-t border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900 ${tailwind ? "" : "rounded-b-md border-b"}`}
      >
        <code className="font-mono">{code}</code>
      </pre>
      {tailwind && (
        <pre className="overflow-x-auto rounded-b-md border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900">
          <code className="font-mono text-neutral-500 dark:text-neutral-400">
            <span className="mr-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
              Tailwind
            </span>
            {tailwind}
          </code>
        </pre>
      )}
      {caption && (
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">{caption}</p>
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
          className="mb-3 inline-flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors duration-150 hover:bg-neutral-950 hover:text-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-50 dark:hover:text-neutral-950"
        >
          <span aria-hidden="true">{on ? "☑" : "☐"}</span>
          {toggle.label}
        </button>
      )}
      <div className={`grid gap-6 ${gridClass}`}>
        {panes.map((pane, paneIndex) => (
          <div key={paneIndex} className="min-w-0">
            <div className="flex items-center justify-between rounded-t-md border border-b-0 border-neutral-200 bg-neutral-100 px-4 py-2 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <span className="font-medium">{pane.label}</span>
              {pane.status && (
                <span className="font-medium">{demoStatusLabel[pane.status]}</span>
              )}
            </div>
            {pane.code && (
              <pre className="overflow-x-auto border-x border-t border-neutral-200 bg-neutral-50 p-3 text-xs dark:border-neutral-800 dark:bg-neutral-900">
                <code className="font-mono">{pane.code}</code>
              </pre>
            )}
            {pane.tailwind && (
              <pre className="overflow-x-auto border-x border-t border-neutral-200 bg-neutral-50 p-3 text-xs dark:border-neutral-800 dark:bg-neutral-900">
                <code className="font-mono text-neutral-500 dark:text-neutral-400">
                  <span className="mr-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-600">
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
              className="block w-full rounded-b-md border border-neutral-200 bg-neutral-50 dark:border-neutral-800"
            />
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function CaniuseEmbed({ feature, title, caption }: Extract<DocSection, { kind: "caniuse" }>) {
  return (
    <figure className="mt-8">
      <div className="flex items-center justify-between rounded-t-md border border-b-0 border-neutral-200 bg-neutral-100 px-4 py-2 text-xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
        <span className="font-medium">{title ?? feature}</span>
        <a
          href={`https://caniuse.com/${feature}`}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] underline decoration-neutral-400 underline-offset-2 hover:text-neutral-950 dark:hover:text-neutral-50"
        >
          caniuse.com ↗
        </a>
      </div>
      <iframe
        title={`Can I use: ${title ?? feature}`}
        src={`https://caniuse.bitsofco.de/embed/index.html?feat=${feature}&periods=future_1,current,past_1,past_2`}
        loading="lazy"
        style={{ height: 300 }}
        className="block w-full rounded-b-md border border-neutral-200 bg-white dark:border-neutral-800"
      />
      {caption && (
        <figcaption className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function MindMap({ root, branches, caption }: Extract<DocSection, { kind: "mindmap" }>) {
  return (
    <figure className="mt-8">
      <div className="flex flex-col items-center">
        <div className="rounded-md border border-neutral-950 bg-neutral-950 px-4 py-2 text-center text-sm font-semibold text-neutral-50 dark:border-neutral-50 dark:bg-neutral-50 dark:text-neutral-950">
          {root}
        </div>
        <div className="h-6 w-px bg-neutral-300 dark:bg-neutral-700" />
        <div className="mx-auto flex w-fit flex-wrap justify-center gap-x-8 gap-y-6 border-t border-neutral-300 dark:border-neutral-700">
          {branches.map((branch, branchIndex) => (
            <div key={branchIndex} className="flex w-44 flex-col items-center text-center">
              <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
              <div className="rounded-md border border-neutral-200 px-3 py-2 text-sm font-medium dark:border-neutral-800">
                {branch.label}
              </div>
              {branch.children && branch.children.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1">
                  {branch.children.map((child, childIndex) => (
                    <li key={childIndex} className="text-xs text-neutral-500 dark:text-neutral-400">
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
        <figcaption className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
          {caption}
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
                  ? "text-3xl"
                  : "mt-20 border-t border-neutral-200 pt-10 text-3xl dark:border-neutral-800"
                : "mt-10 text-xl";
            const headingContent = numbered ? (
              <span className="flex items-center gap-4">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent font-mono text-base font-semibold text-accent">
                  {numbered[1]}
                </span>
                <span>{numbered[2]}</span>
              </span>
            ) : (
              section.text
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
                className="mt-8 max-w-prose text-neutral-700 dark:text-neutral-300"
              >
                {section.text}
              </p>
            );

          case "ascii":
            return (
              <figure key={index} className="mt-6">
                <pre className="overflow-x-auto rounded-md border border-neutral-200 bg-neutral-100/60 p-4 font-mono text-xs leading-relaxed text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300">
                  {section.art}
                </pre>
                {section.caption && (
                  <figcaption className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                    {section.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "code":
            return <CodeBlock key={index} {...section} />;

          case "demo":
            return <DemoBlock key={index} {...section} />;

          case "mindmap":
            return <MindMap key={index} {...section} />;

          case "caniuse":
            return <CaniuseEmbed key={index} {...section} />;

          case "callout":
            return (
              <div
                key={index}
                className="mt-8 flex gap-3 rounded-md border-l-4 border-neutral-950 bg-neutral-100/60 py-3 pl-4 pr-4 dark:border-neutral-50 dark:bg-neutral-900/60"
              >
                <span className="mt-0.5 h-4 w-4 shrink-0 text-neutral-950 dark:text-neutral-50">
                  {calloutIcon[section.variant]}
                </span>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  <span className="font-semibold text-neutral-950 dark:text-neutral-50">
                    {calloutLabel[section.variant]}:
                  </span>{" "}
                  {section.text}
                </p>
              </div>
            );

          case "list":
            return section.ordered ? (
              <ol key={index} className="mt-8 flex flex-col gap-2">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex gap-3 text-neutral-700 dark:text-neutral-300"
                  >
                    <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
                      {itemIndex + 1}.
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="mt-8 flex flex-col gap-2">
                {section.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex gap-3 text-neutral-700 dark:text-neutral-300"
                  >
                    <span className="text-neutral-400 dark:text-neutral-600">&bull;</span>
                    <span>{item}</span>
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
                    className="min-w-0 rounded-md border border-neutral-200 p-4 dark:border-neutral-800"
                  >
                    <p className="mb-3 text-sm font-semibold text-neutral-950 dark:text-neutral-50">
                      {side.label}
                    </p>
                    {side.code && (
                      <pre className="mb-3 overflow-x-auto rounded-md border border-neutral-200 bg-neutral-100/60 p-3 text-xs dark:border-neutral-800 dark:bg-neutral-900/60">
                        <code className="font-mono">{side.code}</code>
                      </pre>
                    )}
                    <ul className="flex flex-col gap-1.5">
                      {side.points.map((point, pointIndex) => (
                        <li
                          key={pointIndex}
                          className="flex gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                        >
                          <span className="text-neutral-400 dark:text-neutral-600">&bull;</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );

          case "table":
            return (
              <div key={index} className="mt-8 overflow-x-auto rounded-md border border-neutral-200 dark:border-neutral-800">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800">
                      {section.headers.map((header, headerIndex) => (
                        <th
                          key={headerIndex}
                          className="px-4 py-2 text-left font-semibold text-neutral-950 dark:text-neutral-50"
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
                        className="border-b border-neutral-200 last:border-b-0 dark:border-neutral-800"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-2 text-neutral-700 dark:text-neutral-300"
                          >
                            {cell}
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
