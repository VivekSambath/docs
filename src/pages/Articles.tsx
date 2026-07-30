import { Link } from "react-router-dom";
import { articles, type Article } from "../content/articles";
import { docIllustrations } from "../components/docIllustrations";
import { readingTimeForArticle } from "../components/readingTime";
import { ArrowRightIcon } from "../components/illustrations";

function ArticleList({ items }: { items: Article[] }) {
  return (
    <ul className="flex flex-col gap-6">
      {items.map((article) => {
        const Illustration = docIllustrations[article.slug];
        return (
          <li
            key={article.slug}
            className="rounded-lg border border-border"
          >
            <Link
              to={`/articles/${article.slug}`}
              className="group flex items-center gap-5 px-6 py-6 no-underline transition-colors duration-150 hover:bg-surface"
            >
              {Illustration && (
                <Illustration className="hidden h-12 w-12 shrink-0 self-start text-muted sm:block" />
              )}
              <div className="min-w-0 flex-1">
                <h2 className="mb-2 text-xl">{article.title}</h2>
                <p className="mb-3 text-muted">
                  {article.excerpt}
                </p>
                <p className="text-sm text-muted">{readingTimeForArticle(article)} min read</p>
              </div>
              <ArrowRightIcon className="h-5 w-5 shrink-0 text-muted transition-transform duration-150 ease-out group-hover:translate-x-1" />
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
      <p className="mb-10 text-muted">
        Notes on how and why this site looks the way it does. More coming
        soon.
      </p>

      {docs.length > 0 && (
        <div className={rest.length > 0 ? "mb-14" : undefined}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
            Frontend Best Practices
          </h2>
          <ArticleList items={docs} />
        </div>
      )}

      {rest.length > 0 && (
        <div className={docs.length > 0 ? "border-t border-border pt-14" : undefined}>
          <ArticleList items={rest} />
        </div>
      )}
    </section>
  );
}
