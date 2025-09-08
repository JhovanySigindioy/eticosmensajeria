// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState } from "../interfaces/authState";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      contractData: null,

      login: (data, contract) =>
        set({
          user: data,
          token: data.tokenjwt,
          contractData: contract,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          contractData: null,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        contractData: state.contractData,
      }),
    }
  )
);
