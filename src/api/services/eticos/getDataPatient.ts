// src/api/services/serviceV1Ponal.ts

import { env } from "@/config/env";
import type { FormulaData, ServiceV1PonalErrorResponse, ServiceV1PonalRequest, ServiceV1PonalResponse, ServiceV1PonalSuccessResponse } from "@/interfaces/serviceV1Ponal";
import axios, { AxiosError } from "axios";

function isServiceError(data: any): data is ServiceV1PonalErrorResponse {
    return data && typeof data.success === 'boolean' && data.success === false;
}

export async function getDataPatient(request: ServiceV1PonalRequest): Promise<FormulaData[] | null> {
    try {
        const response = await axios.post<ServiceV1PonalResponse>(
            `${env.eticos.serviceV1Ponal}`,
            request,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (isServiceError(response.data)) {
            throw new Error(response.data.error || "Error en el servicio");
        }

        const successData = response.data as ServiceV1PonalSuccessResponse;

        if (successData.error) {
            throw new Error(successData.error);
        }

        if (successData.data === null) {
            return null;
        }


        console.log("Data servie v1 ponal ::::::::::::::::::::: ", JSON.stringify(successData, null, 2));
        return JSON.parse(successData.data) as FormulaData[];

    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.response) {
            if (axiosError.response.headers['content-type']?.includes('text/html')) {
                throw new Error("Error interno del servidor. Inténtalo de nuevo más tarde.");
            }
            throw new Error((axiosError.response.data as any)?.message || "Error desconocido");
        }

        throw new Error("Error de red. Verifique su conexión.");
    }
}