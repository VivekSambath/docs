import { Link } from "react-router-dom";
import { LinkButton } from "../components/Button";
import {
  HeroIllustration,
  ScaleIcon,
  AccentIcon,
  MotionIcon,
  ArrowRightIcon,
} from "../components/illustrations";

const FEATURES = [
  {
    Icon: ScaleIcon,
    title: "One spacing scale",
    body: "4, 8, 12, 16, 24, 32 — every gap on this site is one of these values, never a number in between.",
  },
  {
    Icon: AccentIcon,
    title: "One deliberate accent",
    body: "A single signature blue, reserved for the handful of things that are always interactive.",
  },
  {
    Icon: MotionIcon,
    title: "Short, ease-out motion",
    body: "Transitions run under 200ms — long enough to feel intentional, short enough to never wait on.",
  },
];

export default function Home() {
  return (
    <>
      <section className="flex flex-col items-start gap-10 py-8 md:flex-row md:items-center md:justify-between md:gap-16">
        <div>
          <p className="mb-4 text-sm uppercase tracking-wide text-muted">
            Web Docs · 2026
          </p>
          <h1 className="mb-3 text-4xl md:text-6xl">
            A quiet, high-contrast corner of the internet.
          </h1>
          <p className="max-w-prose text-lg text-muted">
            This site is near-black and near-white, on purpose, with one
            deliberate accent reserved for anything you can click — every
            spacing, weight, and border here is a choice, not a default.
          </p>
          <div className="mt-8">
            <LinkButton to="/articles" variant="solid" className="group">
              Read the articles
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-1" />
            </LinkButton>
          </div>
        </div>
        <HeroIllustration className="hidden w-full max-w-xs shrink-0 text-divider sm:block md:w-80" />
      </section>

      <section className="mt-8 border-t border-border py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          {FEATURES.map(({ Icon, title, body }) => (
            <div key={title} className="group flex flex-col gap-3">
              <Icon className="h-8 w-8 text-accent transition-transform duration-150 ease-out group-hover:scale-110" />
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-muted">{body}</p>
            </div>
          ))}
        </div>
        <Link
          to="/articles/design-principles"
          className="group mt-10 inline-flex items-center gap-1.5 text-sm text-accent no-underline hover:text-accent-hover"
        >
          See all 30 rules this site follows
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-150 ease-out group-hover:translate-x-1" />
        </Link>
      </section>
    </>
  );
}
