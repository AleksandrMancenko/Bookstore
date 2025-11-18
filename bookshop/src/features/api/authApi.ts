import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  email: string;
  id: string;
  name?: string;
}

export interface LoginResponse {
  user: User;
}

// Mock авторизация
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }), // Не используется при queryFn
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      queryFn: async ({ email, password }) => {
        // Имитация задержки сети
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Валидация
        if (!email?.trim() || !password?.trim()) {
          return {
            error: {
              status: 400,
              data: "Введите email и пароль",
            },
          };
        }

        // Проверка формата email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return {
            error: {
              status: 400,
              data: "Неверный формат email",
            },
          };
        }

        // Минимальная длина пароля
        if (password.length < 3) {
          return {
            error: {
              status: 400,
              data: "Пароль должен быть не менее 3 символов",
            },
          };
        }

        // Mock успешная авторизация
        const user: User = {
          email: email.trim(),
          id: `user_${Date.now()}`,
          name: email.split("@")[0],
        };

        return { data: { user } };
      },
      invalidatesTags: ["Auth"],
    }),

    signup: builder.mutation<LoginResponse, { name: string; email: string; password: string }>({
      queryFn: async ({ name, email, password }) => {
        // Имитация задержки сети
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Валидация
        if (!name?.trim() || !email?.trim() || !password?.trim()) {
          return {
            error: {
              status: 400,
              data: "Заполните все поля",
            },
          };
        }

        // Проверка формата email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return {
            error: {
              status: 400,
              data: "Неверный формат email",
            },
          };
        }

        // Минимальная длина пароля
        if (password.length < 3) {
          return {
            error: {
              status: 400,
              data: "Пароль должен быть не менее 3 символов",
            },
          };
        }

        // Mock успешная регистрация
        const user: User = {
          email: email.trim(),
          id: `user_${Date.now()}`,
          name: name.trim(),
        };

        return { data: { user } };
      },
      invalidatesTags: ["Auth"],
    }),

    resetPassword: builder.mutation<{ email: string }, { email: string }>({
      queryFn: async ({ email }) => {
        // Имитация задержки сети
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Валидация
        if (!email?.trim()) {
          return {
            error: {
              status: 400,
              data: "Введите email",
            },
          };
        }

        // Проверка формата email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return {
            error: {
              status: 400,
              data: "Неверный формат email",
            },
          };
        }

        // Mock успешная отправка письма
        return { data: { email: email.trim() } };
      },
    }),

    setNewPassword: builder.mutation<void, { password: string; token?: string }>({
      queryFn: async ({ password }) => {
        // Имитация задержки сети
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Валидация
        if (!password?.trim()) {
          return {
            error: {
              status: 400,
              data: "Введите пароль",
            },
          };
        }

        // Минимальная длина пароля
        if (password.length < 3) {
          return {
            error: {
              status: 400,
              data: "Пароль должен быть не менее 3 символов",
            },
          };
        }

        // Mock успешная установка пароля
        return { data: undefined };
      },
    }),

    updateProfile: builder.mutation<LoginResponse, { name: string; email: string; userId: string }>({
      queryFn: async ({ name, email, userId }) => {
        // Имитация задержки сети
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Валидация
        if (!name?.trim() || !email?.trim()) {
          return {
            error: {
              status: 400,
              data: "Заполните все поля",
            },
          };
        }

        // Проверка формата email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return {
            error: {
              status: 400,
              data: "Неверный формат email",
            },
          };
        }

        // Mock успешное обновление профиля (сохраняем ID пользователя)
        const user: User = {
          email: email.trim(),
          id: userId, // Сохраняем существующий ID
          name: name.trim(),
        };

        return { data: { user } };
      },
      invalidatesTags: ["Auth"],
    }),

    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      queryFn: async ({ currentPassword, newPassword }) => {
        // Имитация задержки сети
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Валидация
        if (!currentPassword?.trim() || !newPassword?.trim()) {
          return {
            error: {
              status: 400,
              data: "Заполните все поля",
            },
          };
        }

        // Минимальная длина нового пароля
        if (newPassword.length < 3) {
          return {
            error: {
              status: 400,
              data: "Новый пароль должен быть не менее 3 символов",
            },
          };
        }

        // В реальном приложении здесь была бы проверка текущего пароля
        // Mock успешная смена пароля
        return { data: undefined };
      },
    }),

    logout: builder.mutation<void, void>({
      queryFn: async () => {
        return { data: undefined };
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useResetPasswordMutation,
  useSetNewPasswordMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useLogoutMutation,
} = authApi;









