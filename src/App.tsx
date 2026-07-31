import { lazy, Suspense } from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const Articles = lazy(() => import("./pages/Articles"));
const Article = lazy(() => import("./pages/Article"));
const CssDocs = lazy(() => import("./pages/CssDocs"));
const CssDoc = lazy(() => import("./pages/CssDoc"));
const NotFound = lazy(() => import("./pages/NotFound"));

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/articles", element: <Articles /> },
      { path: "/articles/:slug", element: <Article /> },
      { path: "/css-docs", element: <CssDocs /> },
      { path: "/css-docs/:slug", element: <CssDoc /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
