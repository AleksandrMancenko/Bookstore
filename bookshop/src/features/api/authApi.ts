import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<{ email: string }, { email: string; password: string }>({
      queryFn: async ({ email, password }) => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        if (!email || !password) {
          return { error: { status: 400, data: "Invalid credentials" } };
        }
        return { data: { email } };
      },
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation } = authApi;








