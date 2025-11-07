import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/features/api/authApi";

interface User { email: string }
interface AuthState { user?: User; loading: boolean; error?: string }

const initial: AuthState = { loading: false };

const slice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    logout(state){
      state.user = undefined;
      state.error = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Unknown error";
      });
  }
});

export const authActions = slice.actions;
export default slice.reducer;

