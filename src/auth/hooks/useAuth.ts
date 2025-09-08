// src/auth/hooks/useAuth.ts
import { useAuthStore } from "../store/auth.store";

export function useAuth() {
  const { user, token, contractData, login, logout } = useAuthStore();

  return {
    user,
    token,
    contractData,       
    isAuthenticated: !!token,
    login,
    logout,
  };
}
