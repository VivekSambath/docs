import type { JsDoc } from "../jsDocs";

const workdayExample = `scheduler.postTask(() => deleteOldBranches(), { priority: "background" });
scheduler.postTask(() => reviewThePR(),       { priority: "user-visible" });
scheduler.postTask(() => unblockTeammate(),   { priority: "user-blocking" });

// Your morning: teammate, then the PR, then the branches.`;

const postTaskBasic = `// Queue three tasks at three different priorities.
scheduler.postTask(() => {
  console.log("runs soon, but not urgently");
}, { priority: "user-visible" }); // the default

scheduler.postTask(() => {
  console.log("runs ASAP — ahead of the one above");
}, { priority: "user-blocking" });

scheduler.postTask(() => {
  console.log("runs when the thread is free");
}, { priority: "background" });

// Logged order: "runs ASAP", "runs soon", "runs when the thread is free"
// — queue order does not decide execution order, priority does.`;

const postTaskAwait = `// postTask returns a promise that resolves with the callback's return value.
const result = await scheduler.postTask(() => computeExpensiveThing(), {
  priority: "user-blocking",
});

// It rejects if the callback throws, so try/catch works normally.
try {
  await scheduler.postTask(mayThrow, { priority: "background" });
} catch (err) {
  console.error("task failed:", err);
}

// The delay option queues the task after a timeout, like setTimeout but prioritized.
scheduler.postTask(() => refreshBadgeCount(), {
  priority: "background",
  delay: 2000,
});`;

const taskControllerExample = `// A TaskController owns both the priority and the abort signal for a task.
const controller = new TaskController({ priority: "background" });

scheduler.postTask(() => loadComments(), { signal: controller.signal });

// The user scrolled the comments into view — it matters now.
controller.setPriority("user-blocking");

// They navigated away before it ran — drop it entirely.
controller.abort();`;

const taskSignalExample = `// One controller can govern many tasks: they all move together.
const controller = new TaskController({ priority: "background" });
const { signal } = controller;

for (const widget of offscreenWidgets) {
  scheduler.postTask(() => hydrate(widget), { signal });
}

// Reading the live values off the signal:
console.log(signal.priority); // "background"
signal.addEventListener("prioritychange", (event) => {
  console.log("was", event.previousPriority, "now", signal.priority);
});

controller.setPriority("user-visible"); // every queued hydrate() moves up at once`;

