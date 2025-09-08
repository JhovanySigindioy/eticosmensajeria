// src/store/useEntregasPendientesStore.ts
import { create } from "zustand";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";
import type { CallResult } from "@/types/EntregaRequest.types";

interface EntregasState {
    entregas: SavedEntregaRes[];
    selectedEntrega: SavedEntregaRes | null;

    addOrUpdateEntrega: (entrega: SavedEntregaRes) => void;
    setSelectedEntrega: (entrega: SavedEntregaRes | null) => void;
    updateCallResult: (
        managementId: number,
        result: CallResult,
        deliveryDate?: string | null
    ) => void;
    clearEntregas: () => void;
}

export const useEntregasPendientesStore = create<EntregasState>((set) => ({
    entregas: [],
    selectedEntrega: null,

    addOrUpdateEntrega: (entrega) =>
        set((state) => {
            const exists = state.entregas.some(
                (e) => e.managementId === entrega.managementId
            );
            return {
                entregas: exists
                    ? state.entregas.map((e) =>
                        e.managementId === entrega.managementId ? entrega : e
                    )
                    : [entrega, ...state.entregas],
            };
        }),

    setSelectedEntrega: (entrega) => set({ selectedEntrega: entrega }),

    updateCallResult: (managementId, result, deliveryDate) =>
        set((state) => ({
            entregas: state.entregas.map((e) =>
                e.managementId === managementId
                    ? {
                        ...e,
                        callResult: result,
                        deliveryDate: deliveryDate ?? e.deliveryDate,
                    }
                    : e
            ),
        })),

    clearEntregas: () => set({ entregas: [], selectedEntrega: null }),
}));
