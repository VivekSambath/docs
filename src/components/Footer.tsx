export default function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-neutral-200 px-6 py-6 text-sm text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
      <span>&copy; {new Date().getFullYear()} my-stuff</span>
    </footer>
  );
}
