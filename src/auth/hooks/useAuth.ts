import { useAuthStore } from "../store/auth.store";

export function useAuth() {
  const { user, token, login, logout } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };
}
