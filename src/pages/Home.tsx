import { LinkButton } from "../components/Button";

export default function Home() {
  return (
    <section className="py-8">
      <p className="mb-4 text-sm uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        my-stuff · 2026
      </p>
      <h1 className="mb-3 text-4xl md:text-6xl">
        A quiet, high-contrast corner of the internet.
      </h1>
      <p className="max-w-prose text-lg text-neutral-500 dark:text-neutral-400">
        This site is near-black and near-white, on purpose. No color to hide
        behind — every spacing, weight, and border here is a deliberate
        choice, not a default.
      </p>
      <div className="mt-8">
        <LinkButton to="/articles" variant="solid">
          Read the articles
        </LinkButton>
      </div>
    </section>
  );
}
