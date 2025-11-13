import { createBrowserRouter } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import BookPage from "@/pages/BookPage";
import CartPage from "@/pages/CartPage";
import BookmarksPage from "@/pages/BookmarksPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search", element: <SearchPage /> },
      { path: "book/:isbn13", element: <BookPage /> },
      { path: "bookmarks", element: <BookmarksPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
