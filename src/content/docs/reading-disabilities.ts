import type { DocArticle } from "../articles";

export const readingDisabilities: DocArticle = {
  kind: "doc",
  slug: "reading-disabilities",
  title: "Designing for Reading Disabilities",
  excerpt:
    "Plain language, chunked content, and descriptive labels aren't extras — they're what makes an interface usable for the large, often invisible share of users who struggle with dense text.",
  date: "2026-07-21",
  category: "Frontend Best Practices",
  sections: [
    { kind: "heading", text: "Introduction" },
    {
      kind: "paragraph",
      text: "\"Reading disabilities\" is a broad umbrella:",
    },
    {
      kind: "list",
      items: [
        "Dyslexia.",
        "ADHD-related fatigue.",
        "Low literacy.",
        "Second-language readers.",
        "Plain cognitive load under stress.",
      ],
    },
    {
      kind: "paragraph",
      text: "It's not a niche audience, and the fixes are just **wording, structure, and semantic markup** — ==no redesign required==.",
    },
    {
      kind: "mindmap",
      root: "Reading disabilities",
      branches: [
        { label: "Cognitive load", children: ["Dense text costs attention", "Plain text saves it"] },
        { label: "Wording", children: ["Short sentences", "Descriptive buttons & links"] },
        { label: "Structure", children: ["Chunked content", "Real headings"] },
        { label: "Forms & errors", children: ["Visible labels", "Specific error messages"] },
      ],
      caption: "The whole article in one map — jump to any branch via the table of contents.",
    },

    { kind: "heading", text: "Cognitive Load" },
    {
      kind: "paragraph",
      text: "Cognitive load is the mental effort it takes to understand something, drawn from the same limited attention budget as the task itself. Dense paragraphs and jargon spend that budget decoding words instead of leaving it for the user's actual goal.",
    },
    {
      kind: "ascii",
      art:
        "Total attention budget for one page visit\n\nDense, jargon-heavy page\n+----------------------------------+---------------+\n|      spent parsing the text       |  left for the |\n|  (headline, legal copy, jargon)  |  actual task  |\n|                                   |    (~15%)     |\n+----------------------------------+---------------+\n\nPlain-language, chunked page\n+----------------+------------------------------------+\n|  spent parsing |       left for the actual task      |\n|   the text     |               (~65%)                 |\n+----------------+------------------------------------+",
      caption:
        "Every word the reader has to decode is spent from the same budget. Dense copy leaves less attention for the thing they actually came to do.",
    },
    {
      kind: "callout",
      variant: "tip",
      text: "These techniques help everyone, not just people with a diagnosed reading disability. Bright sunlight on a phone screen, a bad night's sleep, a stressful day, a slow connection, reading in your second language — ==situational impairment is far more common than permanent impairment==, and it hits every one of your users eventually.",
    },

    { kind: "heading", text: "Plain Language & Short Sentences" },
    {
      kind: "paragraph",
      text: "Long sentences with multiple clauses force the reader to hold more in their head before the meaning resolves. Plain verbs and shorter sentences aren't dumbing content down — they cut decoding work that wasn't adding real information.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Legalistic, one long sentence",
          status: "bad",
          editable: true,
          htmlSource: `<p class="copy">In the event that you wish to terminate your subscription, please be advised that a written notice period of no less than thirty (30) days prior to the desired cancellation date is required in order to process your request.</p>`,
          cssSource: `.copy {
  max-width: 34ch;
  font-size: 15px;
  line-height: 1.6;
}`,
        },
        {
          label: "Plain, short sentence",
          status: "good",
          editable: true,
          htmlSource: `<p class="copy">To cancel your subscription, send us written notice at least 30 days before the date you want it to end.</p>`,
          cssSource: `.copy {
  max-width: 34ch;
  font-size: 15px;
  line-height: 1.6;
}`,
        },
      ],
      height: 160,
      caption:
        "Same information, same width column — the plain version resolves in one pass instead of forcing the reader to hold three nested clauses in mind at once. Edit either paragraph and compare how long it takes to parse.",
    },

    { kind: "heading", text: "Chunking Content" },
    {
      kind: "paragraph",
      text: "A wall of text signals \"this will take effort\" before a reader parses a single word, and some will bail before starting. Short paragraphs, real subheadings, and lists let readers scan for what they need instead of processing everything linearly.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Dense wall of text",
          status: "bad",
          editable: true,
          htmlSource: `<p class="wall">To set up shipping you'll need to add a return address, choose which countries you ship to, decide whether you offer free shipping over a certain order amount, set a flat rate or weight-based rate table, and configure how long orders typically take to arrive since this shows up on the product page and affects customer expectations and support volume if it's wrong, so double check it before publishing your store.</p>`,
          cssSource: `.wall {
  max-width: 32ch;
  font-size: 14px;
  line-height: 1.5;
}`,
          tailwind: '<p class="max-w-[32ch] text-sm leading-relaxed">',
        },
        {
          label: "Chunked into a list",
          status: "good",
          editable: true,
          htmlSource: `<h3 class="title">Set up shipping</h3>
<ol class="steps">
  <li>Add a return address.</li>
  <li>Choose which countries you ship to.</li>
  <li>Set a flat rate, or a rate based on order weight.</li>
  <li>Optional: offer free shipping over a set order amount.</li>
  <li>Add an estimated delivery time. This shows up on your product page.</li>
</ol>`,
          cssSource: `.title {
  margin: 0 0 8px;
  font-size: 15px;
}
.steps {
  max-width: 32ch;
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.6;
}
.steps li + li {
  margin-top: 4px;
}`,
          tailwind: '<h3 class="mb-2 text-base"> / <ol class="max-w-[32ch] list-decimal pl-5 text-sm leading-relaxed [&>li+li]:mt-1">',
        },
      ],
      height: 220,
      caption:
        "Same five facts, two shapes. The wall makes you read every word to find the one you need; the chunked list lets you scan it in a glance. Edit the CSS to see how spacing and list markers affect scannability.",
    },

    { kind: "heading", text: "Better Headings" },
    {
      kind: "paragraph",
      text: "A heading's job is to let someone decide, without reading the paragraph underneath it, whether that section is relevant to them. A vague heading fails at that and forces readers to read everything just to find the one part they needed.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Vague headings",
          status: "bad",
          editable: true,
          htmlSource: `<article class="doc">
  <h3>Details</h3>
  <p>Orders placed before 2pm ship the same day.</p>
  <h3>More Information</h3>
  <p>Contact support within 30 days for a refund.</p>
</article>`,
          cssSource: `.doc { max-width: 34ch; }
.doc h3 { margin: 12px 0 2px; font-size: 14px; }
.doc h3:first-child { margin-top: 0; }
.doc p { margin: 0; font-size: 13px; line-height: 1.5; color: #525252; }`,
        },
        {
          label: "Descriptive headings",
          status: "good",
          editable: true,
          htmlSource: `<article class="doc">
  <h3>Shipping and delivery times</h3>
  <p>Orders placed before 2pm ship the same day.</p>
  <h3>Refund policy</h3>
  <p>Contact support within 30 days for a refund.</p>
</article>`,
          cssSource: `.doc { max-width: 34ch; }
.doc h3 { margin: 12px 0 2px; font-size: 14px; }
.doc h3:first-child { margin-top: 0; }
.doc p { margin: 0; font-size: 13px; line-height: 1.5; color: #525252; }`,
        },
      ],
      height: 190,
      caption:
        "Try scanning just the headings in each pane, without reading the paragraphs underneath. Only the descriptive version tells you where the refund information actually is.",
    },

    { kind: "heading", text: "Better Buttons" },
    {
      kind: "paragraph",
      text: "A button's label is ==a promise about what happens next==. \"Submit\" makes the reader guess; **naming the actual action** removes the hesitation that shows up right before people abandon a form.",
    },
    {
      kind: "comparison",
      before: {
        label: "Vague",
        points: ["\"Submit\"", "\"Click Here\"", "\"OK\""],
      },
      after: {
        label: "Descriptive",
        points: [
          "\"Create account\"",
          "\"Download invoice (PDF)\"",
          "\"Review your order\"",
        ],
      },
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Vague button label",
          status: "bad",
          editable: true,
          htmlSource: `<button class="btn">Submit</button>`,
          cssSource: `.btn {
  padding: 10px 18px;
  border: 1px solid #171717;
  border-radius: 6px;
  background: #171717;
  color: #fff;
  font: inherit;
  font-weight: 600;
}`,
          tailwind: '<button class="rounded-md border border-neutral-900 bg-neutral-900 px-4.5 py-2.5 font-semibold text-white">',
        },
        {
          label: "Descriptive button label",
          status: "good",
          editable: true,
          htmlSource: `<button class="btn">Create account</button>`,
          cssSource: `.btn {
  padding: 10px 18px;
  border: 1px solid #171717;
  border-radius: 6px;
  background: #171717;
  color: #fff;
  font: inherit;
  font-weight: 600;
}`,
          tailwind: '<button class="rounded-md border border-neutral-900 bg-neutral-900 px-4.5 py-2.5 font-semibold text-white">',
        },
      ],
      height: 100,
      caption:
        "Same button, same styling — only the label changes. \"Submit\" promises nothing; \"Create account\" tells you exactly what happens when you click.",
    },

    { kind: "heading", text: "Better Links" },
    {
      kind: "paragraph",
      text: "\"Click here\" and \"read more\" describe the act of clicking, not the destination — meaningless out of context.",
    },
    {
      kind: "comparison",
      before: {
        label: "Vague link text",
        points: ["\"Click here\"", "\"Read more\"", "\"Learn more\""],
      },
      after: {
        label: "Descriptive link text",
        points: [
          "\"Read our full shipping policy\"",
          "\"Compare pricing plans\"",
          "\"Download the 2026 tax guide (PDF)\"",
        ],
      },
    },
    {
      kind: "callout",
      variant: "note",
      text: "Screen readers can generate a list of all links on a page for quick navigation, stripped of surrounding sentence context. Link text needs to make sense completely on its own, not just inside the paragraph it happens to sit in.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Vague, out of context",
          status: "bad",
          editable: true,
          htmlSource: `<ul class="links">
  <li><a href="#">Click here</a></li>
  <li><a href="#">Read more</a></li>
  <li><a href="#">Learn more</a></li>
</ul>`,
          cssSource: `.links {
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
  max-width: 240px;
}
.links li {
  border-bottom: 1px solid #e5e5e5;
}
.links li:last-child {
  border-bottom: none;
}
.links a {
  display: block;
  padding: 8px 4px;
  color: #0060df;
}`,
        },
        {
          label: "Descriptive, out of context",
          status: "good",
          editable: true,
          htmlSource: `<ul class="links">
  <li><a href="#">Read our full shipping policy</a></li>
  <li><a href="#">Compare pricing plans</a></li>
  <li><a href="#">Download the 2026 tax guide (PDF)</a></li>
</ul>`,
          cssSource: `.links {
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
  max-width: 240px;
}
.links li {
  border-bottom: 1px solid #e5e5e5;
}
.links li:last-child {
  border-bottom: none;
}
.links a {
  display: block;
  padding: 8px 4px;
  color: #0060df;
}`,
        },
      ],
      height: 170,
      caption:
        "This is effectively a screen reader's link-list view — every surrounding sentence stripped away, only the link text left. One column is a guessing game; the other tells you exactly where each link goes. Try tabbing through each list.",
    },

    { kind: "heading", text: "Better Forms" },
    {
      kind: "paragraph",
      text: "A placeholder is not a label — it disappears the moment someone starts typing, so the hint is gone by the time they pause to double-check the field. Keep labels visible at all times, one field per row.",
    },
    {
      kind: "demo",
      panes: [
        {
          label: "placeholder only",
          status: "bad",
          editable: true,
          tailwind: '<input class="w-full max-w-55 rounded-md border border-neutral-400 px-3 py-2.5">',
          htmlSource: `<input type="text" placeholder="Full name" />`,
          cssSource: `input {
  width: 100%;
  max-width: 220px;
  padding: 10px 12px;
  border: 1px solid #a3a3a3;
  border-radius: 6px;
  font: inherit;
}
input:focus {
  outline: 2px solid #0060df;
  outline-offset: 1px;
}`,
        },
        {
          label: "visible label",
          status: "good",
          editable: true,
          tailwind: '<label class="mb-1.5 block text-xs font-semibold" for="name">Full name</label>\n<input class="w-full max-w-55 rounded-md border border-neutral-400 px-3 py-2.5" id="name">',
          htmlSource: `<div class="field">
  <label for="name">Full name</label>
  <input id="name" type="text" />
</div>`,
          cssSource: `.field {
  width: 100%;
  max-width: 220px;
}
label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 12px;
}
input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #a3a3a3;
  border-radius: 6px;
  font: inherit;
}
input:focus {
  outline: 2px solid #0060df;
  outline-offset: 1px;
}`,
        },
      ],
      height: 130,
      caption:
        "Click into each field and type. The placeholder-only version loses its only hint the moment you start typing; the labeled version keeps it visible the whole time.",
    },
    {
      kind: "code",
      language: "html",
      label: "Bad",
      code: "<form>\n  <input type=\"text\" placeholder=\"Full name\" />\n  <input type=\"email\" placeholder=\"Email address\" />\n  <input type=\"password\" placeholder=\"Password\" />\n  <button>Submit</button>\n</form>",
    },
    {
      kind: "code",
      language: "html",
      label: "Good",
      code: "<form>\n  <div>\n    <label for=\"name\">Full name</label>\n    <input id=\"name\" type=\"text\" />\n  </div>\n  <div>\n    <label for=\"email\">Email address</label>\n    <input id=\"email\" type=\"email\" />\n  </div>\n  <div>\n    <label for=\"password\">Password</label>\n    <input id=\"password\" type=\"password\" />\n  </div>\n  <button>Create account</button>\n</form>",
    },

    { kind: "heading", text: "Better Error Messages" },
    {
      kind: "paragraph",
      text: "\"Invalid input\" tells someone that something is wrong without telling them what, or how to fix it. A good error message does three things:",
    },
    {
      kind: "list",
      items: [
        "Names the field.",
        "Explains the problem in plain words.",
        "Says what to do next.",
      ],
    },
    {
      kind: "demo",
      panes: [
        {
          label: "Vague error",
          status: "bad",
          editable: true,
          htmlSource: `<div class="field">
  <label for="email1">Email address</label>
  <input id="email1" type="text" value="not-an-email" />
  <p class="error">Invalid input.</p>
</div>`,
          cssSource: `.field {
  width: 100%;
  max-width: 240px;
}
label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 12px;
}
input {
  width: 100%;
  padding: 9px 10px;
  border: 1px solid #dc2626;
  border-radius: 6px;
  font: inherit;
}
.error {
  margin: 6px 0 0;
  font-size: 12px;
  color: #dc2626;
}`,
        },
        {
          label: "Specific, actionable error",
          status: "good",
          editable: true,
          htmlSource: `<div class="field">
  <label for="email2">Email address</label>
  <input id="email2" type="text" value="not-an-email" />
  <p class="error">Enter your email in the format name@example.com.</p>
</div>`,
          cssSource: `.field {
  width: 100%;
  max-width: 240px;
}
label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 12px;
}
input {
  width: 100%;
  padding: 9px 10px;
  border: 1px solid #dc2626;
  border-radius: 6px;
  font: inherit;
}
.error {
  margin: 6px 0 0;
  font-size: 12px;
  color: #dc2626;
}`,
        },
      ],
      height: 150,
      caption:
        "Both fields show the same invalid value. Only the second message tells the reader what format is expected, so they can fix it without guessing.",
    },

    { kind: "heading", text: "Accessible Documentation Writing" },
    {
      kind: "paragraph",
      text: "Everything above applies double to docs and tooltips, since people reach for them exactly when they're already stuck. Prefer a concrete example over an abstract description, and split nested conditions (\"if X, unless Y, except Z\") into a plain common case plus a separate note for exceptions.",
    },
    {
      kind: "callout",
      variant: "tip",
      text: "Run your docs and help text through a readability tool (most flag average sentence length and reading grade level). It won't catch everything, but it's a fast way to spot the sentences that have quietly grown three clauses too many.",
    },

    { kind: "heading", text: "Practical UI Examples" },
    {
      kind: "paragraph",
      text: "The patterns above, applied to five common UI contexts.",
    },

    { kind: "heading", text: "Login page", level: 3 },
    {
      kind: "comparison",
      before: {
        label: "Vague",
        points: ["\"Login failed.\"", "\"Error: auth_failed\"", "\"Try again.\""],
      },
      after: {
        label: "Clear",
        points: [
          "\"Incorrect email or password. Try again or reset your password.\"",
          "\"We couldn't verify your account. Double-check your email and password.\"",
          "\"Too many attempts. Wait 5 minutes or reset your password.\"",
        ],
      },
    },

    { kind: "heading", text: "Checkout", level: 3 },
    {
      kind: "comparison",
      before: {
        label: "Vague",
        points: [
          "\"Continue\"",
          "\"Processing...\"",
          "\"Shipping: Standard\"",
        ],
      },
      after: {
        label: "Clear",
        points: [
          "\"Review your order\"",
          "\"Placing your order — don't close this tab\"",
          "\"Standard shipping: 5-7 business days, $4.99\"",
        ],
      },
    },

    { kind: "heading", text: "Dashboard", level: 3 },
    {
      kind: "comparison",
      before: {
        label: "Jargon-heavy",
        points: [
          "\"MRR: $12,402 (+3.2% WoW)\"",
          "\"Churn: 1.8%\"",
          "\"ARPU trending upward\"",
        ],
      },
      after: {
        label: "Plain language",
        points: [
          "\"You made $12,402 this month, up 3% from last week\"",
          "\"2 out of every 100 customers canceled this month\"",
          "\"Customers are spending more per order, on average\"",
        ],
      },
    },

    { kind: "heading", text: "Empty state", level: 3 },
    {
      kind: "comparison",
      before: {
        label: "Bare",
        points: ["\"No data.\"", "(no next step offered)"],
      },
      after: {
        label: "Helpful",
        points: [
          "\"You haven't created any projects yet.\"",
          "\"Create your first project to start tracking tasks.\"",
          "Button: \"Create project\"",
        ],
      },
    },

    { kind: "heading", text: "Settings page", level: 3 },
    {
      kind: "comparison",
      before: {
        label: "Technical",
        points: [
          "\"Enable 2FA\"",
          "\"Data sync interval\"",
          "\"Aggressive prefetching\"",
        ],
      },
      after: {
        label: "Plain language, one-line explanation",
        points: [
          "\"Require a code when signing in (two-factor authentication)\"",
          "\"How often we back up your data — every 15 minutes\"",
          "\"Load pages before you click them, so browsing feels faster\"",
        ],
      },
    },

    { kind: "heading", text: "Common Mistakes" },
    {
      kind: "list",
      items: [
        "Walls of text with no subheadings, forcing readers to scan everything to find the one relevant sentence.",
        "Technical jargon or internal error codes surfacing directly in user-facing error messages.",
        "Using placeholder text as the only label on a form field, so the hint vanishes the moment someone starts typing.",
        "\"Click here\" or \"read more\" as link text, meaningless out of context and unhelpful for screen reader users navigating by link list.",
      ],
    },

    { kind: "heading", text: "Best Practices" },
    {
      kind: "list",
      items: [
        "Write short sentences with one idea each — split anything with more than one \"and\" or \"but\".",
        "Keep labels visible at all times; never rely on a placeholder as the only label.",
        "Make buttons and links name the actual action or destination, not the act of clicking.",
        "Write error messages that name the problem and the fix, not just that something went wrong.",
      ],
    },

    { kind: "heading", text: "Browser Support" },
    {
      kind: "paragraph",
      text: "Plain language has no browser dependency, but the markup underneath does: a real <label>, <button>, and ordered heading hierarchy (h1–h3) are what let screen readers and reader-mode features reconstruct the page correctly — all broadly supported today.",
    },
    {
      kind: "caniuse",
      feature: "mdn-html_elements_label",
      title: "<label> element",
      caption: "The <label>/<input> association behind the visible-label demo above — supported in every modern browser.",
    },

    { kind: "heading", text: "Key Takeaways" },
    {
      kind: "list",
      items: [
        "Reading disabilities and reading difficulties cover a wide, largely invisible range of users — this is not a niche audience.",
        "Cognitive load is a limited budget; dense copy spends it before the reader even reaches the task.",
        "Buttons, links, and error messages should name the actual action, destination, or problem — never leave the reader guessing.",
        "These fixes help everyone under situational impairment — tired, stressed, or reading in a second language — not just users with a diagnosed condition.",
      ],
    },
  ],
};
