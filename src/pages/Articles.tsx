import { Link } from "react-router-dom";
import { articles } from "../content/articles";

export default function Articles() {
  return (
    <section>
      <h1 className="mb-3 text-3xl">Articles</h1>
      <p className="mb-8 text-neutral-500 dark:text-neutral-400">
        Notes on how and why this site looks the way it does. More coming
        soon.
      </p>
      <ul className="flex flex-col gap-4">
        {articles.map((article) => (
          <li
            key={article.slug}
            className="rounded-lg border border-neutral-200 dark:border-neutral-800"
          >
            <Link
              to={`/articles/${article.slug}`}
              className="block px-6 py-5 no-underline transition-colors duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              <h2 className="mb-2 text-xl">{article.title}</h2>
              <p className="mb-3 text-neutral-500 dark:text-neutral-400">
                {article.excerpt}
              </p>
              <time
                dateTime={article.date}
                className="text-xs text-neutral-500 dark:text-neutral-400"
              >
                {article.date}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
