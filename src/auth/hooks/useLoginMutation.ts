//src/auth/hooks/useLoginMutation.ts
import { loginService } from "@/api/eticos/auth.service";
import type { AuthErrorResponse, AuthSuccessResponse } from "@/auth/interfaces/authResponse";
import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";

interface LoginCredentials {
  idusers: string;
  password: string;
}

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
      const response = await loginService(credentials);

      if (isAuthErrorResponse(response)) {
        throw new Error(response.message);
      }

      return response as AuthSuccessResponse;
    },
    onSuccess: (data) => {
      console.log(" Login exitoso:", data);
    },
    onError: (error) => {
      console.error(" Login fallido:", error.message);
    },
  });
};
