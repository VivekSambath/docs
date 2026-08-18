import { useEffect, useRef, useState, type KeyboardEvent, type UIEvent } from "react";
import type { DocSection } from "../content/articles";
import { highlightForEditor } from "./jsTokenizer";
import { run, type OutputLine, type RunHandle } from "./playgroundEngine";
import { renderInline } from "./inline";

const lineClass: Record<OutputLine["kind"], string> = {
  log: "text-body",
  error: "text-red-600",
  yield: "text-green-600",
  return: "text-amber-600",
  meta: "italic text-muted",
};

function OutputPanel({ lines }: { lines: OutputLine[] }) {
  if (lines.length === 0) {
    return <p className="p-3 text-sm text-muted italic">// output will appear here</p>;
  }

  const steps = lines.reduce<number[]>((acc, line) => {
    const previous = acc.length > 0 ? acc[acc.length - 1] : 0;
    acc.push(line.kind === "meta" ? previous : previous + 1);
    return acc;
  }, []);

  return (
    <div className="flex flex-col p-3 font-mono text-sm leading-relaxed">
      {lines.map((line, index) => (
        <div key={index} className="flex gap-3">
          <span className={`w-6 shrink-0 text-right text-muted ${line.kind === "meta" ? "invisible" : ""}`}>
            {steps[index]}.
          </span>
          <span className={`whitespace-pre-wrap ${lineClass[line.kind]}`}>{line.text}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Live, interactive JS playground: a hand-rolled editor (invisible textarea
 * over a synchronously-highlighted <pre> — see jsTokenizer.ts) plus a Run
 * button that `eval`s the source and streams output line by line — a
 * returned generator or async generator unrolls step by step, live for the
 * async case. See playgroundEngine.ts for the execution semantics.
 */
export default function GeneratorPlayground({ code, height = 260, caption }: Extract<DocSection, { kind: "playground" }>) {
  const [source, setSource] = useState(code);
  const [lines, setLines] = useState<OutputLine[]>([]);
  const [running, setRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<RunHandle | null>(null);

  useEffect(() => {
    return () => handleRef.current?.stop();
  }, []);

  const lineCount = source.split("\n").length;

  function syncScroll(event: UIEvent<HTMLTextAreaElement>) {
    const target = event.currentTarget;
    if (preRef.current) {
      preRef.current.scrollTop = target.scrollTop;
      preRef.current.scrollLeft = target.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = target.scrollTop;
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const target = event.currentTarget;
    const { selectionStart, selectionEnd } = target;
    const next = `${source.slice(0, selectionStart)}  ${source.slice(selectionEnd)}`;
    setSource(next);
    requestAnimationFrame(() => {
      target.selectionStart = target.selectionEnd = selectionStart + 2;
    });
  }

  function handleRun() {
    handleRef.current?.stop();
    setLines([]);
    setRunning(true);
    const handle = run(source, (line) => setLines((current) => [...current, line]));
    handleRef.current = handle;
    handle.done.finally(() => {
      if (handleRef.current === handle) setRunning(false);
    });
  }

  function handleStop() {
    handleRef.current?.stop();
  }

  function handleClear() {
    setLines([]);
  }

  function handleReset() {
    handleRef.current?.stop();
    setSource(code);
    setLines([]);
  }

  return (
    <figure className="mt-8">
      <div className="overflow-hidden rounded-md border border-border">
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2 text-xs text-muted">
          <span className="font-mono uppercase tracking-wide">JavaScript — editable</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="rounded border border-transparent px-1.5 py-0.5 font-medium transition-colors duration-150 hover:border-border hover:text-fg"
            >
              ↺ Reset
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="rounded border border-transparent px-1.5 py-0.5 font-medium transition-colors duration-150 hover:border-border hover:text-fg"
            >
              Clear output
            </button>
            {running ? (
              <button
                type="button"
                onClick={handleStop}
                className="rounded-md bg-red-600 px-3 py-1 font-semibold text-white transition-colors duration-150 hover:bg-red-700"
              >
                ■ Stop
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRun}
                className="rounded-md bg-accent px-3 py-1 font-semibold text-fg-invert transition-colors duration-150 hover:bg-accent-hover"
              >
                ▶ Run
              </button>
            )}
          </div>
        </div>

        <div className="relative flex bg-bg font-mono text-sm" style={{ height }}>
          <div
            ref={gutterRef}
            aria-hidden="true"
            className="select-none overflow-hidden border-r border-border px-3 py-3 text-right text-muted"
          >
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <div className="relative min-w-0 grow">
            <pre
              ref={preRef}
              aria-hidden="true"
              className="pg-editor-layer pointer-events-none absolute inset-0 overflow-auto p-3 text-body"
            >
              <code dangerouslySetInnerHTML={{ __html: highlightForEditor(source) }} />
            </pre>
            <textarea
              ref={textareaRef}
              value={source}
              onChange={(event) => setSource(event.target.value)}
              onScroll={syncScroll}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="pg-editor-textarea absolute inset-0 h-full w-full resize-none overflow-auto p-3 focus:outline-none"
            />
          </div>
        </div>

        <div className="border-t border-border bg-surface/60">
          <div className="flex items-center justify-between border-b border-border px-4 py-1.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
            <span>Output</span>
            {running && <span className="text-accent normal-case">running…</span>}
          </div>
          <div className="max-h-64 overflow-auto">
            <OutputPanel lines={lines} />
          </div>
        </div>
      </div>
      {caption && <figcaption className="mt-2 text-base text-muted">{renderInline(caption)}</figcaption>}
    </figure>
  );
}
