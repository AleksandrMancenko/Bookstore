import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import SearchPage from "@/pages/SearchPage";
import BookPage from "@/pages/BookPage";
import CartPage from "@/pages/CartPage";
import BookmarksPage from "@/pages/BookmarksPage";

export const router = createBrowserRouter([
  { path: "/", element: <HomePage/> },
  { path: "/search", element: <SearchPage/> },              
  { path: "/book/:isbn13", element: <BookPage/> },           
  { path: "/bookmarks", element: <BookmarksPage/> },
  { path: "/cart", element: <CartPage/> },
]);
