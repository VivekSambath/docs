import type { JsDoc } from "../jsDocs";

const oldSchoolChunking = `async function processAll(items) {
  for (let i = 0; i < items.length; i++) {
    doWork(items[i]);
    // "0" doesn't mean now — it means "after the browser has had a turn".
    if (i % 100 === 0) await new Promise((r) => setTimeout(r, 0));
  }
}`;

export const schedulerApiDoc: JsDoc = {
  slug: "scheduler-api",
  title: "Scheduler API: the idea",
  category: "api",
  excerpt: "Why a page freezes, and the two functions that stop it — before any API detail.",
  sections: [
    { kind: "heading", text: "What it is" },
    {
      kind: "paragraph",
      text: "The **Scheduler API** is a priority queue between your code and the browser's event loop. Normally every piece of JS competes for the main thread equally. Here you label work by ==how much the user is waiting on it==, and the browser fits it around painting and input.",
    },
    {
      kind: "list",
      icons: ["priority", "responsive", "global", "task", "pause", "support"],
      items: [
        "It is a browser API for ==scheduling JavaScript work with priorities==.",
        "It breaks up long main-thread work so the page keeps responding to clicks and repaints.",
        "It is exposed through `globalThis.scheduler` in supported windows and workers.",
        "`scheduler.postTask()` queues a callback as a task and returns a promise for its result.",
        "`scheduler.yield()` pauses an async function, lets the browser do other work, then resumes where it left off.",
        "Support is still limited, so feature-check before using it in production.",
      ],
    },

    { kind: "heading", text: "Why it exists" },
    {
      kind: "list",
      icons: ["global", "pause", "split"],
      items: [
        "Browser JavaScript runs on ==one thread== — the same one that paints the page and handles clicks.",
        "So while your code runs, ==nothing else can==: no repaint, no scroll, no button response.",
        "The fix isn't faster work, it's ==smaller pieces== — hand the thread back between them.",
      ],
    },

    {
      kind: "callout",
      variant: "note",
      text: "Splitting the work doesn't make it finish sooner — it stops the page ==going dark== while it runs. Same total time, but clicks and repaints get their turn.",
    },

    { kind: "heading", text: "How we've been doing it for twenty years" },
    {
      kind: "paragraph",
      text: "None of this is new. Long before any Scheduler API, the way to unblock a page was `setTimeout(fn, 0)` — and a zero delay never meant \"run now\". It meant ==\"let the browser go first\"==. Same idea as yielding, done by hand.",
    },
    {
      kind: "code",
      language: "js",
      code: oldSchoolChunking,
      caption: "Do some work, let go, pick it back up. The modern API keeps this exact shape — it just lands you in a better spot in the queue.",
    },
    {
      kind: "paragraph",
      text: "It works, and it's still the fallback everyone ships. But look at ==where your next chunk goes==. You finished chunk 1; meanwhile three other things arrived. `setTimeout` puts you last:",
    },
    {
      kind: "ascii",
      art: `  setTimeout(fn, 0)                scheduler.yield()

  QUEUE                            QUEUE
  +---------------------+          +---------------------+
  | click handler       |          | click handler       |
  | analytics ping      |          |  >> YOUR CHUNK 2 << |
  | someone's animation |          | analytics ping      |
  |  >> YOUR CHUNK 2 << |          | someone's animation |
  +---------------------+          +---------------------+
       ^                                ^
       you wait for all three           input still goes first,
       before resuming                  but you're next in line`,
      caption: "Both let the browser act first. Only yield() puts you back near the front afterwards.",
    },
    {
      kind: "paragraph",
      text: "Three things were always wrong with the old way.",
    },
    {
      kind: "list",
      icons: ["clock", "priority", "task"],
      items: [
        "**You go to the back of the line.** Your next chunk queues *behind* everything that arrived while you worked — so a long job can be ==starved== and finish far later than you expect.",
        "**Every job looks equally urgent.** `setTimeout` has ==no concept of priority==. A click handler and an analytics ping are the same to it, so you can't say which should go first.",
        "**Your `0` stops meaning `0`.** Once a timer chain is ==five deep==, the browser quietly clamps every delay under 4ms *up* to 4ms — and a chunking loop is one long chain.",
      ],
    },
    {
      kind: "callout",
      variant: "warning",
      text: "That last one is worth doing the arithmetic on. Split 100,000 items into chunks of 100 and you make ==1,000 hops==; all but the first four cost 4ms of nothing. That's **four seconds** where neither your work nor the browser runs — added on top of the real work, and it gets ==worse the more finely you chunk==. `scheduler.yield()` has no such clamp.",
    },
    {
      kind: "table",
      headers: ["", "`setTimeout(fn, 0)`", "Scheduler API"],
      rows: [
        ["Splits long work", "Yes", "Yes"],
        ["Where your next chunk lands", "==Back of the queue==", "==Ahead of newer tasks=="],
        ["Can you rank jobs by urgency?", "No", "Yes — three priorities"],
        ["Can you cancel or re-rank later?", "`clearTimeout` only", "`TaskController`"],
        ["Minimum delay per chunk", "~4ms once nested", "None"],
        ["Browser support", "**Everywhere**", "Chromium today"],
      ],
    },
    {
      kind: "callout",
      variant: "note",
      text: "So the Scheduler API isn't a new capability — it's the ==same trick, done properly==. That's also why `setTimeout(fn, 0)` remains the fallback: it keeps the important half (the work still gets split) and loses only the ordering.",
    },

    { kind: "heading", text: "The two functions" },
    {
      kind: "paragraph",
      text: "The API is ==two functions==. Everything else is detail.",
    },
    {
      kind: "list",
      icons: ["split", "label"],
      items: [
        "`scheduler.yield()` — ==one long job==, split into pieces, so the page can breathe between them.",
        "`scheduler.postTask()` — ==several separate jobs==, ranked, so the browser knows which matters most.",
      ],
    },
    {
      kind: "table",
      headers: ["", "`yield()`", "`postTask()`"],
      rows: [
        ["What you give it", "Nothing — you `await` it", "A callback, plus a priority"],
        ["What it's for", "**One** job that runs too long", "**Many** jobs of differing urgency"],
        ["The question it answers", "*When* do I let go?", "*What* do I do next?"],
      ],
    },
    {
      kind: "callout",
      variant: "note",
      text: "They solve different halves of the same problem, and real code uses ==both==: `postTask()` ranks the queue, `yield()` creates the gaps where the browser gets to act on that ranking.",
    },

    { kind: "heading", text: "It isn't parallel — it's interleaved" },
    {
      kind: "paragraph",
      text: "The one thing people get backwards. Chunking sounds like side-by-side, but it's the ==opposite of parallel==: only one thing runs at any instant. You take turns.",
    },
    {
      kind: "list",
      icons: ["split", "pause"],
      items: [
        "**Parallel** — two threads, ==genuinely at the same instant==. That's `Web Workers`.",
        "**Interleaved** — one thread, ==taking turns==. That's `scheduler.yield()`.",
      ],
    },
    {
      kind: "scheduler-demo",
      demo: "parallel",
      caption: "Read down a column: the two parallel threads overlap, the interleaved lane never does.",
    },
    {
      kind: "paragraph",
      text: "One thread, taking turns: your chunk, the browser, your chunk. Which is why the total gets slightly *worse*, never better — every yield costs a trip through the event loop. What you trade is:",
    },
    {
      kind: "table",
      headers: ["What changes", "Effect of yielding"],
      rows: [
        [
          "Total completion time",
          "About the same, often ==slightly worse== — yields cost overhead and the browser uses the gaps.",
        ],
        [
          "Responsiveness while it runs",
          "==Massively better== — the thread is never blocked for longer than one chunk.",
        ],
        [
          "Number of threads",
          "**Unchanged.** Still one. `yield()` shares the thread you have; it never adds another.",
        ],
      ],
    },
    {
      kind: "callout",
      variant: "tip",
      text: "If you want ==true parallelism==, that's **Web Workers** — code on a genuinely separate thread. `yield()` never adds a thread; it makes better use of the one you have.",
    },
    {
      kind: "callout",
      variant: "tip",
      text: "That's the concept. The two functions get a page each: **[scheduler.postTask()](#/js-docs/scheduler-post-task)** for ranking several jobs, and **[scheduler.yield()](#/js-docs/scheduler-yield)** for splitting one long one.",
    },
  ],
};
