import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      aria-label="Toggle color theme"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 text-sm transition-colors duration-150 hover:bg-neutral-950 hover:text-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-50 dark:hover:text-neutral-950"
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
