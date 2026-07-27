import { Link } from "react-router-dom";
import { articles, type Article } from "../content/articles";
import { docIllustrations } from "../components/docIllustrations";

function ArticleList({ items }: { items: Article[] }) {
  return (
    <ul className="flex flex-col gap-6">
      {items.map((article) => {
        const Illustration = docIllustrations[article.slug];
        return (
          <li
            key={article.slug}
            className="rounded-lg border border-neutral-200 dark:border-neutral-800"
          >
            <Link
              to={`/articles/${article.slug}`}
              className="flex gap-5 px-6 py-6 no-underline transition-colors duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-900"
            >
              {Illustration && (
                <Illustration className="mt-1 hidden h-12 w-12 shrink-0 text-neutral-400 dark:text-neutral-600 sm:block" />
              )}
              <div className="min-w-0">
                <h2 className="mb-2 text-xl">{article.title}</h2>
                <p className="mb-3 text-neutral-500 dark:text-neutral-400">
                  {article.excerpt}
                </p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function Articles() {
  const docs = articles.filter((article): article is Extract<Article, { kind: "doc" }> => article.kind === "doc");
  const rest = articles.filter((article) => article.kind !== "doc");

  return (
    <section>
      <h1 className="mb-4 text-3xl">Articles</h1>
      <p className="mb-10 text-neutral-500 dark:text-neutral-400">
        Notes on how and why this site looks the way it does. More coming
        soon.
      </p>

      {docs.length > 0 && (
        <div className={rest.length > 0 ? "mb-14" : undefined}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Frontend Best Practices
          </h2>
          <ArticleList items={docs} />
        </div>
      )}

      {rest.length > 0 && (
        <div className={docs.length > 0 ? "border-t border-neutral-200 pt-14 dark:border-neutral-800" : undefined}>
          <ArticleList items={rest} />
        </div>
      )}
    </section>
  );
}
