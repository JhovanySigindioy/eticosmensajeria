import type { AuthErrorResponse, AuthSuccessResponse } from "@/auth/interfaces/authResponse";
import { env } from "@/config/env";
import axios, { AxiosError } from "axios";

// Datos que recibe la función de login
interface LoginCredentials {
    idusers: string;
    password: string;
}

// Respuesta que puede retornar el login
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
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Data completa del json", JSON.stringify(response, null, 2));
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.data) {
            return axiosError.response.data as AuthErrorResponse;
        }

        throw new Error("Ha ocurrido un error inesperado en el servidor.");
    }
}
