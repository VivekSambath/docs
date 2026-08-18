import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import ScrollToTop from "./ScrollToTop";

export default function Layout() {
  const location = useLocation();

  // Hash-router navigation doesn't reset scroll position like a normal
  // browser navigation would — without this, clicking a sidebar link while
  // scrolled down lands mid-page on the new content instead of at its top.
  // Skipped when the URL carries a heading hash (e.g. "#/js-docs/generators#syntax")
  // so in-page anchor navigation isn't yanked back to the top.
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0 });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-360 flex-col border-x border-border">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="min-w-0 flex-1 px-8 py-20 sm:px-4 sm:py-12 xl:px-14">
          {/* Keyed by pathname so the fade+slide (.page-transition, global.css)
              replays on every route change. */}
          <div key={location.pathname} className="page-transition">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
