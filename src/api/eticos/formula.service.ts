// src/api/getDataFormulaPatient.ts
import axios from "axios";
import type { ApiResponse } from "@/interfaces/apiResponse";
import { env } from "@/config/env";
import type { FormulaPatient } from "@/interfaces/formulaPatientData";


export async function getDataFormulaPatient(
    registeredTypeNumber: string,
    dispensaryCode: string,
    token: string
): Promise<ApiResponse<FormulaPatient>> {
    try {

        console.log("Datos enviados a la API:", JSON.stringify({ registeredTypeNumber, dispensaryCode }, null, 2));
        const response = await axios.get<ApiResponse<FormulaPatient>>(
            `${env.eticos.urlBaseApi}/formula`,
            {
                params: { registeredTypeNumber, dispensaryCode },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log("📦 Respuesta recibidad de la api:", JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error ||
            error.message ||
            "Error obteniendo datos del paciente"
        );
    }
}
