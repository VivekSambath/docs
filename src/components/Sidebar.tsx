import { useEffect, useState } from "react";
import type { ReactNode, ComponentType } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { articles, type Article } from "../content/articles";
import { cssDocs } from "../content/cssDocs";
import { getHeadings, scrollToId } from "./docToc";
import { HomeIcon, ArticlesIcon, CodeIcon, SidebarIcon } from "./illustrations";

const COLLAPSE_STORAGE_KEY = "sidebar-collapsed";

function getInitialCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function navLinkClass({ isActive }: { isActive: boolean }, bordered = true) {
  return `flex items-center gap-2.5 py-2 pr-2 pl-3 text-[16px] leading-6 font-medium no-underline transition-colors duration-150 ${
    bordered ? "border-l-2" : ""
  } ${
    isActive
      ? `${bordered ? "border-accent" : ""} font-semibold text-accent`
      : `${bordered ? "border-transparent" : ""} text-muted hover:text-fg`
  }`;
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="11"
      height="11"
      aria-hidden="true"
      className="sidebar-chevron mt-1.5 text-muted"
    >
      <path d="M5 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <summary className="mb-1 flex items-center gap-1.5 px-3 text-[13px] font-semibold tracking-wide text-muted uppercase">
      <Chevron />
      {children}
    </summary>
  );
}

function NavItem({
  to,
  end,
  icon: Icon,
  collapsed = false,
  children,
}: {
  to: string;
  end?: boolean;
  icon?: ComponentType<{ className?: string }>;
  collapsed?: boolean;
  children: ReactNode;
}) {
  if (collapsed) {
    const label = typeof children === "string" ? children : undefined;
    return (
      <li>
        <NavLink
          to={to}
          end={end}
          title={label}
          aria-label={label}
          className={({ isActive }) =>
            `mx-auto flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-150 ${
              isActive ? "text-accent" : "text-muted hover:bg-fg hover:text-fg-invert"
            }`
          }
        >
          {Icon && <Icon className="h-4 w-4 shrink-0" />}
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <NavLink to={to} end={end} className={(state) => `group ${navLinkClass(state)}`}>
        {Icon && (
          <Icon className="h-4 w-4 shrink-0 opacity-70 transition-transform duration-150 ease-out group-hover:scale-110 group-hover:opacity-100" />
        )}
        {children}
      </NavLink>
    </li>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState<boolean>(getInitialCollapsed);

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      // storage may be unavailable (e.g. a sandboxed preview) — state just won't persist
    }
  }, [collapsed]);

  const location = useLocation();
  const activeSlug = location.pathname.startsWith("/articles/")
    ? location.pathname.slice("/articles/".length)
    : undefined;
  const activeArticle = activeSlug ? articles.find((article) => article.slug === activeSlug) : undefined;
  const headings = activeArticle?.kind === "doc" ? getHeadings(activeArticle.sections) : [];

  const activeCssDocSlug = location.pathname.startsWith("/css-docs/")
    ? location.pathname.slice("/css-docs/".length)
    : undefined;
  const activeCssDoc = activeCssDocSlug ? cssDocs.find((doc) => doc.slug === activeCssDocSlug) : undefined;
  const cssDocHeadings = activeCssDoc ? getHeadings(activeCssDoc.sections) : [];

  const docs = articles.filter(
    (article): article is Extract<Article, { kind: "doc" }> => article.kind === "doc",
  );
  const rest = articles.filter((article) => article.kind !== "doc");

  return (
    <aside
      className={`hidden shrink-0 border-r border-border motion-safe:transition-[width] duration-200 ease-out lg:block ${
        collapsed ? "lg:w-16" : "lg:w-72"
      }`}
    >
      <nav
        aria-label="Site"
        className={`sticky top-0 max-h-svh overflow-y-auto py-8 ${collapsed ? "px-3" : "px-5"}`}
      >
        <button
          type="button"
          onClick={() => setCollapsed((current) => !current)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-pressed={collapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={`mb-4 flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors duration-150 hover:bg-fg hover:text-fg-invert ${
            collapsed ? "mx-auto" : "ml-auto"
          }`}
        >
          <SidebarIcon className="h-4 w-4" />
        </button>

        <ul className="flex flex-col gap-1">
          <NavItem to="/" end icon={HomeIcon} collapsed={collapsed}>
            Home
          </NavItem>
          <NavItem to="/articles" end icon={ArticlesIcon} collapsed={collapsed}>
            Articles
          </NavItem>
          <NavItem to="/css-docs" end icon={CodeIcon} collapsed={collapsed}>
            CSS Docs
          </NavItem>
        </ul>

        {!collapsed && docs.length > 0 && (
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
                                className="block rounded-md px-2 py-1.5 text-[15px] leading-6 font-medium text-muted no-underline transition-colors duration-150 hover:text-fg"
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

        {!collapsed && cssDocs.length > 0 && (
          <details open className="sidebar-details mt-8">
            <SectionLabel>CSS Docs</SectionLabel>
            <ul className="flex flex-col gap-1 pl-3">
              {cssDocs.map((doc) => {
                const isActive = doc.slug === activeCssDocSlug;
                const docHeadings = isActive ? cssDocHeadings : [];

                if (docHeadings.length > 1) {
                  return (
                    <li key={doc.slug}>
                      <details open={isActive} className="sidebar-details">
                        <summary className="flex items-center gap-1.5 pr-2">
                          <Chevron />
                          <NavLink to={`/css-docs/${doc.slug}`} className={`${navLinkClass({ isActive }, false)} grow pl-0 font-mono`}>
                            {doc.title}
                          </NavLink>
                        </summary>
                        <ul className="ml-6 flex flex-col gap-1">
                          {docHeadings.map((heading) => (
                            <li key={heading.id} className={heading.level === 3 ? "pl-3" : ""}>
                              <a
                                href={`#${heading.id}`}
                                onClick={scrollToId(heading.id)}
                                className="block rounded-md px-2 py-1.5 text-[15px] leading-6 font-medium text-muted no-underline transition-colors duration-150 hover:text-fg"
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
                  <li key={doc.slug}>
                    <NavLink to={`/css-docs/${doc.slug}`} className={(state) => `${navLinkClass(state)} font-mono`}>
                      {doc.title}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </details>
        )}

        {!collapsed && rest.length > 0 && (
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
