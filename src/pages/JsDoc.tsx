import { Link, Navigate, useParams } from "react-router-dom";
import { getJsDoc } from "../content/jsDocs";
import DocContent from "../components/DocContent";
import SectionRail from "../components/SectionRail";
import ReadingProgress from "../components/ReadingProgress";
import { jsDocIllustrations } from "../components/jsDocIllustrations";
import { readingTimeForJsDoc } from "../components/readingTime";
import { ArrowRightIcon } from "../components/illustrations";

export default function JsDoc() {
  const { slug } = useParams<{ slug: string }>();
  const doc = slug ? getJsDoc(slug) : undefined;

  if (!doc) {
    return <Navigate to="/js-docs" replace />;
  }

  const Illustration = doc ? jsDocIllustrations[doc.slug] : undefined;
  const minutes = readingTimeForJsDoc(doc);

  return (
    <article>
      <ReadingProgress />
      <Link
        to="/js-docs"
        className="group mb-8 inline-flex items-center gap-1.5 text-sm text-accent no-underline hover:text-accent-hover"
      >
        <ArrowRightIcon className="h-3.5 w-3.5 rotate-180 transition-transform duration-150 ease-out group-hover:-translate-x-1" />
        All JS docs
      </Link>
      <div className="flex items-start gap-6">
        <div className="min-w-0">
          <p className="mb-2 flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-muted">
            <span>{doc.category}</span>
            <span aria-hidden="true">·</span>
            <span>{minutes} min read</span>
          </p>
          <h1
            className="mb-3 cursor-pointer font-mono text-4xl md:text-5xl"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            title="Scroll to top"
          >
            {doc.title}
          </h1>
          <p className="max-w-prose text-lg text-muted">
            {doc.excerpt}
          </p>
        </div>
        {Illustration && (
          <Illustration className="hidden h-20 w-20 shrink-0 text-divider sm:block" />
        )}
      </div>

      <div className="mt-12">
        <DocContent sections={doc.sections} />
        <SectionRail sections={doc.sections} />
      </div>
    </article>
  );
}
