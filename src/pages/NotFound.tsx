import { LinkButton } from "../components/Button";
import SearchPalette from "../components/SearchPalette";
import { LostIllustration } from "../components/illustrations";

export default function NotFound() {
  return (
    <section className="flex flex-col items-start gap-10 py-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="mb-4 text-sm uppercase tracking-wide text-muted">
          404
        </p>
        <h1 className="mb-3 text-3xl md:text-4xl">Nothing here.</h1>
        <p className="mb-8 max-w-prose text-muted">
          The page you're looking for doesn't exist. Try the homepage, or
          search for what you were after.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <LinkButton to="/">Back home</LinkButton>
          <SearchPalette />
        </div>
      </div>
      <LostIllustration className="hidden w-full max-w-50 shrink-0 text-divider sm:block" />
    </section>
  );
}
