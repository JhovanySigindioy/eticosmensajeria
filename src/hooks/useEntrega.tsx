// src/hooks/useEntrega.ts
import { useMutation } from "@tanstack/react-query";
import { saveManagementEntregasService } from "@/api/entregas.service";
import type { ApiResponse } from "@/interfaces/apiResponse";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";
import type { EntregaRequest } from "@/types/EntregaRequest.types";

export const useEntrega = (token: string) => {
    const saveEntregaMutation = useMutation<ApiResponse<SavedEntregaRes>, Error, EntregaRequest>({
        mutationFn: (entrega: EntregaRequest) =>
            saveManagementEntregasService(entrega, token),
    });

    return {
        ...saveEntregaMutation,
    }
};