import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/articles", label: "Articles", end: false },
];

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-6 dark:border-neutral-800 sm:px-4 sm:py-4">
      <NavLink to="/" end className="text-base font-semibold tracking-tight no-underline">
        my-stuff
      </NavLink>
      <div className="flex items-center gap-6">
        <nav className="flex gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `border-b pb-1 text-sm no-underline transition-colors duration-150 ${
                  isActive
                    ? "border-neutral-950 text-neutral-950 dark:border-neutral-50 dark:text-neutral-50"
                    : "border-transparent text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
