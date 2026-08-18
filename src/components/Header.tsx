import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import SearchPalette from "./SearchPalette";
import { HomeIcon, ArticlesIcon, CodeIcon, BracesIcon } from "./illustrations";

const links = [
  { to: "/", label: "Home", end: true, Icon: HomeIcon },
  { to: "/articles", label: "Articles", end: false, Icon: ArticlesIcon },
  { to: "/css-docs", label: "CSS Docs", end: false, Icon: CodeIcon },
  { to: "/js-docs", label: "JS Docs", end: false, Icon: BracesIcon },
];

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-6 sm:px-4 sm:py-4">
      <NavLink to="/" end className="text-base font-semibold tracking-tight no-underline">
        Web Docs
      </NavLink>
      <div className="flex items-center gap-6">
        <nav className="flex gap-6">
          {links.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-1.5 border-b pb-1 text-sm no-underline transition-colors duration-150 ${
                  isActive
                    ? "border-accent text-accent"
                    : "border-transparent text-muted hover:text-fg"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0 opacity-70 transition-transform duration-150 ease-out group-hover:scale-110 group-hover:opacity-100" />
              {label}
            </NavLink>
          ))}
        </nav>
        <SearchPalette />
        <ThemeToggle />
      </div>
    </header>
  );
}
