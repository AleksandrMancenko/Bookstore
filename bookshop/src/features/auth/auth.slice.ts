import { createSlice } from "@reduxjs/toolkit";
import { authApi, type User } from "@/features/api/authApi";
import { persist, restore } from "@/helpers/storage";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// Восстанавливаем пользователя из localStorage
const savedUser = restore<User | null>("auth_user", null);

const initial: AuthState = {
  user: savedUser,
  loading: false,
  error: null,
  isAuthenticated: !!savedUser,
};

const slice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      state.isAuthenticated = false;
      persist("auth_user", null);
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Сохраняем пользователя в localStorage
        persist("auth_user", action.payload.user);
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.loading = false;
        state.error = (action.error as { data?: string })?.data || "Ошибка авторизации";
        state.isAuthenticated = false;
      })
      .addMatcher(authApi.endpoints.signup.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.signup.matchFulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        // Сохраняем пользователя в localStorage
        persist("auth_user", action.payload.user);
      })
      .addMatcher(authApi.endpoints.signup.matchRejected, (state, action) => {
        state.loading = false;
        state.error = (action.error as { data?: string })?.data || "Ошибка регистрации";
        state.isAuthenticated = false;
      })
      .addMatcher(authApi.endpoints.updateProfile.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.updateProfile.matchFulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        // Сохраняем обновленного пользователя в localStorage
        persist("auth_user", action.payload.user);
      })
      .addMatcher(authApi.endpoints.updateProfile.matchRejected, (state, action) => {
        state.loading = false;
        state.error = (action.error as { data?: string })?.data || "Ошибка обновления профиля";
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.error = null;
        state.isAuthenticated = false;
        persist("auth_user", null);
      });
  },
});

export const authActions = slice.actions;
export default slice.reducer;

