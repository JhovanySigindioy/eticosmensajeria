// src/hooks/useEntrega.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { getManagementEntregasService, saveManagementEntregasService } from "@/api/entregas.service";
import type { ApiResponse } from "@/interfaces/apiResponse";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";
import type { EntregaRequest } from "@/types/EntregaRequest.types";

export const useEntrega = (token: string) => {
    const saveEntregaMutation = useMutation<ApiResponse<SavedEntregaRes>, Error, EntregaRequest>({
        mutationFn: (entrega: EntregaRequest) =>
            saveManagementEntregasService(entrega, token),
    });

    const getEntregasQuery = useQuery({
        queryKey: ["Entregas", token],
        queryFn: () => getManagementEntregasService(token),
        enabled: false,
        retry: false,
        staleTime: 1000 * 60 * 60,
    });

    return {
        ...saveEntregaMutation,
        ...getEntregasQuery,
    }
};