import axios from "axios";
import type { ApiResponse } from "@/interfaces/apiResponse";
import { env } from "@/config/env";
import type { PatientRequest } from "@/interfaces/patient";

export async function updateDataPatient(dataPatient: Partial<PatientRequest>, token: string): Promise<ApiResponse> {
    try {
        const response = await axios.patch<ApiResponse<null>>(
            `${env.eticos.urlBaseApi}/patient/${dataPatient.identification}`,
            { ...dataPatient },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: unknown) {
        throw new Error("Error al actualizar datos del paciente");
    }
}