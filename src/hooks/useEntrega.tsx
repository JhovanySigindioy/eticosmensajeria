// src/hooks/useEntrega.ts
import { useMutation } from "@tanstack/react-query";

import type { EntregaPendiente } from "@/types/EntregaPendiente.types";
import { saveManagementEntregasService } from "@/api/eticos/entregas.service";
import type { ApiResponse } from "@/interfaces/apiResponse";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";

export const useEntrega = (token: string) => {
    const saveEntregaMutation = useMutation<ApiResponse<SavedEntregaRes>, Error, EntregaPendiente>({
        mutationFn: (entrega: EntregaPendiente) =>
            saveManagementEntregasService(entrega, token),
    });

    return {
        ...saveEntregaMutation,
    }
};