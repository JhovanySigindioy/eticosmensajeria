//src/auth/hooks/useLoginMutation.ts
import { login } from "@/api/services/eticos/authService";
import type { AuthErrorResponse, AuthSuccessResponse } from "@/auth/interfaces/authResponse";
import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { isAxiosError } from "axios";

// Datos de entrada
interface LoginCredentials {
  idusers: string;
  password: string;
}

// Type Guard para error
function isAuthErrorResponse(data: any): data is AuthErrorResponse {
  return data && typeof data.succes === "string" && data.succes === "false";
}

export const useLoginMutation = (): UseMutationResult<
  AuthSuccessResponse,
  Error,
  LoginCredentials
> => {
  return useMutation<AuthSuccessResponse, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await login(credentials);

      if (isAuthErrorResponse(response)) {
        throw new Error(response.message);
      }

      return response as AuthSuccessResponse;
    },
    onSuccess: (data) => {
      console.log("✅ Login exitoso:", data);
    },
    onError: (error) => {
      console.error("❌ Login fallido:", error.message);
    },
  });
};
