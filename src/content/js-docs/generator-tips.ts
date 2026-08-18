import type { JsDoc } from "../jsDocs";

const customIterableExample = `class Range {
  constructor(start, end) { this.start = start; this.end = end; }
  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i++) yield i;
  }
}

[...new Range(1, 5)];`;

const lazyVsNativeExample = `const SIZE = 1_000_000;
const isEven = (n) => n % 2 === 0;
const big = Array.from({ length: SIZE }, (_, i) => i + 1);

const t0 = performance.now();
const native = big.filter(isEven).map((n) => n * 2).slice(0, 3);
const nativeMs = (performance.now() - t0).toFixed(2);

function* naturals() { let n = 1; while (true) yield n++; }
function* filterMap(iter) {
  for (const n of iter) if (isEven(n)) yield n * 2;
}

const t1 = performance.now();
const lazy = [];
for (const n of filterMap(naturals())) {
  lazy.push(n);
  if (lazy.length === 3) break;
}
const lazyMs = (performance.now() - t1).toFixed(2);

console.log("native:", native, nativeMs + "ms");
console.log("lazy:  ", lazy, lazyMs + "ms");`;

const cooperativeExample = `function* heavyTask(items) {
  for (const item of items) {
    console.log(item * item);
    yield; // let the event loop breathe
  }
}

const gen = heavyTask([1, 2, 3]);
const step = () => { if (!gen.next().done) setTimeout(step, 0); };
step();`;

const twoWayFlowExample = `function* wizard() {
  const name = yield "name?";
  return \`hi \${name}\`;
}

const flow = wizard();
console.log(flow.next().value);      // "name?"
console.log(flow.next("Ada").value); // "hi Ada"`;

const primingExample = `function* echoer() {
  const received = yield;
  console.log("got:", received);
}

const bad = echoer();
bad.next("hello"); // dropped — nothing yielded yet to receive it

const good = echoer();
good.next();        // prime
good.next("hello"); // arrives`;

const delegationExample = `function* inner() {
  yield "a";
  yield "b";
}

function* outer() {
  yield* inner(); // forwards .throw()/.return() too
}

[...outer()];`;

const gcExample = `function* readLines() {
  try {
    yield "line 1";
    yield "line 2";
  } finally {
    console.log("closed");
  }
}

const lines = readLines();
console.log(lines.next().value); // "line 1"
lines.return();                  // cleans up now, not later`;

export const generatorTipsDoc: JsDoc = {
  slug: "generator-tips",
  title: "Generator tips & tricks",
  category: "reference",
  excerpt: "Small, practical generator patterns.",
  sections: [
    { kind: "heading", text: "1. Custom iterables" },
    {
      kind: "paragraph",
      text: "A `*` before a method name makes it a generator method — an easy `Symbol.iterator`.",
    },
    {
      kind: "playground",
      code: customIterableExample,
      caption: "Range's Symbol.iterator is a generator method.",
    },

    { kind: "heading", text: "2. Lazy pipelines skip unneeded work" },
    {
      kind: "paragraph",
      text: "A generator pipeline only computes what's actually consumed.",
    },
    {
      kind: "playground",
      code: lazyVsNativeExample,
      height: 260,
      caption: "Native filter().map() processes all 1,000,000 items; the lazy version stops after 3.",
    },

    { kind: "heading", text: "3. Cooperative multitasking" },
    {
      kind: "paragraph",
      text: "Yield between chunks of work so the event loop gets a turn.",
    },
    {
      kind: "playground",
      code: cooperativeExample,
      caption: "yield pauses; setTimeout(step, 0) resumes on the next tick.",
    },

    { kind: "heading", text: "4. Two-way yield for input-driven flows" },
    {
      kind: "playground",
      code: twoWayFlowExample,
      caption: "Each .next(answer) both answers and asks the next question.",
    },

    { kind: "heading", text: "5. Prime before sending input" },
    {
      kind: "paragraph",
      text: "The first `.next(value)` is always discarded — call `.next()` once first.",
    },
    {
      kind: "playground",
      code: primingExample,
      caption: "bad's \"hello\" vanishes; good primes first and receives it.",
    },

    { kind: "heading", text: "6. Prefer yield* over a manual loop" },
    {
      kind: "playground",
      code: delegationExample,
      caption: "yield* also forwards .throw()/.return() into inner() — a manual loop doesn't.",
    },

    { kind: "heading", text: "7. Cleanup with .return()" },
    {
      kind: "paragraph",
      text: "A generator held open with a resource should be `.return()`-ed, not left dangling.",
    },
    {
      kind: "playground",
      code: gcExample,
      caption: "lines.return() runs the finally block immediately.",
    },

    { kind: "heading", text: "Can I use" },
    {
      kind: "caniuse",
      feature: "es6-generators",
      title: "Generators",
    },
  ],
};
