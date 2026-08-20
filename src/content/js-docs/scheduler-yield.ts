import type { JsDoc } from "../jsDocs";

const houseCleaning = `// Blocking — clean the whole house, nothing else can happen.
function cleanHouse() {
  cleanKitchen();
  cleanLivingRoom();
  cleanBedroom();
  cleanBathroom();
} // phone, door, everything waits ~2 hours

// Chunked — pause between rooms so you can respond.
async function cleanHouse() {
  cleanKitchen();
  await scheduler.yield();   // "is anything ringing?"
  cleanLivingRoom();
  await scheduler.yield();
  cleanBedroom();
  await scheduler.yield();
  cleanBathroom();
} // still ~2 hours total, but never unreachable for long`;

const yieldExample = `async function processLargeArray(items) {
  for (let i = 0; i < items.length; i++) {
    doWork(items[i]);
    // Every 100 items, hand the thread back to the browser.
    if (i % 100 === 0) await scheduler.yield();
  }
}`;

const yieldVsTimeout = `// Both break up the loop. The difference is what happens after the break.

// setTimeout(0): your continuation goes to the BACK of the task queue —
// anything queued while you were working runs first, so a long loop can be
// starved by unrelated tasks and finish much later than expected.
await new Promise((resolve) => setTimeout(resolve, 0));

// scheduler.yield(): your continuation is prioritized ahead of tasks queued
// after it, so the loop resumes promptly once input and paint are handled.
await scheduler.yield();`;

const searchExample = `input.addEventListener("input", async (event) => {
  // React to the keystroke immediately — this is what the user is watching.
  await scheduler.postTask(() => showLoadingSpinner(), {
    priority: "user-blocking",
  });

  const results = await fetchResults(event.target.value);

  // The list matters, but not more than the next keystroke does.
  await scheduler.postTask(() => renderResultsList(results), {
    priority: "user-visible",
  });
});`;

const analyticsExample = `// Fire-and-forget telemetry must never outrank a click or an animation frame.
scheduler.postTask(() => sendAnalyticsBeacon(eventData), {
  priority: "background",
});`;

const tableExample = `async function renderRows(rows) {
  for (let i = 0; i < rows.length; i++) {
    appendRowToTable(rows[i]);
    if (i % 50 === 0) await scheduler.yield();
  }
}`;

const featureDetect = `// One helper, used everywhere. Feature-detect once, fall back forever.
async function yieldToMain() {
  if ("scheduler" in globalThis && "yield" in globalThis.scheduler) {
    return globalThis.scheduler.yield();
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// postTask has a fallback too — priority is simply lost.
function postTask(callback, { priority = "user-visible" } = {}) {
  if ("scheduler" in globalThis && "postTask" in globalThis.scheduler) {
    return globalThis.scheduler.postTask(callback, { priority });
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(callback());
      } catch (err) {
        reject(err);
      }
    }, 0);
  });
}`;

const yieldPlayground = `// Rendering 500 rows without freezing the page.
// Change CHUNK, press Run, and watch how often the browser gets a turn.

const ROWS = 500;
const CHUNK = 100;   // rows to do before handing the thread back

// scheduler.yield() is Chromium-only for now, so fall back to setTimeout.
const letBrowserIn = () =>
  globalThis.scheduler?.yield?.() ?? new Promise((r) => setTimeout(r, 0));

async function renderRows() {
  for (let i = 1; i <= ROWS; i++) {
    renderOneRow(i);

    if (i % CHUNK === 0) {
      await letBrowserIn();   // <- the browser gets a turn, right here
      console.log(\`\${i} rows done - browser had a turn\`);
    }
  }
  return \`finished all \${ROWS} rows\`;
}

// Stand-in for real work: building a row costs a fraction of a millisecond.
function renderOneRow(i) {
  let s = 0;
  for (let k = 0; k < 20000; k++) s += k;
  return s;
}

renderRows();`;

