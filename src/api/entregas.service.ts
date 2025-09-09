// src/api/entregas.service.ts
import axios from "axios";
import type { ApiResponse } from "@/interfaces/apiResponse";

import { env } from "@/config/env";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";
import type { EntregaRequest } from "@/types/EntregaRequest.types";

export async function saveManagementEntregasService(
    entrega: EntregaRequest,
    token: string
): Promise<ApiResponse<SavedEntregaRes>> {
    try {
        const response = await axios.post<ApiResponse<any>>(
            `${env.eticos.urlBaseApi}/management-entregas`,
            { entrega },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error || "Error al guardar gestiones en la BD"
        );
    }
}