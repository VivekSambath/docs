import { Link, Navigate, useParams } from "react-router-dom";
import { getCssDoc } from "../content/cssDocs";
import DocContent from "../components/DocContent";
import { cssDocIllustrations } from "../components/cssDocIllustrations";
import { ArrowRightIcon } from "../components/illustrations";

export default function CssDoc() {
  const { slug } = useParams<{ slug: string }>();
  const doc = slug ? getCssDoc(slug) : undefined;

  if (!doc) {
    return <Navigate to="/css-docs" replace />;
  }

  const Illustration = doc ? cssDocIllustrations[doc.slug] : undefined;

  return (
    <article>
      <Link
        to="/css-docs"
        className="group mb-8 inline-flex items-center gap-1.5 text-sm text-accent no-underline hover:text-accent-hover"
      >
        <ArrowRightIcon className="h-3.5 w-3.5 rotate-180 transition-transform duration-150 ease-out group-hover:-translate-x-1" />
        All CSS docs
      </Link>
      <div className="flex items-start gap-6">
        <div className="min-w-0">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-muted">
            {doc.category}
          </p>
          <h1 className="mb-3 font-mono text-4xl md:text-5xl">{doc.title}</h1>
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
      </div>
    </article>
  );
}
