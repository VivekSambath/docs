// Pure logic behind the playground's Run button — kept separate from the
// component so it stays trivially testable and reusable. Mirrors DevTools
// console semantics: eval's completion value surfaces even without an
// explicit `return`, and a returned/logged generator is auto-unrolled step
// by step (capped so an infinite generator can't lock the tab).

export type OutputLine = {
  kind: "log" | "error" | "yield" | "return" | "meta";
  text: string;
};

export function isGenerator(value: unknown): value is Generator {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as Generator).next === "function" &&
    typeof (value as Iterable<unknown>)[Symbol.iterator] === "function"
  );
}

export function isAsyncGenerator(value: unknown): value is AsyncGenerator {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as AsyncGenerator).next === "function" &&
    typeof (value as AsyncIterable<unknown>)[Symbol.asyncIterator] === "function"
  );
}

export function format(value: unknown): string {
  if (typeof value === "string") return value;
  if (value instanceof Error) return value.stack || `${value.name}: ${value.message}`;
  try {
    return JSON.stringify(value, (_key, v) => (typeof v === "bigint" ? `${v.toString()}n` : v), 2) ?? String(value);
  } catch {
    return String(value);
  }
}

const STEP_LIMIT = 1000;

/** Unrolls a generator step by step into output lines, capped at `limit` iterations. */
export function unrollGenerator(gen: Generator, limit = STEP_LIMIT, label?: string): OutputLine[] {
  const lines: OutputLine[] = [];
  const prefix = label ? `[${label}] ` : "";
  let count = 0;

  for (; count < limit; count++) {
    let result: IteratorResult<unknown>;
    try {
      result = gen.next();
    } catch (err) {
      lines.push({ kind: "error", text: `${prefix}threw: ${format(err)}` });
      return lines;
    }

    if (result.done) {
      if (result.value !== undefined) {
        lines.push({ kind: "return", text: `${prefix}return: ${format(result.value)}` });
      }
      return lines;
    }

    lines.push({ kind: "yield", text: `${prefix}yield #${count + 1}: ${format(result.value)}` });
  }

  lines.push({ kind: "meta", text: `${prefix}... stopped after ${limit} yields (generator still running)` });
  return lines;
}

/**
 * Unrolls an async generator step by step, calling `onLine` as each value
 * arrives instead of batching — the caller may be waiting on real timers
 * (setTimeout-based delays), so results can't be collected up front the way
 * the sync unroller does. `shouldStop()` is polled between steps so a Stop
 * button can interrupt a generator that never finishes on its own (e.g. a
 * `while (true)` loop); when it fires, `gen.return()` runs any `finally`
 * blocks in the generator before this resolves.
 */
export async function unrollAsyncGenerator(
  gen: AsyncGenerator,
  onLine: (line: OutputLine) => void,
  shouldStop: () => boolean,
  limit = STEP_LIMIT,
  label?: string,
): Promise<void> {
  const prefix = label ? `[${label}] ` : "";
  let count = 0;

  for (; count < limit; count++) {
    if (shouldStop()) {
      await gen.return(undefined);
      onLine({ kind: "meta", text: `${prefix}stopped` });
      return;
    }

    let result: IteratorResult<unknown>;
    try {
      result = await gen.next();
    } catch (err) {
      onLine({ kind: "error", text: `${prefix}threw: ${format(err)}` });
      return;
    }

    if (result.done) {
      if (result.value !== undefined) {
        onLine({ kind: "return", text: `${prefix}return: ${format(result.value)}` });
      }
      return;
    }

    onLine({ kind: "yield", text: `${prefix}yield #${count + 1}: ${format(result.value)}` });
  }

  onLine({ kind: "meta", text: `${prefix}... stopped after ${limit} yields (generator still running)` });
}

export type RunHandle = {
  /** Resolves once the run (including any async unrolling) finishes or is stopped. */
  done: Promise<void>;
  stop: () => void;
};

/**
 * Runs user source via direct `eval`, matching a DevTools console: the
 * completion value of the last statement surfaces even without an explicit
 * `return`. A shadowed `console` and an injected `trace()` helper are
 * visible to the eval'd code via closure. `new Function(source)` was
 * considered instead but does not return a completion value, which would
 * silently change what a bare trailing expression like `outer();` shows.
 *
 * `onLine` is called as output happens (not batched), so a caller can render
 * live streaming results — needed for async generators paced by real
 * timers. Returns a `stop()` handle: since JS can't preempt a running
 * synchronous loop, this only takes effect at the await point between an
 * async generator's steps.
 */
export function run(source: string, onLine: (line: OutputLine) => void): RunHandle {
  let stopped = false;
  const stop = () => {
    stopped = true;
  };

  const append = (kind: OutputLine["kind"], parts: unknown[]) => {
    onLine({ kind, text: parts.map((p) => (typeof p === "string" ? p : format(p))).join(" ") });
  };

  const console = {
    log: (...args: unknown[]) => append("log", args),
    info: (...args: unknown[]) => append("log", args),
    warn: (...args: unknown[]) => append("log", args),
    error: (...args: unknown[]) => append("error", args),
  };

  const trace = async (gen: unknown, label?: string) => {
    if (isAsyncGenerator(gen)) {
      await unrollAsyncGenerator(gen, onLine, () => stopped, STEP_LIMIT, label);
      return;
    }
    if (!isGenerator(gen)) {
      onLine({ kind: "error", text: "trace() was called with something that isn't a generator" });
      return;
    }
    unrollGenerator(gen, STEP_LIMIT, label).forEach(onLine);
  };

  const done = (async () => {
    try {
      // `console` and `trace` are only reachable from inside the eval'd
      // source below via closure — invisible to TS's static usage analysis.
      void console;
      void trace;

      const result = (function () {
        "use strict";
        return eval(source);
      })();

      if (isAsyncGenerator(result)) {
        onLine({ kind: "meta", text: "(returned an async generator — unrolling live)" });
        await unrollAsyncGenerator(result, onLine, () => stopped);
      } else if (isGenerator(result)) {
        onLine({ kind: "meta", text: "(returned a generator — unrolling every step)" });
        unrollGenerator(result, STEP_LIMIT).forEach(onLine);
      } else if (result instanceof Promise) {
        const resolved = await result;
        if (resolved !== undefined) {
          onLine({ kind: "return", text: `=> ${format(resolved)}` });
        }
      } else if (result !== undefined) {
        onLine({ kind: "return", text: `=> ${format(result)}` });
      }
    } catch (err) {
      const e = err as Error;
      onLine({ kind: "error", text: `${e.name ?? "Error"}: ${e.message ?? String(err)}` });
    }
  })();

  return { done, stop };
}
