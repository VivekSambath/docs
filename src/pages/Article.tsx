import { useEffect } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { getArticle } from "../content/articles";
import DocContent from "../components/DocContent";
import { renderInline } from "../components/inline";
import ReadingProgress from "../components/ReadingProgress";
import { docIllustrations } from "../components/docIllustrations";
import { readingTimeForArticle } from "../components/readingTime";
import { ArrowRightIcon } from "../components/illustrations";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const { hash } = useLocation();
  const article = slug ? getArticle(slug) : undefined;

  // Deep links (e.g. from TipWidget) arrive as /articles/:slug#heading-id —
  // the hash router can't rely on native anchor scrolling, so scroll manually
  // once the article (and its headings) have rendered.
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash, article]);

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  const Illustration = docIllustrations[article.slug];
  const minutes = readingTimeForArticle(article);

  return (
    <article>
      <ReadingProgress />
      <Link
        to="/articles"
        className="group mb-8 inline-flex items-center gap-1.5 text-sm text-accent no-underline hover:text-accent-hover"
      >
        <ArrowRightIcon className="h-3.5 w-3.5 rotate-180 transition-transform duration-150 ease-out group-hover:-translate-x-1" />
        All articles
      </Link>
      <div className="flex items-start gap-6">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted">
            {article.kind === "doc" && <span>{article.category}</span>}
            {article.kind === "doc" && <span aria-hidden="true">·</span>}
            <span>{minutes} min read</span>
          </p>
          <h1 className="mb-3 text-4xl md:text-5xl">{article.title}</h1>
          <p className="max-w-prose text-lg text-muted">
            {article.excerpt}
          </p>
        </div>
        {Illustration && (
          <Illustration className="hidden h-20 w-20 shrink-0 text-divider sm:block" />
        )}
      </div>

      {article.kind === "doc" && (
        <div className="mt-12">
          <DocContent sections={article.sections} />
          {article.credit && (
            <p className="mt-12 border-t border-border pt-6 text-sm text-muted">
              {article.credit.label}:{" "}
              <a
                href={article.credit.href}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:text-accent-hover"
              >
                {article.credit.href}
              </a>
            </p>
          )}
        </div>
      )}

      {article.kind === "rules" && (
        <>
          <ol className="mt-12 flex flex-col gap-8">
            {article.rules.map((rule) => (
              <li
                key={rule.number}
                className="grid grid-cols-[40px_1fr] gap-4 border-t border-border pt-8 first:border-t-0 first:pt-0"
              >
                <span className="font-mono text-sm text-muted">
                  {String(rule.number).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="mb-2 text-lg">{rule.title}</h3>
                  <p className="text-muted">
                    {renderInline(rule.body)}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {article.credit && (
            <p className="mt-12 border-t border-border pt-6 text-sm text-muted">
              {article.credit.label}:{" "}
              <a
                href={article.credit.href}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:text-accent-hover"
              >
                {article.credit.href}
              </a>
            </p>
          )}
        </>
      )}
    </article>
  );
}