export const schedulerPostTaskDoc: JsDoc = {
  slug: "scheduler-post-task",
  title: "scheduler.postTask()",
  category: "api",
  excerpt: "Queue several jobs with a priority, so the browser runs the urgent one first.",
  sections: [
    {
      kind: "paragraph",
      text: "One of the Scheduler API's two halves. `postTask()` is for ==several separate jobs== of differing urgency — you label each one, and the browser runs the most urgent first. For splitting a ==single== long job, see [scheduler.yield()](#/js-docs/scheduler-yield); for why either exists, start with [the idea](#/js-docs/scheduler-api).",
    },

    { kind: "heading", text: "Syntax" },
    {
      kind: "code",
      language: "js",
      code: `// Queue a task at a priority. Returns a promise for the callback's result.
scheduler.postTask(callback, {
  priority: "user-blocking" | "user-visible" | "background",
  signal: taskSignal,   // optional — abort and/or re-prioritize
  delay: milliseconds,  // optional — queue it after a timeout
});

// A controller that can change a task's priority after it's queued.
const controller = new TaskController({ priority: "user-visible" });`,
    },

    { kind: "heading", text: "The three priorities" },
    {
      kind: "paragraph",
      text: "`postTask()` takes a callback and a priority. ==Three lanes, one main thread==: higher priority runs first, and inside a lane, queue order wins.",
    },
    {
      kind: "ascii",
      art: `  user-blocking      user-visible        background
  (runs first)       (the default)       (runs last)
       |                   |                   |
       +---------------+---+---------------+---+
                       |
                       v
              +------------------+
              |   main thread    |
              | one task at a time |
              +------------------+`,
      caption: "Higher-priority tasks run before lower-priority ones on the same thread.",
    },

    {
      kind: "paragraph",
      text: "It's your morning queue. Three things to do, ==one pair of hands==, so the only question is who's blocked on you.",
    },
    {
      kind: "list",
      icons: ["cursor", "eye", "clock"],
      items: [
        "`user-blocking` — a teammate is ==stuck at your desk==. Clicks, spinners, keystrokes.",
        "`user-visible` — a PR to review ==before standup==. Lists, hydration. This is the default.",
        "`background` — old branches to tidy ==sometime==. Analytics, prefetch, logging.",
      ],
    },
    {
      kind: "code",
      language: "js",
      code: workdayExample,
      caption: "Written cleanup-first — the blocked teammate still goes first.",
    },
    {
      kind: "scheduler-demo",
      demo: "priority",
      caption: "Six real `postTask()` calls, queued worst-first. Compare the two columns.",
    },
    {
      kind: "paragraph",
      text: "The order you write them in ==doesn't matter==; the label does. One catch: if you're already deep in the cleanup when they walk over, they wait — priority picks ==what you do next==, never what you drop.",
    },
    {
      kind: "table",
      headers: ["Priority", "Rule of thumb"],
      rows: [
        ["`user-blocking`", "Runs first. Use it rarely — if everything is urgent, nothing is."],
        ["`user-visible`", "**The default** when you omit `priority`. Most work belongs here."],
        ["`background`", "Never competes with a click or a frame."],
      ],
    },
    {
      kind: "callout",
      variant: "note",
      text: "Priority only orders **your own queued tasks**. It cannot interrupt work already running — the thing you're already mid-way through. Once a task starts it runs to the end, so a `user-blocking` task queued during a 500ms loop still waits for that loop. Priority picks what runs next; `yield()` decides when \"next\" arrives — which is why the two halves are used together.",
    },

    { kind: "heading", text: "Return value, errors, and delay" },
    {
      kind: "code",
      language: "js",
      code: postTaskBasic,
      caption: "Queue order doesn't decide run order — priority does.",
    },
    {
      kind: "paragraph",
      text: "Three things worth knowing about the return value and options:",
    },
    {
      kind: "list",
      icons: ["task", "shield", "clock"],
      items: [
        "It returns a **promise**, resolving with your callback's ==return value==.",
        "It **rejects** if the callback throws — so `await` and `try`/`catch` work as usual.",
        "The optional `delay` queues it after a timeout — like `setTimeout`, ==but with priority==.",
      ],
    },
    { kind: "code", language: "js", code: postTaskAwait },

    { kind: "heading", text: "Changing priority with TaskController" },
    {
      kind: "paragraph",
      text: "A queued task isn't stuck at the priority you gave it. `TaskController` extends `AbortController`, so one object can ==re-rank or cancel== work when the user's attention moves.",
    },
    {
      kind: "list",
      icons: ["label", "cancel"],
      items: [
        "`controller.setPriority(p)` — the work ==suddenly matters more== (or less) than when you queued it.",
        "`controller.abort()` — the work ==stopped mattering==, so drop it before it ever runs.",
      ],
    },
    {
      kind: "ascii",
      art: `  const controller = new TaskController({ priority: "background" })
                              |
                    controller.signal
                              |
          +-------------------+-------------------+
          |                   |                   |
      task A              task B              task C
     (queued)            (queued)            (queued)

  controller.setPriority("user-blocking")   -> A, B, C all move up
  controller.abort()                        -> A, B, C all dropped`,
      caption: "One controller, one signal, many tasks — they move together.",
    },
    { kind: "code", language: "js", code: taskControllerExample },
    {
      kind: "paragraph",
      text: "Pass the signal to each task and one controller drives the whole batch. It also fires a `prioritychange` event you can listen for.",
    },
    { kind: "code", language: "js", code: taskSignalExample },
    {
      kind: "callout",
      variant: "warning",
      text: "Pass `signal` **or** `priority`, not both. With a `TaskSignal`, the signal's priority wins; adding an explicit `priority` locks that task's priority, so `setPriority()` stops affecting it. A plain `AbortSignal` also works, but it only cancels — it can't re-prioritize.",
    },
    { kind: "heading", text: "Can I use" },
    {
      kind: "caniuse",
      feature: "mdn-api_scheduler_postTask",
      title: "scheduler.postTask()",
    },
  ],
};
