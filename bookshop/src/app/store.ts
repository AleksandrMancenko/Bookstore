import { configureStore, combineReducers, type Middleware, type PreloadedState } from "@reduxjs/toolkit";
import booksReducer from "@/features/books/books.slice";
import cartReducer from "@/features/cart/cart.slice";
import bookmarksReducer from "@/features/bookmarks/bookmarks.slice";
import authReducer from "@/features/auth/auth.slice";
import { booksApi } from "@/features/api/api";
import { authApi, type User } from "@/features/api/authApi";
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

// Восстанавливаем пользователя из localStorage
const savedUser = restore<User | null>("auth_user", null);

const preloaded: PreloadedState<RootState> = {
  cart: { items: restore("cart", []) },
  bookmarks: { ids: Array.from(new Set(restore("bookmarks", []))) }, // Убираем дубликаты при восстановлении
  auth: {
    user: savedUser,
    loading: false,
    error: null,
    isAuthenticated: !!savedUser,
  },
};

const persistMiddleware: Middleware<unknown, RootState> = (storeApi) => (next) => (action) => {
  const result = next(action);
  const state = storeApi.getState();
  persist("cart", state.cart.items);
  // Убираем дубликаты перед сохранением
  persist("bookmarks", Array.from(new Set(state.bookmarks.ids)));
  // auth.user сохраняется в auth.slice при логине/логауте
  return result;
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) => gDM().concat(booksApi.middleware, authApi.middleware, persistMiddleware),
  preloadedState: preloaded,
});

export type AppDispatch = typeof store.dispatch;
