// src/api/services/eticos/authService.ts
import axios from "axios";
import type { AuthSuccessResponse } from "@/auth/interfaces/authResponse";
import { env } from "@/config/env";
import type { LoginCredentials } from "@/auth/interfaces/loginCredentials";

export async function loginService(
    credentials: LoginCredentials
): Promise<AuthSuccessResponse> {
    try {

        console.log("Datos enviados a la API:", JSON.stringify(credentials, null, 2));
        const response = await axios.post<{ success: boolean; data: AuthSuccessResponse | null; error: string | null }>(
            `${env.eticos.urlAuthApi}/login`,
            {
                idUsers: credentials.idUsers,
                password: credentials.password,
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error || "No se pudo iniciar sesión.");
        }

        return response.data.data;
    } catch (error) {
        throw new Error("Ha ocurrido un error inesperado en el servidor.");
    }
}
