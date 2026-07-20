import { createHashRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import Article from "./pages/Article";
import NotFound from "./pages/NotFound";

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/articles", element: <Articles /> },
      { path: "/articles/:slug", element: <Article /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
