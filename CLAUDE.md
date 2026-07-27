# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (served under base path `/docs/`, e.g. `http://localhost:5173/docs/`)
- `npm run build` — typecheck (`tsc -b`) then production build via Vite
- `npm run lint` — ESLint (flat config, `eslint.config.js`)
- `npm run preview` — preview the production build
- `npm run deploy` — publish `dist/` to GitHub Pages via `gh-pages`
- `npm run commit` — Commitizen conventional-commit prompt (`cz-conventional-changelog`)

There is no test runner configured in this project.

## Architecture

This is a small React 19 + Vite + Tailwind v4 site with two kinds of pages: static pages (`Home`, `Articles`, `NotFound`) and a content-driven article system.

**Routing** uses `react-router-dom`'s `createHashRouter` (`src/App.tsx`) — URLs live in `location.hash` (e.g. `/#/articles/full-bleed-css`), not real paths. This matters because real `#id` anchor links inside article content would hijack routing instead of scrolling; `DocContent.tsx` works around this with a manual `scrollIntoView` handler instead of native anchors.

**Article content model** (`src/content/articles.ts`) is the core abstraction. An `Article` is a discriminated union:
- `RulesArticle` (`kind: "rules"`) — a simple numbered list of rules, rendered directly in `Article.tsx`.
- `DocArticle` (`kind: "doc"`) — long-form content built from a `DocSection[]` array (`heading`, `paragraph`, `ascii`, `code`, `callout`, `list`, `comparison`, `table`, `demo`, `caniuse`, `mindmap`). Each `DocArticle` lives in its own file under `src/content/docs/` (e.g. `full-bleed-css.ts`) and is imported and added to the `articles` array in `articles.ts`. **Adding a new article = new file in `src/content/docs/` + one import/array entry in `articles.ts`.** No other wiring is needed — `Articles.tsx` lists all `doc`-kind articles automatically, and `Article.tsx` resolves `/articles/:slug` via `getArticle(slug)`.

`DocSection` rendering lives entirely in `src/components/DocContent.tsx` (`DocContent` renders the section array; `TableOfContents` derives an in-page nav from `heading` sections via `docToc.ts`'s `getHeadings`/`slugify`). To add a new section kind: extend the `DocSection` union in `articles.ts`, then add a case to the `switch` in `DocContent.tsx`.

**`demo` sections are live, interactive previews**, not static code blocks: each pane renders real HTML/CSS inside a sandboxed `<iframe srcDoc={...} sandbox="">` (no scripts — pure CSS demos only). A pane's `html` field is `(on: boolean) => string`; when a `DocDemo` has a `toggle`, `DemoBlock` holds the on/off state and re-renders every pane's iframe (keyed by that state, forcing remount) so readers can flip real CSS behavior on and off in place. Panes can also carry `code`/`tailwind` strings shown as mini code blocks above the iframe — the pure-CSS and Tailwind-utility versions of the same example, side by side. `DocCode` sections support the same optional `tailwind` field for standalone (non-demo) snippets.

**Browser-support rule**: whenever a `DocArticle` discusses a specific CSS property, at-rule, or MDN-documented web-platform API/attribute, add a `caniuse` section (`DocCaniuse` in `articles.ts`, rendered by `CaniuseEmbed` in `DocContent.tsx`) for that feature at the bottom of the page. This is a standing rule — apply it every time, in every article, not just new ones; when an article covers several features, add one `caniuse` section per feature. `feature` must be the exact caniuse.com slug (confirm it resolves at `caniuse.com/<slug>` — MDN-sourced entries use the `mdn-css_properties_...` / `mdn-css_at-rules_...` prefix); the embed itself loads from `caniuse.bitsofco.de/embed/index.html?feat=<slug>`, a third-party service that mirrors caniuse.com data.

**Styling**: Tailwind v4 via `@tailwindcss/vite`, imported in `src/styles/global.css` with `@import "tailwindcss"`. Dark mode is class-based (`@custom-variant dark (&:where(.dark, .dark *))`) rather than OS-preference-only, so it can be toggled manually — see `ThemeToggle.tsx` (persists to `localStorage`, guarded with try/catch since storage can throw in sandboxed preview contexts) and the inline theme-init script in `index.html` (applies the class before first paint to avoid a flash of unstyled theme). The visual language is a restrained, high-contrast, near-black/near-white palette with no shadows — see the `design-principles` rules article in `articles.ts` for the explicit rules this site follows, and follow them for any new UI.

**React Compiler** is enabled via `@rolldown/plugin-babel` + `reactCompilerPreset()` in `vite.config.ts` — avoid manual `useMemo`/`useCallback` micro-optimizations that fight the compiler.
