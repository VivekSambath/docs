import { useEffect, useState } from "react";

/** Thin fixed bar at the very top that fills with scroll position through the current doc. */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-20 h-0.5 bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-accent motion-safe:transition-[width] duration-100 ease-out"
        style={{ width: `${Math.min(1, Math.max(0, progress)) * 100}%` }}
      />
    </div>
  );
}
