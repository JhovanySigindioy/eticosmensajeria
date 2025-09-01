import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSuccessResponse } from "../interfaces/authResponse";

interface AuthState {
  user: AuthSuccessResponse | null;
  token: string | null;
  login: (data: AuthSuccessResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      // ✅ Login: guarda todo el objeto y el token
      login: (data) =>
        set({
          user: data,
          token: data.tokenjwt,
        }),

      // ❌ Logout: limpia sesión
      logout: () =>
        set({
          user: null,
          token: null,
        }),
    }),
    {
      name: "auth-storage", // 🔑 clave en localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
