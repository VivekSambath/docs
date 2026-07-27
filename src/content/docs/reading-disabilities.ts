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
      text: "\"Reading disabilities\" is a broad umbrella — dyslexia, ADHD-related fatigue, low literacy, second-language readers, and plain cognitive load under stress. It's not a niche audience: almost everyone's reading ability dips under fatigue or time pressure. The fixes are the same for all of it, and none of them require a redesign — just wording, structure, and semantic markup you can ship directly.",
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
      text: "Cognitive load is how much mental effort it takes to understand something — and every person has a limited attention budget, shared with the actual task, stress, and distractions.",
    },
    {
      kind: "paragraph",
      text: "Dense paragraphs and jargon spend that budget just decoding the words. Short sentences and plain language don't simplify the interface — they leave more brainpower for the user's actual goal.",
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
      text: "These techniques help everyone, not just people with a diagnosed reading disability. Bright sunlight on a phone screen, a bad night's sleep, a stressful day, a slow connection, reading in your second language — situational impairment is far more common than permanent impairment, and it hits every one of your users eventually.",
    },

    { kind: "heading", text: "Plain Language & Short Sentences" },
    {
      kind: "paragraph",
      text: "Long sentences with multiple clauses force the reader to hold more in their head before the meaning resolves. Swapping formal or legalistic phrasing for plain verbs and shorter sentences doesn't dumb the content down — it just removes the extra decoding work that wasn't adding any real information.",
    },
    {
      kind: "comparison",
      before: {
        label: "Original",
        points: [
          "\"In the event that you wish to terminate your subscription, please be advised that a written notice period of no less than thirty (30) days prior to the desired cancellation date is required in order to process your request.\"",
          "47 words, one sentence, three nested clauses",
        ],
      },
      after: {
        label: "Rewritten",
        points: [
          "\"To cancel your subscription, send us written notice at least 30 days before the date you want it to end.\"",
          "22 words, active voice, one idea per clause",
        ],
      },
    },

    { kind: "heading", text: "Chunking Content" },
    {
      kind: "paragraph",
      text: "A wall of text is intimidating before a reader has parsed a single word of it — the sheer density signals \"this will take effort,\" and some readers will bail before they start. Breaking the same content into short paragraphs, real subheadings, and bullet lists lets readers scan for what they need instead of processing everything linearly.",
    },
    {
      kind: "code",
      language: "html",
      label: "Bad",
      code: "<p>\n  To set up shipping you'll need to add a return address, choose which\n  countries you ship to, decide whether you offer free shipping over a\n  certain order amount, set a flat rate or weight-based rate table, and\n  configure how long orders typically take to arrive since this shows up\n  on the product page and affects customer expectations and support\n  volume if it's wrong, so double check it before publishing your store.\n</p>",
    },
    {
      kind: "code",
      language: "html",
      label: "Good",
      code: "<h3>Set up shipping</h3>\n<ol>\n  <li>Add a return address.</li>\n  <li>Choose which countries you ship to.</li>\n  <li>Set a flat rate, or a rate based on order weight.</li>\n  <li>Optional: offer free shipping over a set order amount.</li>\n  <li>Add an estimated delivery time. This shows up on your product page.</li>\n</ol>",
    },

    { kind: "heading", text: "Better Headings" },
    {
      kind: "paragraph",
      text: "A heading's job is to let someone decide, without reading the paragraph underneath it, whether that section is relevant to them. A vague heading fails at that job and forces the reader to read everything just to find the one part they needed.",
    },
    {
      kind: "comparison",
      before: {
        label: "Vague",
        points: ["\"Details\"", "\"More Information\"", "\"Overview\""],
      },
      after: {
        label: "Descriptive",
        points: [
          "\"Shipping and delivery times\"",
          "\"How to reset your password\"",
          "\"What happens after you submit this form\"",
        ],
      },
    },

    { kind: "heading", text: "Better Buttons" },
    {
      kind: "paragraph",
      text: "A button's label is a promise about what happens next. \"Submit\" and \"Click Here\" make the reader guess; a button that names the actual action removes the guesswork and reduces the hesitation that shows up right before people abandon a form.",
    },
    {
      kind: "comparison",
      before: {
        label: "Vague",
        points: ["\"Submit\"", "\"Click Here\"", "\"OK\"", "\"Continue\""],
      },
      after: {
        label: "Descriptive",
        points: [
          "\"Create account\"",
          "\"Download invoice (PDF)\"",
          "\"Got it, continue\"",
          "\"Review your order\"",
        ],
      },
    },

    { kind: "heading", text: "Better Links" },
    {
      kind: "paragraph",
      text: "\"Click here\" and \"read more\" describe the act of clicking, not the destination — meaningless out of context, and screen readers often list links stripped of that context.",
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

    { kind: "heading", text: "Better Forms" },
    {
      kind: "paragraph",
      text: "A placeholder is not a label. It disappears the moment someone starts typing, so by the time they pause to double-check what field they're in, the hint that told them is already gone. Keep labels visible above or beside the field at all times, put one field per row so nothing has to be scanned side to side, and group related fields under a shared heading.",
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
      text: "\"Invalid input\" tells someone that something is wrong without telling them what, or how to fix it. A good error message names the field, explains the actual problem in plain words, and says what to do next.",
    },
    {
      kind: "comparison",
      before: {
        label: "Vague",
        points: [
          "\"Invalid input.\"",
          "\"Error 400.\"",
          "\"Something went wrong.\"",
        ],
      },
      after: {
        label: "Specific and actionable",
        points: [
          "\"Enter your email in the format name@example.com.\"",
          "\"Your password needs at least 8 characters and one number.\"",
          "\"We couldn't save your changes. Check your internet connection and try again.\"",
        ],
      },
    },

    { kind: "heading", text: "Accessible Documentation Writing" },
    {
      kind: "paragraph",
      text: "Everything above applies double to docs and tooltips, since people reach for them exactly when they're already stuck. Keep one idea per paragraph, prefer a concrete example over an abstract description, and split nested conditions (\"if X, unless Y, except Z\") into a plain common case plus a separate note for exceptions.",
    },
    {
      kind: "callout",
      variant: "tip",
      text: "Run your docs and help text through a readability tool (most flag average sentence length and reading grade level). It won't catch everything, but it's a fast way to spot the sentences that have quietly grown three clauses too many.",
    },

    { kind: "heading", text: "Practical UI Examples" },
    {
      kind: "paragraph",
      text: "The patterns above show up constantly in the same handful of screens. Here's what they look like applied to five common UI contexts.",
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
        "\"Click here\" or \"read more\" as link text, which is meaningless out of context and unhelpful for screen reader users navigating by link list.",
        "Burying the primary action among several equally-styled buttons instead of making it visually and verbally obvious.",
        "Writing instructions as nested conditionals (\"if X, unless Y, except when Z\") instead of stating the common case plainly.",
      ],
    },

    { kind: "heading", text: "Best Practices" },
    {
      kind: "list",
      items: [
        "Write short sentences with one idea each — split anything with more than one \"and\" or \"but\".",
        "Prefer plain, everyday words over formal or technical ones wherever the meaning is the same.",
        "Keep labels visible at all times; never rely on a placeholder as the only label.",
        "Make buttons and links name the actual action or destination, not the act of clicking.",
        "Chunk long content with real headings, short paragraphs, and lists instead of a single dense block.",
        "Write error messages that name the problem and the fix, not just that something went wrong.",
        "Run copy through a readability check before shipping, especially for docs and onboarding flows.",
      ],
    },

    { kind: "heading", text: "Browser Support" },
    {
      kind: "paragraph",
      text: "Plain language has no browser dependency — it's just wording. What does depend on the browser is the markup underneath: a real <label>, <button>, and heading hierarchy (h1–h3, in order) are what let screen readers and reader-mode features (Safari Reader, Firefox Reader View) reconstruct the page correctly, all broadly supported today.",
    },

    { kind: "heading", text: "Key Takeaways" },
    {
      kind: "list",
      items: [
        "Reading disabilities and reading difficulties cover a wide, largely invisible range of users — this is not a niche audience.",
        "Cognitive load is a limited budget; dense copy spends it before the reader even reaches the task.",
        "Short sentences, plain words, and real headings reduce that load without dumbing the content down.",
        "Buttons, links, and error messages should name the actual action, destination, or problem — never leave the reader guessing.",
        "Labels should stay visible; placeholders are not a substitute for a <label>.",
        "These fixes help everyone under situational impairment — tired, stressed, or reading in a second language — not just users with a diagnosed condition.",
      ],
    },
  ],
};
