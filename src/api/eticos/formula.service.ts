// src/api/getDataFormulaPatient.ts
import axios from "axios";
import type { ApiResponse } from "@/interfaces/apiResponse";
import { env } from "@/config/env";
import type { FormulaPatient } from "@/interfaces/formulaPatientData";


export async function getDataFormulaPatient(
    valor: string,
    bodega: string,
    token: string
): Promise<ApiResponse<FormulaPatient>> {
    try {
        const response = await axios.get<ApiResponse<FormulaPatient>>(
            `${env.eticos.urlBaseApi}/formula`,
            {
                params: { valor, bodega },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );  

        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error ||
            error.message ||
            "Error obteniendo datos del paciente"
        );
    }
}
