import type { JsDoc } from "../jsDocs";

const flattenExample = `function* flatten(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) yield* flatten(item);
    else yield item;
  }
}

// flatten(...) returns a generator object — spread it to actually run it.
console.log([...flatten([1, [2, 3, [4, 5]]])]); // [1, 2, 3, 4, 5]`;

const methodsExample = `function* counter() {
  try {
    let i = 0;
    while (true) yield i++;
  } finally {
    console.log("cleanup ran");
  }
}

const gen = counter();
console.log(gen.next()); // { value: 0, done: false }
gen.return(99);          // stops early, runs the finally block`;

const trafficLightPlayground = `function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function* trafficLight() {
  while (true) {
    console.log("red — stop");
    yield "red";
    await delay(2000);

    console.log("yellow — get ready");
    yield "yellow";
    await delay(1000);

    console.log("green — go");
    yield "green";
    await delay(2000);

    console.log("yellow — slow down");
    yield "yellow";
    await delay(1000);
  }
}

// Calling trafficLight() doesn't run it — it returns an async generator
// object. Drive it with a manual .next() loop (for await...of would work
// too, but never exits on its own since this generator never finishes).
(async () => {
  const signal = trafficLight();
  for (let i = 0; i < 8; i++) {
    const { value } = await signal.next();
    console.log("light is now:", value);
  }
  await signal.return(); // stop driving it once we're done watching
})();`;

export const generatorMethodsDoc: JsDoc = {
  slug: "generator-methods",
  title: "generator basics, yield*, and async generators",
  category: "reference",
  excerpt: ".next()/.throw()/.return(), yield* recursion, and async function*.",
  sections: [
    { kind: "heading", text: "Generator basics" },
    {
      kind: "list",
      items: [
        "`function*` — calling it returns an iterator, doesn't run the body.",
        "Iterable via `for...of` and spread `[...gen()]`.",
        "`.throw(err)` injects an error; `.return(val)` force-stops it.",
      ],
    },

    { kind: "heading", text: "Try it: .return()" },
    {
      kind: "playground",
      code: methodsExample,
      caption: "gen.return(99) stops counter() early — the finally block still runs.",
    },
    {
      kind: "list",
      ordered: true,
      items: [
        "`gen.next()` resumes the generator. It runs to `yield i++`, hands back `{ value: 0, done: false }`, and pauses right there — still inside the `try` block.",
        "`gen.return(99)` force-stops the generator from that paused point. Because it's paused inside a `try`, the `finally` block runs first, logging `\"cleanup ran\"`.",
        "Only after `finally` finishes does `.return(99)` actually complete, producing `{ value: 99, done: true }` — the value you passed in, with `done` now `true`.",
        "That result is also the last statement in the script, so the playground's bare-expression convention displays it as the final `=>` line.",
      ],
    },

    { kind: "heading", text: "yield* — delegation and recursion" },
    {
      kind: "paragraph",
      text: "`yield*` delegates to another generator — required for recursive generators.",
    },
    {
      kind: "playground",
      code: flattenExample,
      caption: "flatten() calls itself via yield* to walk nested arrays — [...flatten(arr)] drives it.",
    },

    { kind: "heading", text: "Async generators" },
    {
      kind: "paragraph",
      text: "`async function*` combines `yield` with `await`. Calling `trafficLight()` only returns an async generator object — an infinite one here, so a manual `.next()` loop drives it a fixed number of times instead of an unbounded `for await...of`. Stop below interrupts the loop between steps.",
    },
    {
      kind: "playground",
      code: trafficLightPlayground,
      height: 220,
      caption: "red (2s) → yellow (1s) → green (2s) → yellow (1s) — the Indian signal cycle, with yellow as a transition both ways. Each console.log fires right before its yield, so the log and the streamed value land together.",
    },

    { kind: "heading", text: "Can I use" },
    {
      kind: "caniuse",
      feature: "es6-generators",
      title: "Generators",
    },
    {
      kind: "caniuse",
      feature: "mdn-javascript_statements_for_await_of",
      title: "for await...of",
    },
  ],
};
