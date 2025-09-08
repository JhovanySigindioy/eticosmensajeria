// src/api/entregas.service.ts
import axios from "axios";
import type { ApiResponse } from "@/interfaces/apiResponse";
import type { EntregaPendiente } from "@/types/EntregaPendiente.types";
import { env } from "@/config/env";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";

// 🔹 Mapper: backend → frontend
function mapToSavedEntregaRes(data: any): SavedEntregaRes {
    return {
        registeredTypeNumber: data.radicadoTipoNumero,
        patientName: data.nombrePaciente,
        identification: data.identificacion,
        primaryPhone: data.contacto1,
        secondaryPhone: data.contacto2,
        email: data.correo,
        address: data.direccion,
        managementDate: data.fechaGestion,
        managementTime: data.horaGestion,
        deliveryDate: data.fechaDomicilio,
        deliveryTime: data.horaDomicilio,
        packageType: data.tipoEmpaque,
        callResult: data.resultadoLlamada,
        notes: data.observaciones,
        pharmacistId: data.regenteId,
        isUrgent: data.esUrgente,
        sentToHomeDelivery: data.enviado_a_domicilio,
        managementId: data.gestion_id,
    };
}

// 1. Guardar historial de gestiones en la BD de la empresa
export async function saveManagementEntregasService(
    entrega: EntregaPendiente,
    token: string
): Promise<ApiResponse<SavedEntregaRes>> {
    try {

        console.log("Datos enviados a la APIIIIIIIIIIIIIIIIIIIIIIIIIIIIII:", JSON.stringify(entrega, null, 2));
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

        // 🔑 Transformar antes de devolver
        const mapped: ApiResponse<SavedEntregaRes> = {
            ...response.data,
            data: response.data.data ? mapToSavedEntregaRes(response.data.data) : null,
        };

        console.log("📦 Normalizado:", JSON.stringify(mapped, null, 2));
        return mapped;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.error || "Error al guardar gestiones en la BD"
        );
    }
}
