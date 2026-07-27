import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { articles, type Article } from "../content/articles";
import { getHeadings, scrollToId } from "./docToc";

function navLinkClass({ isActive }: { isActive: boolean }, bordered = true) {
  return `block py-2 pr-2 pl-3 text-[16px] leading-6 font-medium no-underline transition-colors duration-150 ${
    bordered ? "border-l-2" : ""
  } ${
    isActive
      ? `${bordered ? "border-accent" : ""} font-semibold text-accent`
      : `${bordered ? "border-transparent" : ""} text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50`
  }`;
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="11"
      height="11"
      aria-hidden="true"
      className="sidebar-chevron mt-1.5 text-neutral-400 dark:text-neutral-500"
    >
      <path d="M5 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <summary className="mb-1 flex items-center gap-1.5 px-3 text-[13px] font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">
      <Chevron />
      {children}
    </summary>
  );
}

function NavItem({ to, end, children }: { to: string; end?: boolean; children: ReactNode }) {
  return (
    <li>
      <NavLink to={to} end={end} className={navLinkClass}>
        {children}
      </NavLink>
    </li>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const activeSlug = location.pathname.startsWith("/articles/")
    ? location.pathname.slice("/articles/".length)
    : undefined;
  const activeArticle = activeSlug ? articles.find((article) => article.slug === activeSlug) : undefined;
  const headings = activeArticle?.kind === "doc" ? getHeadings(activeArticle.sections) : [];

  const docs = articles.filter(
    (article): article is Extract<Article, { kind: "doc" }> => article.kind === "doc",
  );
  const rest = articles.filter((article) => article.kind !== "doc");

  return (
    <aside className="hidden shrink-0 border-r border-neutral-200 lg:block lg:w-72 dark:border-neutral-800">
      <nav aria-label="Site" className="sticky top-0 max-h-svh overflow-y-auto px-5 py-8">
        <ul className="flex flex-col gap-1">
          <NavItem to="/" end>
            Home
          </NavItem>
          <NavItem to="/articles" end>
            Articles
          </NavItem>
        </ul>

        {docs.length > 0 && (
          <details open className="sidebar-details mt-8">
            <SectionLabel>Frontend Best Practices</SectionLabel>
            <ul className="flex flex-col gap-1 pl-3">
              {docs.map((article) => {
                const isActive = article.slug === activeSlug;
                const articleHeadings = isActive ? headings : [];

                if (articleHeadings.length > 1) {
                  return (
                    <li key={article.slug}>
                      <details open={isActive} className="sidebar-details">
                        <summary className="flex items-center gap-1.5 pr-2">
                          <Chevron />
                          <NavLink to={`/articles/${article.slug}`} className={`${navLinkClass({ isActive }, false)} grow pl-0`}>
                            {article.title}
                          </NavLink>
                        </summary>
                        <ul className="ml-6 flex flex-col gap-1">
                          {articleHeadings.map((heading) => (
                            <li key={heading.id} className={heading.level === 3 ? "pl-3" : ""}>
                              <a
                                href={`#${heading.id}`}
                                onClick={scrollToId(heading.id)}
                                className="block rounded-md px-2 py-1.5 text-[15px] leading-6 font-medium text-neutral-500 no-underline transition-colors duration-150 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
                              >
                                {heading.text}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </li>
                  );
                }

                return (
                  <NavItem key={article.slug} to={`/articles/${article.slug}`}>
                    {article.title}
                  </NavItem>
                );
              })}
            </ul>
          </details>
        )}

        {rest.length > 0 && (
          <details open className="sidebar-details mt-8">
            <SectionLabel>More</SectionLabel>
            <ul className="flex flex-col gap-1 pl-3">
              {rest.map((article) => (
                <NavItem key={article.slug} to={`/articles/${article.slug}`}>
                  {article.title}
                </NavItem>
              ))}
            </ul>
          </details>
        )}
      </nav>
    </aside>
  );
}
