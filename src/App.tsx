import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import Article from "./pages/Article";
import CssDocs from "./pages/CssDocs";
import CssDoc from "./pages/CssDoc";
import NotFound from "./pages/NotFound";

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
  return <RouterProvider router={router} />;
}
