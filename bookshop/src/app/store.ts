import { configureStore, combineReducers, type Middleware, type PreloadedState } from "@reduxjs/toolkit";
import booksReducer from "@/features/books/books.slice";
import cartReducer from "@/features/cart/cart.slice";
import bookmarksReducer from "@/features/bookmarks/bookmarks.slice";
import authReducer from "@/features/auth/auth.slice";
import { booksApi } from "@/features/api/api";
import { authApi } from "@/features/api/authApi";
import { persist, restore } from "@/helpers/storage";

const rootReducer = combineReducers({
  books: booksReducer,
  cart: cartReducer,
  bookmarks: bookmarksReducer,
  auth: authReducer,
  [booksApi.reducerPath]: booksApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const preloaded: PreloadedState<RootState> = {
  cart: { items: restore("cart", []) },
  bookmarks: { ids: restore("bookmarks", []) },
  auth: { user: restore("auth", undefined), loading: false },
};

const persistMiddleware: Middleware<unknown, RootState> = (storeApi) => (next) => (action) => {
  const result = next(action);
  const state = storeApi.getState();
  persist("cart", state.cart.items);
  persist("bookmarks", state.bookmarks.ids);
  persist("auth", state.auth.user);
  return result;
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) => gDM().concat(booksApi.middleware, authApi.middleware, persistMiddleware),
  preloadedState: preloaded,
});

export type AppDispatch = typeof store.dispatch;
