import { Link, Navigate, useParams } from "react-router-dom";
import { getArticle } from "../content/articles";
import DocContent from "../components/DocContent";
import { docIllustrations } from "../components/docIllustrations";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticle(slug) : undefined;

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  const Illustration = docIllustrations[article.slug];

  return (
    <article>
      <Link
        to="/articles"
        className="mb-8 inline-block text-sm text-accent no-underline hover:text-accent-hover"
      >
        &larr; All articles
      </Link>
      <div className="flex items-start gap-6">
        <div className="min-w-0">
          {article.kind === "doc" && (
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              {article.category}
            </p>
          )}
          <h1 className="mb-3 text-4xl md:text-5xl">{article.title}</h1>
          <p className="max-w-prose text-lg text-neutral-500 dark:text-neutral-400">
            {article.excerpt}
          </p>
        </div>
        {Illustration && (
          <Illustration className="hidden h-20 w-20 shrink-0 text-neutral-300 dark:text-neutral-700 sm:block" />
        )}
      </div>

      {article.kind === "doc" && (
        <div className="mt-12">
          <DocContent sections={article.sections} />
          {article.credit && (
            <p className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
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
                className="grid grid-cols-[40px_1fr] gap-4 border-t border-neutral-200 pt-8 first:border-t-0 first:pt-0 dark:border-neutral-800"
              >
                <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
                  {String(rule.number).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="mb-2 text-lg">{rule.title}</h3>
                  <p className="text-neutral-500 dark:text-neutral-400">
                    {rule.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {article.credit && (
            <p className="mt-12 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
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
