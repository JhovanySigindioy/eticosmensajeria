//src/api/services/eticos/authService.ts
import type { AuthErrorResponse, AuthSuccessResponse } from "@/auth/interfaces/authResponse";
import { env } from "@/config/env";
import axios, { AxiosError } from "axios";

interface LoginCredentials {
    idusers: string;
    password: string;
}

export type LoginResponse = AuthSuccessResponse | AuthErrorResponse;

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
        const response = await axios.post<AuthSuccessResponse>(
            `${env.eticos.urlLoginApi}`,
            {
                idusers: credentials.idusers,
                password: credentials.password,
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.data) {
            return axiosError.response.data as AuthErrorResponse;
        }
        throw new Error("Ha ocurrido un error inesperado en el servidor.");
    }
}
