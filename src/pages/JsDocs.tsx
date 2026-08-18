import { Link } from "react-router-dom";
import { jsDocs } from "../content/jsDocs";
import { jsDocIllustrations } from "../components/jsDocIllustrations";
import { readingTimeForJsDoc } from "../components/readingTime";
import { ArrowRightIcon } from "../components/illustrations";

export default function JsDocs() {
  return (
    <section>
      <h1 className="mb-4 text-3xl">JS Docs</h1>
      <p className="mb-10 text-muted">
        Short, feature-by-feature reference pages — the basics, a live
        playground you can run code in, and browser support. Not articles.
      </p>

      <ul className="flex flex-col gap-6">
        {jsDocs.map((doc) => {
          const Illustration = jsDocIllustrations[doc.slug];
          return (
            <li
              key={doc.slug}
              className="rounded-lg border border-border"
            >
              <Link
                to={`/js-docs/${doc.slug}`}
                className="group flex items-center gap-5 px-6 py-6 no-underline transition-colors duration-150 hover:bg-surface"
              >
                {Illustration && (
                  <Illustration className="hidden h-12 w-12 shrink-0 self-start text-muted sm:block" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="mb-2 text-sm font-medium uppercase tracking-wide text-muted">
                    {doc.category}
                  </p>
                  <h2 className="mb-2 font-mono text-xl">{doc.title}</h2>
                  <p className="mb-3 text-muted">{doc.excerpt}</p>
                  <p className="text-sm text-muted">{readingTimeForJsDoc(doc)} min read</p>
                </div>
                <ArrowRightIcon className="h-5 w-5 shrink-0 text-muted transition-transform duration-150 ease-out group-hover:translate-x-1" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
