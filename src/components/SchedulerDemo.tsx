import { useEffect, useRef, useState, type ReactNode } from "react";
import type { DocSection } from "../content/articles";
import { renderInline } from "./inline";

// Live, in-page demos for the Scheduler API doc. Unlike `demo` sections
// (pure-CSS, script-less sandboxed iframes) these run real JS on the page's
// own main thread — that's the point: the blocking side genuinely blocks, and
// every number comes from real measurement, not simulation.
//
// Shape: each demo runs the SAME work two ways, side by side, from one Run
// button. A beginner shouldn't have to toggle a mode and remember the last
// run's number to see the difference — both answers sit next to each other.

/** Feature-detects `scheduler.yield()`, falling back to a macrotask turn. */
async function yieldToMain(): Promise<void> {
  const scheduler = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  if (scheduler && typeof scheduler.yield === "function") {
    await scheduler.yield();
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/** True only when the real API is present — surfaced in each demo's footer. */
function hasSchedulerYield(): boolean {
  const scheduler = (globalThis as { scheduler?: { yield?: unknown } }).scheduler;
  return !!scheduler && typeof scheduler.yield === "function";
}

/** Blocks the main thread for `ms` — stands in for genuinely expensive work. */
function busyWait(ms: number) {
  const end = performance.now() + ms;
  while (performance.now() < end) {
    /* deliberately spinning: this is the jank being demonstrated */
  }
}

type Side = "blocking" | "yielding";

/**
 * How long the browser sat on an event before our handler got to run — read
 * from the event's own timestamp, so it reflects real main-thread blocking.
 * Lives outside the component so it is never mistaken for render-phase work.
 */
function eventLag(timeStamp: number): number {
  return Math.max(0, Math.round(performance.now() - timeStamp));
}

/**
 * An rAF-driven dot. It only advances while the main thread is free, so a
 * frozen dot *is* the jank — the whole demo readable without a single number.
 */
function JankDot({ frozen, label }: { frozen: boolean; label: string }) {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    let angle = 0;
    function tick() {
      angle += 3;
      const dot = dotRef.current;
      if (dot) dot.style.left = `${(50 + 42 * Math.cos((angle * Math.PI) / 180)).toFixed(1)}%`;
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div>
      <div className="relative h-7 overflow-hidden rounded-md border border-border bg-bg">
        <div
          ref={dotRef}
          aria-hidden="true"
          className={`absolute top-1.5 h-4 w-4 -translate-x-1/2 rounded-full ${frozen ? "bg-red-500" : "bg-accent"}`}
        />
      </div>
      <p className="mt-1.5 text-xs text-muted">{label}</p>
    </div>
  );
}

/**
 * The headline for one side: a plain-language verdict, colored by whether
 * this side behaved well. The raw millisecond number is deliberately demoted
 * to small secondary text — the sentence is what a beginner reads.
 */
function Verdict({ tone, headline, detail }: { tone: "bad" | "good" | "idle"; headline: string; detail?: string }) {
  const toneClass =
    tone === "bad" ? "text-red-600" : tone === "good" ? "text-green-600" : "text-muted";
  return (
    <div className="min-h-14">
      <p className={`text-base font-semibold ${toneClass}`}>{headline}</p>
      {detail && <p className="mt-0.5 font-mono text-xs text-muted">{detail}</p>}
    </div>
  );
}

/** One of the two columns. `status` tints the top border like demo panes do. */
function Side({ title, status, children }: { title: string; status: "bad" | "good"; children: ReactNode }) {
  return (
    <div
      className={`min-w-0 rounded-md border border-border p-4 ${
        status === "bad" ? "border-t-2 border-t-red-500/70" : "border-t-2 border-t-green-600/70"
      }`}
    >
      <p className="mb-3 font-mono text-xs tracking-wide text-muted uppercase">{title}</p>
      {children}
    </div>
  );
}

/**
 * Wraps a demo with its "why / where" framing so the reader knows what they're
 * looking at before they press anything, and what to do with it afterwards.
 */
function DemoShell({
  why,
  where,
  onRun,
  running,
  runLabel,
  children,
}: {
  why: string;
  where: string;
  onRun: () => void;
  running: boolean;
  runLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-surface px-4 py-3">
        <p className="text-base text-body">{renderInline(why)}</p>
        <p className="mt-1 text-sm text-muted">{renderInline(where)}</p>
      </div>

      <div className="p-4">
        <button
          type="button"
          onClick={onRun}
          disabled={running}
          className="mb-4 w-full rounded-md bg-accent px-4 py-2.5 text-base font-semibold text-fg-invert transition-colors duration-150 hover:bg-accent-hover disabled:opacity-50"
        >
          {running ? "Running…" : runLabel}
        </button>
        {children}
      </div>

      <p className="border-t border-border bg-surface px-4 py-2 font-mono text-xs text-muted">
        {hasSchedulerYield() ? "using scheduler.yield()" : "scheduler.yield() unavailable — using setTimeout(fn, 0)"}
      </p>
    </div>
  );
}

/** One line in a side's event log: what happened, and how late it was. */
type LogEntry = { at: number; text: string; lag?: number };

/**
 * Builds a log entry. Module scope, not component scope: `performance.now()`
 * is impure, and the React Compiler lint (correctly) rejects impure calls made
 * from a function defined during render.
 *
 * For a click, `lag` is subtracted so the entry is stamped at the moment the
 * *event* happened rather than when the handler finally ran — on the blocking
 * side those are far apart, and that gap is the whole lesson.
 */
function makeEntry(base: number, text: string, lag?: number): LogEntry {
  const at = Math.round(performance.now() - base - (lag ?? 0));
  return { at: Math.max(0, at), text, lag };
}

/** Reads the clock outside render, for the same purity reason as above. */
function now(): number {
  return performance.now();
}

/**
 * The evidence panel. A verdict alone asks the reader to take our word for it;
 * the log shows each click arriving with the delay it actually suffered, so
 * the blocking side's "queued for 700ms" is visible rather than asserted.
 */
function EventLog({ entries, placeholder }: { entries: LogEntry[]; placeholder: string }) {
  return (
    <div className="mb-3 h-32 overflow-y-auto rounded-md border border-border bg-bg p-2 font-mono text-xs">
      {entries.length === 0 ? (
        <p className="text-muted">{placeholder}</p>
      ) : (
        entries.map((entry, i) => (
          <p key={i} className="flex gap-2 py-px">
            <span className="shrink-0 text-muted tabular-nums">{String(entry.at).padStart(4, " ")}ms</span>
            <span className={entry.lag !== undefined && entry.lag > 100 ? "text-red-600" : "text-body"}>
              {entry.text}
            </span>
          </p>
        ))
      )}
    </div>
  );
}

// --- Demo 1: does the page stay alive while work runs? ----------------------

/**
 * The foundational demo: identical work, run two ways, while the reader tries
 * to click. Answers "why would I ever need this?" before any API appears.
 */
function ClickDemo() {
  const [running, setRunning] = useState<Side | null>(null);
  const [clicks, setClicks] = useState<Record<Side, number>>({ blocking: 0, yielding: 0 });
  const [done, setDone] = useState<Record<Side, boolean>>({ blocking: false, yielding: false });
  const [log, setLog] = useState<Record<Side, LogEntry[]>>({ blocking: [], yielding: [] });
  const [worstLag, setWorstLag] = useState<Record<Side, number>>({ blocking: 0, yielding: 0 });

  // When each side's run began — every log timestamp is relative to this, so
  // the two columns can be read against each other.
  const startedAt = useRef<Record<Side, number>>({ blocking: 0, yielding: 0 });

  const WORK_MS = 900;
  const SLICES = 18;

  function append(side: Side, text: string, lag?: number) {
    const entry = makeEntry(startedAt.current[side] || now(), text, lag);
    setLog((current) => ({ ...current, [side]: [...current[side], entry] }));
  }

  /**
   * A click on one of the two buttons. `lag` is how long the browser sat on
   * the event before we got it — on the blocking side that's the whole
   * remaining task, which is the entire point of the demo.
   */
  function countClick(side: Side, lag: number) {
    setClicks((current) => ({ ...current, [side]: current[side] + 1 }));
    setWorstLag((current) => ({ ...current, [side]: Math.max(current[side], lag) }));
    append(
      side,
      lag > 100 ? `your click waited ${lag}ms` : `click answered — ${lag}ms`,
      lag,
    );
  }

  async function handleRun() {
    if (running) return;
    setClicks({ blocking: 0, yielding: 0 });
    setDone({ blocking: false, yielding: false });
    setLog({ blocking: [], yielding: [] });
    setWorstLag({ blocking: 0, yielding: 0 });

    // Blocking: one long task. Clicks during this are queued by the browser
    // and only delivered afterwards — the button cannot respond.
    setRunning("blocking");
    startedAt.current.blocking = now();
    append("blocking", "started — no breaks until it is done");
    await new Promise((resolve) => setTimeout(resolve, 50)); // let React paint the "running" state
    busyWait(WORK_MS);
    append("blocking", "finished — your clicks arrive only now");
    setDone((current) => ({ ...current, blocking: true }));

    // Yielding: the same total work, chopped into slices with a yield between
    // each, so clicks land in the gaps.
    setRunning("yielding");
    startedAt.current.yielding = now();
    append("yielding", `started — same work, in ${SLICES} pieces`);
    await new Promise((resolve) => setTimeout(resolve, 50));
    for (let i = 0; i < SLICES; i++) {
      busyWait(WORK_MS / SLICES);
      // Log a few of the yields rather than all 18 — enough to show the
      // rhythm of work/break/work without burying the clicks between them.
      if (i % 6 === 0) append("yielding", "paused — your turn");
      await yieldToMain();
    }
    append("yielding", "finished — clicks answered along the way");
    setDone((current) => ({ ...current, yielding: true }));
    setRunning(null);
  }

  function sideVerdict(side: Side) {
    if (running === side) {
      return {
        tone: "idle" as const,
        headline: "Running now — click!",
        detail: side === "blocking" ? "the thread is blocked" : "yielding between slices",
      };
    }
    if (!done[side]) return { tone: "idle" as const, headline: "Waiting to run…" };
    const n = clicks[side];
    const lag = worstLag[side];
    if (side === "blocking") {
      return {
        tone: "bad" as const,
        headline: n === 0 ? "Nothing got through while it ran" : `${n} click${n === 1 ? "" : "s"}, all delayed`,
        detail: n === 0 ? `one ${WORK_MS}ms task, start to finish` : `worst click waited ${lag}ms`,
      };
    }
    return {
      tone: "good" as const,
      headline: n === 0 ? "Page stayed responsive" : `${n} click${n === 1 ? "" : "s"}, handled right away`,
      detail: n === 0 ? `same work, split into ${SLICES} slices` : `worst click waited just ${lag}ms`,
    };
  }

  return (
    <DemoShell
      why="**Why this matters:** JavaScript runs on one thread. While your code is busy, the page cannot repaint or respond to a single click."
      where="Press Run, then click the button on **whichever side says “Running now”** — first the left, then the right. Each side logs every click and how long it waited."
      onRun={handleRun}
      running={running !== null}
      runLabel="Run both (about 2 seconds)"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {(["blocking", "yielding"] as const).map((side) => {
          const verdict = sideVerdict(side);
          const isLive = running === side;
          return (
            <Side
              key={side}
              title={side === "blocking" ? "Without yield" : "With yield"}
              status={side === "blocking" ? "bad" : "good"}
            >
              <JankDot
                frozen={isLive}
                label={isLive ? "running — watch the dot" : "the dot moves only when the page is free"}
              />
              <button
                type="button"
                onClick={(event) => countClick(side, eventLag(event.nativeEvent.timeStamp))}
                className={`my-3 w-full rounded-md border px-3 py-2 text-base font-medium transition-colors duration-150 ${
                  isLive
                    ? "border-accent bg-accent text-fg-invert"
                    : "border-border bg-surface text-fg hover:border-accent hover:text-accent"
                }`}
              >
                {isLive ? `Click me now! (${clicks[side]})` : `Click me (${clicks[side]})`}
              </button>
              <EventLog
                entries={log[side]}
                placeholder={side === "blocking" ? "— press Run, then click —" : "— waits for the left side to finish —"}
              />
              <Verdict {...verdict} />
            </Side>
          );
        })}
      </div>
    </DemoShell>
  );
}

// --- Demo 2: typing stays smooth -------------------------------------------

/**
 * The "where would I use this?" demo: a search box whose keystrokes compete
 * with rendering. Measures the gap between typing and the character appearing.
 */
function SearchDemo() {
  const [text, setText] = useState<Record<Side, string>>({ blocking: "", yielding: "" });
  /** Fastest key-to-key gap seen, per side — the floor the render imposes. */
  const [fastestGap, setFastestGap] = useState<Record<Side, number>>({ blocking: 0, yielding: 0 });
  const [log, setLog] = useState<Record<Side, LogEntry[]>>({ blocking: [], yielding: [] });
  const runIdRef = useRef(0);
  // First keystroke per side anchors that side's clock, so the log reads as
  // "how far into my typing", not as raw page uptime.
  const startedAt = useRef<Record<Side, number>>({ blocking: 0, yielding: 0 });
  /** When the previous keystroke landed, per side — the key-to-key gap. */
  const lastKeyAt = useRef<Record<Side, number>>({ blocking: 0, yielding: 0 });

  const WORK_MS = 220;

  async function handleType(side: Side, value: string, lag: number) {
    setText((current) => ({ ...current, [side]: value }));

    if (!startedAt.current[side]) startedAt.current[side] = now();

    // What actually hurts here is the gap *between* keystrokes, not the
    // handler's own delay. You cannot physically type faster than a blocking
    // render, so each key arrives only once the last render finished and its
    // event.timeStamp lag reads ~0 — while the typist still waits 220ms per
    // character. Measuring key-to-key exposes that; measuring lag hides it.
    const t = now();
    const sinceLast = lastKeyAt.current[side] ? Math.round(t - lastKeyAt.current[side]) : 0;
    lastKeyAt.current[side] = t;
    if (sinceLast) {
      // Track the *fastest* gap achieved: it's the floor the render imposes.
      // On the blocking side no amount of fast typing gets under WORK_MS —
      // that ceiling-as-a-floor is exactly what the demo is showing.
      setFastestGap((current) => ({
        ...current,
        [side]: current[side] === 0 ? sinceLast : Math.min(current[side], sinceLast),
      }));
    }

    const typed = value.slice(-1) || "⌫";
    const entry = makeEntry(
      startedAt.current[side],
      sinceLast === 0
        ? `"${typed}" — first keystroke`
        : `"${typed}" — ${sinceLast}ms since the last one`,
      // Colour the line red when the gap is dominated by the render, not by
      // how fast the reader types.
      sinceLast > WORK_MS * 0.8 ? sinceLast : undefined,
    );
    // Keep only the last 8 keystrokes: a fast typist would otherwise push the
    // interesting recent lines out of the scroll view.
    setLog((current) => ({ ...current, [side]: [...current[side], entry].slice(-8) }));

    void lag; // kept for the signature; the key-to-key gap is what we report

    if (side === "blocking") {
      busyWait(WORK_MS); // one long render per keystroke
      return;
    }

    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    const slices = 10;
    for (let i = 0; i < slices; i++) {
      busyWait(WORK_MS / slices);
      if (runIdRef.current !== runId) return; // a newer keystroke superseded this render
      await yieldToMain();
    }
  }

  function verdictFor(side: Side) {
    const gap = fastestGap[side];
    if (!text[side]) return { tone: "idle" as const, headline: "Type something…" };
    if (side === "blocking") {
      return {
        tone: "bad" as const,
        headline: gap ? `Capped at one key every ~${gap}ms` : "Keep typing…",
        detail: `each keystroke blocks for ${WORK_MS}ms before the next can land`,
      };
    }
    return {
      tone: "good" as const,
      headline: gap ? `Keys landed as fast as ${gap}ms apart` : "Keep typing…",
      detail: `same ${WORK_MS}ms of work, yielded in 10 slices`,
    };
  }

  return (
    <DemoShell
      why="**Why this matters:** a search box that renders results on every keystroke is the classic place this goes wrong — the user is typing, so they feel every millisecond."
      where="Type quickly in both boxes and watch the ==gap between keystrokes==. Same rendering work per key on each side — only the right one yields, so only the right one lets you type at full speed."
      onRun={() => {
        setText({ blocking: "", yielding: "" });
        setFastestGap({ blocking: 0, yielding: 0 });
        lastKeyAt.current = { blocking: 0, yielding: 0 };
        setLog({ blocking: [], yielding: [] });
        startedAt.current = { blocking: 0, yielding: 0 };
      }}
      running={false}
      runLabel="Reset both boxes"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {(["blocking", "yielding"] as const).map((side) => (
          <Side
            key={side}
            title={side === "blocking" ? "Without yield" : "With yield"}
            status={side === "blocking" ? "bad" : "good"}
          >
            <input
              type="text"
              value={text[side]}
              onChange={(event) => handleType(side, event.target.value, eventLag(event.nativeEvent.timeStamp))}
              placeholder="Type fast here…"
              className="mb-3 w-full rounded-md border border-border bg-bg px-3 py-2 text-base text-fg placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <EventLog entries={log[side]} placeholder="— every keystroke gets logged here —" />
            <Verdict {...verdictFor(side)} />
          </Side>
        ))}
      </div>
    </DemoShell>
  );
}

// --- Demo 3: a long list renders progressively ------------------------------

/**
 * The "how do I use this?" demo: shows that yielding also buys *visible
 * progress* — the reader watches rows stream in instead of waiting on a
 * frozen page for one big dump.
 */
function TableDemo() {
  const [running, setRunning] = useState<Side | null>(null);
  const [rows, setRows] = useState<Record<Side, number>>({ blocking: 0, yielding: 0 });
  const [elapsed, setElapsed] = useState<Record<Side, number>>({ blocking: 0, yielding: 0 });
  const [log, setLog] = useState<Record<Side, LogEntry[]>>({ blocking: [], yielding: [] });

  const startedAt = useRef<Record<Side, number>>({ blocking: 0, yielding: 0 });

  const TOTAL = 2000;
  const WORK_MS = 800;
  const BATCHES = 20;

  function append(side: Side, text: string) {
    const entry = makeEntry(startedAt.current[side] || now(), text);
    setLog((current) => ({ ...current, [side]: [...current[side], entry] }));
  }

  async function handleRun() {
    if (running) return;
    setRows({ blocking: 0, yielding: 0 });
    setElapsed({ blocking: 0, yielding: 0 });
    setLog({ blocking: [], yielding: [] });

    setRunning("blocking");
    startedAt.current.blocking = now();
    append("blocking", "started — building every row first");
    await new Promise((resolve) => setTimeout(resolve, 50));
    let start = now();
    busyWait(WORK_MS);
    setRows((current) => ({ ...current, blocking: TOTAL })); // all at once, at the very end
    // Two log lines total on this side — the emptiness between them is the
    // point: nothing could paint while the single long task ran.
    append("blocking", `all ${TOTAL.toLocaleString()} rows appear at once`);
    setElapsed((current) => ({ ...current, blocking: Math.round(now() - start) }));

    setRunning("yielding");
    startedAt.current.yielding = now();
    append("yielding", `started — ${BATCHES} batches, showing each one`);
    await new Promise((resolve) => setTimeout(resolve, 50));
    start = now();
    for (let i = 0; i < BATCHES; i++) {
      busyWait(WORK_MS / BATCHES);
      const painted = ((i + 1) * TOTAL) / BATCHES;
      setRows((current) => ({ ...current, yielding: painted }));
      // Log every fourth batch: enough lines to show steady progress, few
      // enough that the panel stays readable.
      if (i % 4 === 0 || i === BATCHES - 1) append("yielding", `${painted.toLocaleString()} rows on screen`);
      await yieldToMain();
    }
    setElapsed((current) => ({ ...current, yielding: Math.round(now() - start) }));
    setRunning(null);
  }

  function verdictFor(side: Side) {
    if (!elapsed[side]) return { tone: "idle" as const, headline: "Waiting to run…" };
    if (side === "blocking") {
      return {
        tone: "bad" as const,
        headline: "Nothing, then everything at once",
        detail: `blank for ${elapsed[side]}ms, then all ${TOTAL.toLocaleString()} rows`,
      };
    }
    return {
      tone: "good" as const,
      headline: "Rows appeared as they were ready",
      detail: `${elapsed[side]}ms total, in 20 visible batches`,
    };
  }

  return (
    <DemoShell
      why="**Why this matters:** yielding does more than keep clicks working — it lets the browser *paint*, so the user sees progress instead of a blank page."
      where="Watch the two counters. Both render 2,000 rows and take about the same total time; only one shows anything before it finishes."
      onRun={handleRun}
      running={running !== null}
      runLabel="Render 2,000 rows both ways"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {(["blocking", "yielding"] as const).map((side) => (
          <Side
            key={side}
            title={side === "blocking" ? "Without yield" : "With yield"}
            status={side === "blocking" ? "bad" : "good"}
          >
            <p className="font-mono text-3xl font-semibold text-fg tabular-nums">
              {rows[side].toLocaleString()}
            </p>
            <p className="mt-0.5 mb-3 text-xs tracking-wide text-muted uppercase">rows on screen</p>
            <EventLog entries={log[side]} placeholder="— press Run —" />
            <Verdict {...verdictFor(side)} />
          </Side>
        ))}
      </div>
    </DemoShell>
  );
}

// --- Diagram: parallel vs interleaved ---------------------------------------

/**
 * Not a benchmark — a drawn timeline. The other three demos measure real work;
 * this one answers a conceptual question ("isn't yielding just parallelism?")
 * that no measurement can show, because the whole point is what *doesn't*
 * happen: a second thread. Both rows are laid out on one shared clock so the
 * reader can compare them column by column.
 */

/** One block on a timeline: a span of the clock, owned by one actor. */
type TimelineBlock = { start: number; width: number; actor: "task" | "browser" };

// Both timelines span the same 0–100 clock, so equal x means equal time.
const PARALLEL_TASK: TimelineBlock[] = [{ start: 0, width: 100, actor: "task" }];
const PARALLEL_BROWSER: TimelineBlock[] = [{ start: 0, width: 100, actor: "browser" }];

// Same total task work as the parallel row (100 units), but pushed later
// because the browser's turns take real time on the one shared lane.
const INTERLEAVED: TimelineBlock[] = [
  { start: 0, width: 26, actor: "task" },
  { start: 26, width: 10, actor: "browser" },
  { start: 36, width: 26, actor: "task" },
  { start: 62, width: 10, actor: "browser" },
  { start: 72, width: 28, actor: "task" },
];

const ACTOR_CLASS = {
  task: "bg-accent text-fg-invert",
  browser: "bg-green-600 text-white",
} as const;

/** A labelled lane of blocks; blocks past the playhead are dimmed to grey. */
function Lane({ label, blocks, progress }: { label: string; blocks: TimelineBlock[]; progress: number }) {
  return (
    <div className="flex items-center gap-3">
      <p className="w-24 shrink-0 text-right font-mono text-xs text-muted">{label}</p>
      <div className="relative h-9 grow overflow-hidden rounded-md border border-border bg-bg">
        {blocks.map((block) => {
          // A block lights up once the playhead reaches its start, so the two
          // rows animate against the same clock.
          const active = progress >= block.start;
          return (
            <div
              key={`${block.actor}-${block.start}`}
              className={`absolute inset-y-0 flex items-center justify-center overflow-hidden text-[11px] font-semibold transition-colors duration-150 ${
                active ? ACTOR_CLASS[block.actor] : "bg-surface text-muted"
              }`}
              style={{ left: `${block.start}%`, width: `calc(${block.width}% - 2px)` }}
            >
              {block.width >= 18 ? (block.actor === "task" ? "your task" : "browser") : ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ParallelDiagram() {
  const [progress, setProgress] = useState(100);
  const [playing, setPlaying] = useState(false);

  // rAF rather than CSS keyframes: one clock drives all three lanes, so the
  // "same instant" comparison between rows stays exact.
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let start = 0;
    const DURATION = 2600;

    function tick(now: number) {
      if (!start) start = now;
      const pct = Math.min(100, ((now - start) / DURATION) * 100);
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      } else {
        setPlaying(false);
      }
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-surface px-4 py-3">
        <p className="text-base text-body">
          {renderInline(
            "**Parallel is not what you get.** Two threads run at the *same instant*; yielding runs one thread that *takes turns*.",
          )}
        </p>
        <p className="mt-1 text-sm text-muted">
          {renderInline("Play it and read down a column: the top pair overlap, the bottom row never does.")}
        </p>
      </div>

      <div className="p-4">
        <button
          type="button"
          onClick={() => {
            setProgress(0);
            setPlaying(true);
          }}
          disabled={playing}
          className="mb-4 w-full rounded-md bg-accent px-4 py-2.5 text-base font-semibold text-fg-invert transition-colors duration-150 hover:bg-accent-hover disabled:opacity-50"
        >
          {playing ? "Playing…" : "Play the timeline"}
        </button>

        <div className="rounded-md border border-border border-t-2 border-t-green-600/70 p-4">
          <p className="mb-3 font-mono text-xs tracking-wide text-muted uppercase">
            True parallel — two threads (Web Workers)
          </p>
          <div className="space-y-2">
            <Lane label="thread 1" blocks={PARALLEL_TASK} progress={progress} />
            <Lane label="thread 2" blocks={PARALLEL_BROWSER} progress={progress} />
          </div>
          <p className="mt-3 text-sm text-muted">
            {renderInline("Both lanes are busy at once — genuinely ==simultaneous==, on two separate threads.")}
          </p>
        </div>

        <div className="mt-4 rounded-md border border-border border-t-2 border-t-accent/70 p-4">
          <p className="mb-3 font-mono text-xs tracking-wide text-muted uppercase">
            Interleaved — one thread (scheduler.yield)
          </p>
          <Lane label="main thread" blocks={INTERLEAVED} progress={progress} />
          <p className="mt-3 text-sm text-muted">
            {renderInline(
              "One lane, ==taking turns==. Only one block is ever active, and the task finishes later — that's the cost of letting the browser in.",
            )}
          </p>
        </div>
      </div>

      <p className="border-t border-border bg-surface px-4 py-2 font-mono text-xs text-muted">
        diagram — not a measurement
      </p>
    </div>
  );
}

// --- Demo 5: priority decides run order, not queue order --------------------

type Priority = "user-blocking" | "user-visible" | "background";

/** Queued deliberately worst-first, so run order can't match queue order. */
const PRIORITY_TASKS: { label: string; priority: Priority }[] = [
  { label: "tidy old branches", priority: "background" },
  { label: "send analytics", priority: "background" },
  { label: "review the PR", priority: "user-visible" },
  { label: "render the list", priority: "user-visible" },
  { label: "unblock teammate", priority: "user-blocking" },
  { label: "show the spinner", priority: "user-blocking" },
];

const PRIORITY_STYLE: Record<Priority, string> = {
  "user-blocking": "border-red-500/70 text-red-600",
  "user-visible": "border-accent/70 text-accent",
  background: "border-border text-muted",
};

/** Queues a callback at a priority, falling back to a plain macrotask. */
function postTask(callback: () => void, priority: Priority): Promise<void> {
  const scheduler = (
    globalThis as { scheduler?: { postTask?: (cb: () => void, o: { priority: string }) => Promise<void> } }
  ).scheduler;
  if (scheduler && typeof scheduler.postTask === "function") {
    return scheduler.postTask(callback, { priority });
  }
  // No postTask here: emulate the ordering so the lesson still lands, and say
  // so in the footer rather than silently showing queue order as run order.
  const rank = { "user-blocking": 0, "user-visible": 1, background: 2 }[priority];
  return new Promise((resolve) => {
    setTimeout(() => {
      callback();
      resolve();
    }, rank * 60);
  });
}

function hasPostTask(): boolean {
  const scheduler = (globalThis as { scheduler?: { postTask?: unknown } }).scheduler;
  return !!scheduler && typeof scheduler.postTask === "function";
}

/**
 * The postTask counterpart to the yield demos: six tasks queued in the *worst*
 * order, then run. Seeing "tidy old branches" queued first and finishing last
 * is what makes "priority decides run order" concrete.
 */
function PriorityDemo() {
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState<{ label: string; priority: Priority }[]>([]);

  async function handleRun() {
    if (running) return;
    setRunning(true);
    setFinished([]);

    await Promise.all(
      PRIORITY_TASKS.map((task) =>
        postTask(() => {
          setFinished((current) => [...current, task]);
        }, task.priority),
      ),
    );
    setRunning(false);
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-surface px-4 py-3">
        <p className="text-base text-body">
          {renderInline("**Queue order is not run order.** These six are queued worst-first — watch where they land.")}
        </p>
      </div>

      <div className="p-4">
        <button
          type="button"
          onClick={handleRun}
          disabled={running}
          className="mb-4 w-full rounded-md bg-accent px-4 py-2.5 text-base font-semibold text-fg-invert transition-colors duration-150 hover:bg-accent-hover disabled:opacity-50"
        >
          {running ? "Running…" : "Queue all six"}
        </button>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="min-w-0 rounded-md border border-border p-4">
            <p className="mb-3 font-mono text-xs tracking-wide text-muted uppercase">Queued in this order</p>
            {PRIORITY_TASKS.map((task, i) => (
              <p key={task.label} className="flex gap-2 py-0.5 font-mono text-xs">
                <span className="text-muted">{i + 1}.</span>
                <span className="text-body">{task.label}</span>
                <span className={`ml-auto shrink-0 rounded border px-1 ${PRIORITY_STYLE[task.priority]}`}>
                  {task.priority}
                </span>
              </p>
            ))}
          </div>

          <div className="min-w-0 rounded-md border border-border border-t-2 border-t-green-600/70 p-4">
            <p className="mb-3 font-mono text-xs tracking-wide text-muted uppercase">Actually ran in this order</p>
            {finished.length === 0 ? (
              <p className="font-mono text-xs text-muted">— press the button —</p>
            ) : (
              finished.map((task, i) => (
                <p key={task.label} className="flex gap-2 py-0.5 font-mono text-xs">
                  <span className="text-muted">{i + 1}.</span>
                  <span className="text-body">{task.label}</span>
                  <span className={`ml-auto shrink-0 rounded border px-1 ${PRIORITY_STYLE[task.priority]}`}>
                    {task.priority}
                  </span>
                </p>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="border-t border-border bg-surface px-4 py-2 font-mono text-xs text-muted">
        {hasPostTask()
          ? "using scheduler.postTask()"
          : "scheduler.postTask() unavailable — ordering emulated with setTimeout"}
      </p>
    </div>
  );
}

const demos = {
  click: ClickDemo,
  search: SearchDemo,
  table: TableDemo,
  parallel: ParallelDiagram,
  priority: PriorityDemo,
};

export default function SchedulerDemo({ demo, caption }: Extract<DocSection, { kind: "scheduler-demo" }>) {
  const Demo = demos[demo];
  return (
    <figure className="mt-8">
      <Demo />
      {caption && <figcaption className="mt-2 text-base text-muted">{renderInline(caption)}</figcaption>}
    </figure>
  );
}
