// src/auth/hooks/useLoginMutation.ts
import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AuthSuccessResponse } from "@/auth/interfaces/authResponse";
import type { LoginCredentials } from "../interfaces/loginCredentials";
import { loginService } from "@/api/auth.service";


export const useLoginMutation = (): UseMutationResult<
  AuthSuccessResponse,
  Error,
  LoginCredentials
> => {
  return useMutation<AuthSuccessResponse, Error, LoginCredentials>({
    mutationFn: loginService,
    onSuccess: (data) => {
      console.log(" Login exitoso:", data);
    },
    onError: (error) => {
      console.error(" Login fallido:", error.message);
    },
  });
};
