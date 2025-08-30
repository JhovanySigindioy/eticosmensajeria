import { login } from "@/api/services/eticos/authService";
import type { AuthErrorResponse, AuthSuccessResponse } from "@/auth/interfaces/authResponse";
import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { isAxiosError } from "axios";

// Datos que recibe el login
interface LoginCredentials {
  idusers: string;
  password: string;
}

// Type Guard para identificar respuesta de error
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
      try {
        const response = await login(credentials);

        if (isAuthErrorResponse(response)) {
          throw new Error(response.message);
        }

        return response as AuthSuccessResponse;
      } catch (error) {
        if (isAxiosError(error) && error.response) {
          const apiData = error.response.data;
          if (isAuthErrorResponse(apiData)) {
            throw new Error(apiData.message);
          }
          throw new Error("Error de servidor inesperado");
        }
        throw new Error("Ha ocurrido un error de conexión");
      }
    },
    onSuccess: (data) => {
      console.log("✅ Login exitoso:", data);
      // guardar el token y demás datos aquí
    },
    onError: (error) => {
      console.error("❌ Login fallido:", error.message);
      // mostrar error al usuario
    },
  });
};
