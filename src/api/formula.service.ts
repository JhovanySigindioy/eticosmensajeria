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
        console.log("DATA ENDPOINT FORMULA::: :", JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error: any) {
        // Si es error de red
        if (error.code === "ERR_NETWORK") {
            console.error(" Error de red al consultar fórmula:", error);
            throw new Error("No se pudo conectar al servidor. Verifica tu conexión.");
        }

        // Otro tipo de error (con respuesta del servidor)
        const backendMessage =
            error.response?.data?.error ||
            error.response?.data?.message;

        throw new Error(
            backendMessage || error.message || "Error desconocido al obtener datos del paciente."
        );
    }

}
