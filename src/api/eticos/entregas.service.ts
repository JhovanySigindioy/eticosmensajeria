// src/api/entregas.service.ts
import axios from "axios";
import type { ApiResponse } from "@/interfaces/apiResponse";

import { env } from "@/config/env";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";
import type { EntregaRequest } from "@/types/EntregaRequest.types";

// // Mapper: backend → frontend

// function mapToSavedEntregaRes(data: any): SavedEntregaRes {
//     return {
//         registeredTypeNumber: data.radicadoTipoNumero,
//         patientName: data.nombrePaciente,
//         identification: data.identificacion,
//         primaryPhone: data.contacto1,
//         secondaryPhone: data.contacto2,
//         email: data.correo,
//         address: data.direccion,
//         managementDate: data.fechaGestion,
//         managementTime: data.horaGestion,
//         deliveryDate: data.fechaDomicilio,
//         deliveryTime: data.horaDomicilio,
//         packageType: data.tipoEmpaque,
//         callResult: data.resultadoLlamada,
//         notes: data.observaciones,
//         pharmacistId: data.regenteId,
//         isUrgent: data.esUrgente,
//         sentToHomeDelivery: data.enviado_a_domicilio,
//         managementId: data.gestion_id,
//     };
// }

// 1. Guardar historial de gestiones en la BD de la empresa
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

        // const mapped: ApiResponse<SavedEntregaRes> = {
        //     ...response.data,
        //     data: response.data.data,
        // };

        console.log("Data Normalizado :::::::::::::::: ", JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error || "Error al guardar gestiones en la BD"
        );
    }
}