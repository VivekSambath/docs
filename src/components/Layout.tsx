import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-220 flex-col border-x border-neutral-200 dark:border-neutral-800">
      <Header />
      <main className="flex-1 px-6 py-16 sm:px-4 sm:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
