import { LinkButton } from "../components/Button";

export default function NotFound() {
  return (
    <section className="py-8">
      <p className="mb-4 text-sm uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        404
      </p>
      <h1 className="mb-3 text-3xl md:text-4xl">Nothing here.</h1>
      <p className="mb-8 max-w-prose text-neutral-500 dark:text-neutral-400">
        The page you're looking for doesn't exist.
      </p>
      <LinkButton to="/">Back home</LinkButton>
    </section>
  );
}
