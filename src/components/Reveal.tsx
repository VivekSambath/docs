import { useEffect, useRef, useState, type ReactNode } from "react";

// Fades + slides a block in the first time it scrolls into view. Cheap
// one-shot IntersectionObserver per block — disconnects itself once
// triggered, so it never fires again. Styling (and reduced-motion opt-out)
// lives in the `.reveal` / `.reveal-visible` rules in global.css.
export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal${visible ? " reveal-visible" : ""}`}>
      {children}
    </div>
  );
}
