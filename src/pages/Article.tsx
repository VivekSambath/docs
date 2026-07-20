import { Link, Navigate, useParams } from "react-router-dom";
import { getArticle } from "../content/articles";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticle(slug) : undefined;

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  return (
    <article>
      <Link
        to="/articles"
        className="mb-8 inline-block text-sm text-neutral-500 no-underline hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
      >
        &larr; All articles
      </Link>
      <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
        {article.date}
      </p>
      <h1 className="mb-3 text-3xl md:text-4xl">{article.title}</h1>
      <p className="max-w-prose text-neutral-500 dark:text-neutral-400">
        {article.excerpt}
      </p>

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
            className="text-neutral-950 dark:text-neutral-50"
          >
            {article.credit.href}
          </a>
        </p>
      )}
    </article>
  );
}
