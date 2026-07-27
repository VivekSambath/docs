import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "./illustrations";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // storage may be unavailable (e.g. a sandboxed preview) — theme just won't persist
    }
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      aria-label="Toggle color theme"
      className="group inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-md border border-border transition-colors duration-150 hover:bg-fg hover:text-fg-invert"
    >
      <span
        className="grid transition-transform duration-300 ease-out"
        style={{ transform: theme === "dark" ? "rotate(0deg)" : "rotate(-100deg)" }}
      >
        <MoonIcon
          className={`col-start-1 row-start-1 h-4 w-4 transition-opacity duration-300 ease-out group-hover:scale-110 ${theme === "dark" ? "opacity-100" : "opacity-0"}`}
        />
        <SunIcon
          className={`col-start-1 row-start-1 h-4 w-4 transition-opacity duration-300 ease-out group-hover:scale-110 ${theme === "dark" ? "opacity-0" : "opacity-100"}`}
        />
      </span>
    </button>
  );
}
