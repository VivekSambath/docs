import type { JsDoc } from "../jsDocs";

const stackExample = `function* pauseDemo() {
  console.log("2. before first yield");
  yield "A";
  console.log("5. resumed after first yield");
  yield "B";
  console.log("8. resumed after second yield");
}

const gen = pauseDemo();

console.log("1. call site: gen.next() pushes pauseDemo onto the stack");
console.log(gen.next()); // runs to "yield A", pops back off the stack

console.log("4. call site: gen.next() pushes pauseDemo back onto the stack");
console.log(gen.next()); // resumes after A, runs to "yield B", pops off again

console.log("7. call site: gen.next() resumes one last time");
console.log(gen.next()); // resumes after B, runs off the end, pops off for good`;

const basicExample = `function* sales() {
  yield 3;
  yield 7;
  yield 5;
}

const gen = sales();
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: 7, done: false }
console.log(gen.next()); // { value: 5, done: false }
console.log(gen.next()); // { value: undefined, done: true }`;

const twoWayExample = `function* chat() {
  const name = yield "Hi! What's your name?";
  yield \`Hi \${name}!\`;
}

const gen = chat();

console.log(gen.next().value); // "Hi! What's your name?" — priming call, argument is discarded

console.log(gen.next("Rin").value); // "Rin" fills in \`name\`, generator runs on to the next yield: "Hi Rin!"`;

const delegateExample = `function* inner() {
  yield "a";
  yield "b";
}

function* outer() {
  yield 1;
  yield* inner();
  yield 2;
}

// Calling outer() doesn't run it — it returns a generator object.
// Drive it with .next(), a for...of loop, or spread it like below.
console.log([...outer()]); // [1, "a", "b", 2]`;

const reactTabsExample = `import { useReducer } from "react";

// The generator is the single source of truth for the active tab — its
// \`active\` local variable never leaves the generator's own paused scope.
function* tabGenerator() {
  let active = "A";
  while (true) {
    const clicked = yield active; // pause here, holding active, until the next .next(clicked)
    if (clicked !== undefined && clicked !== active) {
      active = clicked;
      console.log("Tab changed");
    }
  }
}

const gen = tabGenerator();
let current = gen.next().value; // prime: run to the first yield, capture "A"

export default function App() {
  // No useState/useRef for the active tab — the generator holds that.
  // This dummy reducer's only job is telling React to re-render after
  // \`current\` (below) has been updated from the generator's new yield.
  const [, forceRender] = useReducer((n) => n + 1, 0);

  function selectTab(tab) {
    const next = gen.next(tab).value; // sends the click in, reads the new active tab back
    if (next === current) return;     // clicking the active tab: no state change, no re-render
    current = next;
    forceRender();
  }

  return (
    <div>
      <button onClick={() => selectTab("A")} style={{ fontWeight: current === "A" ? "bold" : "normal" }}>
        Tab A
      </button>
      <button onClick={() => selectTab("B")} style={{ fontWeight: current === "B" ? "bold" : "normal" }}>
        Tab B
      </button>
      <p>Active tab: {current}</p>
    </div>
  );
}`;

export const generatorsDoc: JsDoc = {
  slug: "generators",
  title: "yield & generator functions",
  category: "operator",
  excerpt: "yield pauses and resumes a function* mid-execution.",
  sections: [
    { kind: "heading", text: "What it does" },
    {
      kind: "paragraph",
      text: "A generator function (`function*`) can pause partway through and resume later, producing values one at a time instead of computing everything at once. Calling it doesn't run it — it returns a generator object with `.next()`, `.return()`, and `.throw()` methods to drive it.",
    },
    {
      kind: "paragraph",
      text: "`yield` is what pauses a generator. Each `.next()` call resumes it until the next `yield`, a `return`, or the end of the function — and only works directly inside the generator body, not in a nested regular function or an arrow function (there's no `=>*` syntax).",
    },
    { kind: "heading", text: "Syntax" },
    {
      kind: "code",
      language: "javascript",
      code: "yield\nyield expression",
    },
    {
      kind: "paragraph",
      text: "Think of it like a call stack that can be popped off mid-function and pushed back on later: each `.next()` call pushes the generator's frame back onto the stack, runs it until the next `yield`, then pops it back off — with all its local variables intact for the next push. Hit **Run** below and read the numbered log in order: steps 1, 4, and 7 are logged at the call site *before* each `.next()` call, steps 2, 5, and 8 are logged *inside* `pauseDemo` once that `.next()` call pushes its frame back onto the stack, and the returned `{ value, done }` object lands right after.",
    },
    {
      kind: "playground",
      code: stackExample,
      caption: "Each .next() re-pushes pauseDemo's paused frame onto the stack, runs to the next yield, then pops it back off.",
    },

    { kind: "heading", text: "Facts" },
    {
      kind: "list",
      items: [
        "`yield` with no value produces `undefined`.",
        "`.next(value)` sends `value` into the paused `yield`.",
        "The first `.next()` call's argument is discarded.",
        "`yield*` delegates to another generator.",
      ],
    },

    { kind: "heading", text: "Try it" },
    {
      kind: "playground",
      code: basicExample,
      caption: "A bare returned generator auto-unrolls step by step.",
    },

    { kind: "heading", text: "Two-way communication" },
    {
      kind: "paragraph",
      text: "`.next(value)` becomes the result of the paused `yield` expression — so a generator can read back whatever the caller sends in, like one side of a chat exchange. Below, `chat()` asks for a name and pauses on `yield`; the first `.next()` just starts the conversation (its argument is thrown away — there's no `yield` waiting yet to receive it), and `.next(\"Rin\")` answers that question, filling in `name` and letting the generator run on to greet back.",
    },
    {
      kind: "playground",
      code: twoWayExample,
      caption: "gen.next(\"Rin\") answers \"What's your name?\" and the generator greets back.",
    },

    { kind: "heading", text: "yield* delegation" },
    {
      kind: "paragraph",
      text: "`yield*` hands control to another generator and re-yields everything it produces. Calling `outer()` alone doesn't run anything — like any generator function, it just returns a generator object; spreading it with `[...outer()]` (or a `for...of` loop, or manual `.next()` calls) is what actually drives it.",
    },
    {
      kind: "playground",
      code: delegateExample,
      caption: "outer() delegates to inner() — the caller sees one flat sequence: 1, a, b, 2.",
    },

    { kind: "heading", text: "React tab switcher" },
    {
      kind: "paragraph",
      text: "A generator can hold UI state entirely in its own paused local scope, with no `useState` or `useRef` at all. Below, `yield` pauses the generator right after it hands back the active tab; `.next(clickedTab)` resumes it, sending `clickedTab` in as the result of that paused `yield` expression.",
    },
    {
      kind: "code",
      language: "jsx",
      code: reactTabsExample,
      caption: "Drop this in as App.jsx in a Vite + React project.",
    },
    {
      kind: "callout",
      variant: "warning",
      text: "Limitation: React only re-renders on a state change, and the generator's internal state isn't React state — nothing subscribes to it. The `useReducer` dummy counter above exists purely to force a re-render after each click; without it, `current` would update correctly but the screen would never repaint. In practice, useState is simpler and does this for you — this pattern is a demonstration of what yield can do, not a recommended way to manage real UI state.",
    },

    { kind: "heading", text: "Can I use" },
    {
      kind: "caniuse",
      feature: "es6-generators",
      title: "Generators",
    },
  ],
};