export const schedulerYieldDoc: JsDoc = {
  slug: "scheduler-yield",
  title: "scheduler.yield()",
  category: "api",
  excerpt: "Split one long job into pieces, so the page keeps responding while it runs.",
  sections: [
    {
      kind: "paragraph",
      text: "The other half of the Scheduler API. `yield()` is for ==one job that runs too long== — you hand the thread back partway through, and the browser gets to paint or handle a click. For ranking ==several== jobs instead, see [scheduler.postTask()](#/js-docs/scheduler-post-task); for why either exists, start with [the idea](#/js-docs/scheduler-api).",
    },

    { kind: "heading", text: "Syntax" },
    {
      kind: "code",
      language: "js",
      code: `// Yield the thread mid-function, then continue. Returns a promise.
await scheduler.yield();`,
    },
    {
      kind: "paragraph",
      text: "Call it now and then inside a long loop: the browser gets to paint or handle a click, then ==your loop resumes where it stopped==. No manual chunking, no rewriting the loop into callbacks.",
    },
    { kind: "code", language: "js", code: yieldExample },
    {
      kind: "scheduler-demo",
      demo: "click",
      caption: "Identical work on both sides — only the right one yields. Press Run, then click whichever side says “Running now”.",
    },

    { kind: "heading", text: "The nuance: it doesn't make anything faster" },
    {
      kind: "paragraph",
      text: "Both sides of that demo took ==about the same time==. That's not a flaw in the demo — it's the whole trade. Splitting work up doesn't speed it up; it usually runs ==slightly slower== overall.",
    },
    { kind: "code", language: "js", code: houseCleaning },
    {
      kind: "list",
      icons: ["clock", "responsive", "global"],
      items: [
        "**Total time** — ==unchanged, or a little worse==. Each yield costs a trip through the event loop, and the browser spends the gaps you hand it.",
        "**Responsiveness while it runs** — ==transformed==. The thread is never blocked for longer than one chunk, so clicks and repaints always get a turn.",
        "**Number of threads** — ==still one==. `yield()` shares the thread you already have; it never adds another.",
      ],
    },
    {
      kind: "callout",
      variant: "note",
      text: "So it isn't \"do the job faster\", it's ==\"do the job without freezing everything else\"==. The house still takes two hours — but you answered the door.",
    },
    {
      kind: "ascii",
      art: `                       click arrives
                            |
                            v
  +---------+  yield  +---------+  yield  +---------+
  | chunk 1 | ------> | chunk 2 | ------> | chunk 3 |
  +---------+    ^    +---------+    ^    +---------+
                 |                   |
          browser paints /    browser handles
          handles input          the click`,
      caption: "A long task split into chunks. Each yield lets the browser handle input before resuming.",
    },
    {
      kind: "paragraph",
      text: "This is what separates `yield()` from [the old `setTimeout(fn, 0)` trick](#/js-docs/scheduler-api). Both break the loop. They differ in ==where your continuation lands in the queue==.",
    },
    { kind: "code", language: "js", code: yieldVsTimeout },
    {
      kind: "comparison",
      before: {
        label: "await setTimeout(…, 0)",
        code: `for (const item of items) {
  doWork(item);
  await new Promise(r => setTimeout(r, 0));
}`,
        language: "js",
        points: [
          "The continuation goes to the **back** of the task queue.",
          "Tasks queued while you worked jump ahead of your next chunk.",
          "A long loop can be starved and finish much later than expected.",
          "Works everywhere today.",
        ],
      },
      after: {
        label: "await scheduler.yield()",
        code: `for (const item of items) {
  doWork(item);
  await scheduler.yield();
}`,
        language: "js",
        points: [
          "The continuation is **prioritized ahead** of tasks queued after it.",
          "Input and paint still get their turn — that's the point of yielding.",
          "The loop resumes quickly, so total time stays predictable.",
          "Needs a feature check plus a `setTimeout` fallback.",
        ],
      },
    },
    {
      kind: "paragraph",
      text: "How often you yield matters, though. Yield on ==every single item== and the overhead dominates. Yield ==every 1,000 items== and you're back to visible jank. Chunks of roughly 25–60ms sit in the sweet spot, comfortably under the ~50ms threshold that counts as a **long task**.",
    },
    {
      kind: "playground",
      code: yieldPlayground,
      caption: "Run it — five log lines, one per yield. Now set `CHUNK` to `10` and run again: fifty yields, fifty chances for the browser to step in.",
    },

    { kind: "heading", text: "Where you'd use it" },
    {
      kind: "paragraph",
      text: "Two places this comes up constantly. Like the demo above, both run ==real JavaScript on this page's main thread== with identical work on each side — so the difference you see is real, not simulated.",
    },

    { kind: "heading", text: "A search box that renders results", level: 3 },
    {
      kind: "paragraph",
      text: "The classic case: the user is ==typing==, so they feel every millisecond. Without a yield, each keystroke waits for the last one's rendering to finish.",
    },
    {
      kind: "comparison",
      before: {
        label: "Blocking — one long render per key",
        code: `input.addEventListener("input", (e) => {
  renderResults(e.target.value);   // ~220ms, uninterruptible
});

function renderResults(query) {
  for (const row of matchRows(query)) {
    appendRow(row);
  }
}`,
        language: "js",
        points: [
          "The next keystroke ==cannot land== until this render finishes.",
          "So typing is capped at **one character per render** — about 4–5 a second.",
          "The input feels ==stuck==, however fast you type.",
        ],
      },
      after: {
        label: "Yielding — the same render, in slices",
        code: `input.addEventListener("input", async (e) => {
  await renderResults(e.target.value);
});

async function renderResults(query) {
  let i = 0;
  for (const row of matchRows(query)) {
    appendRow(row);
    if (++i % 50 === 0) await scheduler.yield();
  }
}`,
        language: "js",
        points: [
          "Each `yield` is a gap where the ==next keystroke can arrive==.",
          "Characters appear as fast as you type them.",
          "Same total rendering work — it just stops ==holding the door shut==.",
        ],
      },
    },
    {
      kind: "scheduler-demo",
      demo: "search",
      caption: "Type fast in both boxes. Watch the gap between keystrokes: the left box can't go faster than one key per render.",
    },
    {
      kind: "callout",
      variant: "note",
      text: "Real code needs one more guard: a keystroke arriving mid-render should ==abandon the render in progress== rather than finish rendering results for a query the user has already moved past. The demo above does this with a run-id check.",
    },
    {
      kind: "paragraph",
      text: "In production, use both halves: react to the keystroke at `user-blocking` so the UI responds at once, then render the result list at `user-visible`.",
    },
    { kind: "code", language: "js", code: searchExample, caption: "React at `user-blocking`, render results at `user-visible`." },

    { kind: "heading", text: "A long list that takes a while to build", level: 3 },
    {
      kind: "paragraph",
      text: "Yielding also lets the browser ==paint==. Without it: a blank area, then everything at once. With it: the list fills in as it goes.",
    },
    {
      kind: "scheduler-demo",
      demo: "table",
      caption: "Both render 2,000 rows in about the same time — only one shows anything before finishing.",
    },
    { kind: "code", language: "js", code: tableExample },
    {
      kind: "paragraph",
      text: "The same shape covers analytics and other fire-and-forget work. Nothing is on screen, so queue it at `background` and it can never outrank a click or a frame.",
    },
    { kind: "code", language: "js", code: analyticsExample },
    {
      kind: "callout",
      variant: "tip",
      text: "Every case on this page is the same move: find the work that hogs the thread, and hand the thread back partway through. What changes between them is only ==which== work, and ==how often== you let go.",
    },

    { kind: "heading", text: "How to use it — the short version" },
    {
      kind: "list",
      icons: ["search", "split", "label", "shield"],
      items: [
        "**Find the slow thing.** In DevTools → Performance, record and look for a long bar on the main thread. Don't guess — ==fix what actually blocks==.",
        "**One long loop?** Put `await scheduler.yield()` inside it, every N iterations. Start near 50–100 and adjust.",
        "**Several separate jobs?** Queue each with `scheduler.postTask()` and label it: `user-blocking` for what the user waits on, `background` for what they don't, `user-visible` (the default) for the rest.",
        "**Always feature-detect**, with `setTimeout(fn, 0)` as the fallback. Support is limited, and the fallback keeps most of the benefit.",
      ],
    },
    {
      kind: "code",
      language: "js",
      code: `// The 90% case, start to finish.
async function yieldToMain() {
  if ("scheduler" in globalThis && "yield" in globalThis.scheduler) {
    return globalThis.scheduler.yield();
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
}

async function processAll(items) {
  for (let i = 0; i < items.length; i++) {
    doWork(items[i]);
    if (i % 50 === 0) await yieldToMain(); // let the browser breathe
  }
}`,
      caption: "Copy this helper into a project and you have the useful part of the API today.",
    },
    {
      kind: "callout",
      variant: "warning",
      text: "Don't yield on every iteration. Each yield costs a trip through the event loop, so 10,000 yields turn a fast loop into a slow one. Yield ==every N items==, aiming for slices of about 5–50ms.",
    },

    { kind: "heading", text: "Feature detection and fallbacks" },
    {
      kind: "list",
      icons: ["support", "shield", "split"],
      items: [
        "Both ship in ==Chromium browsers== today, from the Prioritized Task Scheduling spec.",
        "==Never call them unguarded== — wrap each in a helper, and use the helper everywhere.",
        "Elsewhere the helper falls back to plain chunking instead of throwing.",
      ],
    },
    { kind: "code", language: "js", code: featureDetect },
    {
      kind: "callout",
      variant: "warning",
      text: "The fallback keeps the important half — the work still gets split — and loses only the ordering. Treat the Scheduler API as a ==progressive enhancement==, never as something your code needs to be correct.",
    },

    { kind: "heading", text: "When to reach for which" },
    {
      kind: "table",
      headers: ["Situation", "Use"],
      rows: [
        ["One long loop that janks the page", "`await scheduler.yield()` inside the loop"],
        ["Several jobs with different urgency", "`scheduler.postTask()` with distinct priorities"],
        ["Urgency changes after the work was queued", "`TaskController.setPriority()`"],
        ["Work that may stop mattering (user navigated away)", "`controller.abort()`"],
        ["CPU-heavy work that never touches the DOM", "A **Web Worker** — yielding still uses the main thread"],
        ["Low-priority work that can wait for an idle moment", "`requestIdleCallback()`"],
      ],
    },
    {
      kind: "callout",
      variant: "note",
      text: "The Scheduler API shares the main thread better. It does not give you a second one. For heavy, DOM-free work, `postMessage` to a Web Worker beats any amount of yielding.",
    },
    { kind: "heading", text: "Can I use" },
    {
      kind: "caniuse",
      feature: "mdn-api_scheduler_yield",
      title: "scheduler.yield()",
    },
    {
      kind: "caniuse",
      feature: "requestidlecallback",
      title: "requestIdleCallback()",
    },
  ],
};
