import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type UIEvent } from "react";
import type { DocSection } from "../content/articles";
import { highlightForEditor } from "./jsTokenizer";
import { run, type OutputLine, type RunHandle } from "./playgroundEngine";
import { renderInline } from "./inline";

/**
 * Per-kind color, applied by setting the `--pg-kind` variable that both the
 * label chip and the value read (see `.pg-line-*` in global.css). Colors are
 * `light-dark()` theme tokens, not raw palette utilities, so the console
 * follows `color-scheme` like the rest of the site.
 */
const lineClass: Record<OutputLine["kind"], string> = {
  log: "pg-line-log",
  error: "pg-line-error",
  yield: "pg-line-yield",
  return: "pg-line-return",
  meta: "pg-line-meta",
};

function OutputRow({ line, step }: { line: OutputLine; step: number | null }) {
  return (
    <div className={`flex gap-3 px-4 py-1 ${lineClass[line.kind]}`}>
      <span aria-hidden={step === null} className="w-5 shrink-0 pt-px text-right text-xs text-muted tabular-nums">
        {step ?? ""}
      </span>
      {line.source && <span className="shrink-0 pt-px text-xs text-muted">{line.source}</span>}
      {line.label && (
        <span className="pg-chip shrink-0 rounded px-1.5 py-px text-[11px] font-semibold tracking-wide">
          {line.label}
        </span>
      )}
      <span className={`min-w-0 whitespace-pre-wrap ${line.kind === "log" ? "text-body" : "pg-value"}`}>
        {line.text}
      </span>
    </div>
  );
}

function OutputPanel({ lines }: { lines: OutputLine[] }) {
  if (lines.length === 0) {
    return (
      <p className="px-4 py-3 text-sm text-muted">
        Press <span className="font-semibold text-fg">Run</span> to execute the code.
      </p>
    );
  }

  // `meta` lines are commentary about the run, not results, so they sit
  // outside the numbering — otherwise "yield 3" could land on step 4.
  let step = 0;

  return (
    <div className="flex flex-col py-2 font-mono text-sm leading-relaxed">
      {lines.map((line, index) => (
        <OutputRow key={index} line={line} step={line.kind === "meta" ? null : ++step} />
      ))}
    </div>
  );
}

/** Secondary toolbar actions: quiet by default so the filled Run button stays
 *  the only thing competing for attention. */
const QUIET_BUTTON =
  "rounded px-2 py-1 font-medium text-muted transition-colors duration-150 hover:bg-bg hover:text-fg";

/**
 * Live, interactive JS playground: a hand-rolled editor (invisible textarea
 * over a synchronously-highlighted <pre> — see jsTokenizer.ts) plus a Run
 * button that `eval`s the source and streams output line by line — a
 * returned generator or async generator unrolls step by step, live for the
 * async case. See playgroundEngine.ts for the execution semantics.
 */
export default function GeneratorPlayground({ code, height = 420, caption }: Extract<DocSection, { kind: "playground" }>) {
  const [source, setSource] = useState(code);
  const [lines, setLines] = useState<OutputLine[]>([]);
  const [running, setRunning] = useState(false);
  const [layout, setLayout] = useState<"stacked" | "side-by-side">("stacked");
  const [splitPercent, setSplitPercent] = useState(55);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<RunHandle | null>(null);
  const paneRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

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

  const handleDrag = useCallback(
    (event: PointerEvent) => {
      if (!draggingRef.current || !paneRef.current) return;
      const rect = paneRef.current.getBoundingClientRect();
      const percent =
        layout === "side-by-side"
          ? ((event.clientX - rect.left) / rect.width) * 100
          : ((event.clientY - rect.top) / rect.height) * 100;
      setSplitPercent(Math.min(80, Math.max(20, percent)));
    },
    [layout],
  );

  useEffect(() => {
    function stopDrag() {
      draggingRef.current = false;
    }
    window.addEventListener("pointermove", handleDrag);
    window.addEventListener("pointerup", stopDrag);
    return () => {
      window.removeEventListener("pointermove", handleDrag);
      window.removeEventListener("pointerup", stopDrag);
    };
  }, [handleDrag]);

  function startDrag() {
    draggingRef.current = true;
  }

  return (
    <figure className="mt-8">
      <div className="overflow-hidden rounded-md border border-border">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-border bg-surface px-4 py-2 text-sm">
          <span className="font-mono text-xs tracking-wide text-muted uppercase">JavaScript</span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={handleReset} className={QUIET_BUTTON}>
              Reset
            </button>
            <button type="button" onClick={handleClear} className={QUIET_BUTTON}>
              Clear
            </button>
            <button
              type="button"
              onClick={() => setLayout(layout === "stacked" ? "side-by-side" : "stacked")}
              title={layout === "stacked" ? "Switch to side-by-side layout" : "Switch to stacked layout"}
              aria-label={layout === "stacked" ? "Switch to side-by-side layout" : "Switch to stacked layout"}
              className={QUIET_BUTTON}
            >
              <span aria-hidden="true">{layout === "stacked" ? "⬌" : "⬍"}</span>
            </button>
            <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
            {running ? (
              <button
                type="button"
                onClick={handleStop}
                className="rounded border border-border px-3 py-1 font-semibold text-fg transition-colors duration-150 hover:border-accent hover:text-accent"
              >
                Stop
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRun}
                className="rounded bg-accent px-3 py-1 font-semibold text-fg-invert transition-colors duration-150 hover:bg-accent-hover"
              >
                Run
              </button>
            )}
          </div>
        </div>

        <div
          ref={paneRef}
          className={`relative flex bg-bg font-mono text-sm ${layout === "side-by-side" ? "flex-row" : "flex-col"}`}
          style={{ height }}
        >
          <div
            className="relative flex min-h-0 min-w-0"
            style={layout === "side-by-side" ? { width: `${splitPercent}%` } : { flex: `0 0 ${splitPercent}%` }}
          >
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

          <div
            onPointerDown={startDrag}
            role="separator"
            aria-orientation={layout === "side-by-side" ? "vertical" : "horizontal"}
            aria-label="Resize code and output panes"
            className={`shrink-0 touch-none bg-border transition-colors duration-150 hover:bg-accent ${
              layout === "side-by-side" ? "w-1 cursor-col-resize" : "h-1 cursor-row-resize"
            }`}
          />

          <div className="flex min-h-0 min-w-0 grow flex-col border-border bg-surface/60">
            <div className="flex items-center justify-between border-b border-border px-4 py-1.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
              <span>Output</span>
              <span className="normal-case" aria-live="polite">
                {running ? <span className="text-accent">running…</span> : lines.length > 0 && `${lines.length} lines`}
              </span>
            </div>
            <div className="min-h-0 grow overflow-auto">
              <OutputPanel lines={lines} />
            </div>
          </div>
        </div>
      </div>
      {caption && <figcaption className="mt-2 text-base text-muted">{renderInline(caption)}</figcaption>}
    </figure>
  );
}
