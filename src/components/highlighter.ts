import type { HighlighterCore } from "shiki/core";

// Lazy singleton, built from Shiki's fine-grained entry points (core +
// JS regex engine + only the langs/themes this site uses) instead of the
// `shiki` package's convenience API, which statically bundles every
// language it ships and balloons the build by hundreds of KB.
let highlighterPromise: Promise<HighlighterCore> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = Promise.all([
      import("shiki/core"),
      import("shiki/engine/javascript"),
      import("shiki/themes/github-light.mjs"),
      import("shiki/themes/github-dark.mjs"),
      import("shiki/langs/css.mjs"),
      import("shiki/langs/html.mjs"),
      import("shiki/langs/javascript.mjs"),
      import("shiki/langs/jsx.mjs"),
    ]).then(([{ createHighlighterCore }, { createJavaScriptRegexEngine }, light, dark, css, html, js, jsx]) =>
      createHighlighterCore({
        themes: [light.default, dark.default],
        langs: [css.default, html.default, js.default, jsx.default],
        engine: createJavaScriptRegexEngine(),
      }),
    );
  }
  return highlighterPromise;
}

const languageAlias: Record<string, string> = {
  js: "javascript",
};

export async function highlight(code: string, language: string) {
  const shiki = await getHighlighter();
  const lang = languageAlias[language] ?? language;
  const loaded = shiki.getLoadedLanguages();
  return shiki.codeToHtml(code, {
    lang: loaded.includes(lang) ? lang : "text",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
