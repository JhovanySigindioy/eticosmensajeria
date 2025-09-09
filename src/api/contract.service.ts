// src/api/eticos/contract.service.ts
import axios from "axios";
import { env } from "@/config/env";
import type { ApiResponse, ContractData } from "@/auth/interfaces/contractResponse";

export async function getContractService(
    nit: string,
    userId: number,
    token: string
): Promise<ContractData> {
    try {
        const response = await axios.get<ApiResponse<ContractData>>(
            `${env.eticos.urlBaseApi}/contract`,
            {
                params: { nit, userId },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.data.success || !response.data.data) {
            throw new Error(response.data.error || "No se pudo obtener el contrato");
        }

        return response.data.data;
    } catch (error: any) {
        throw new Error(error?.message || "Error obteniendo contrato");
    }
}
