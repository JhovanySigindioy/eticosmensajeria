// src/store/deliveryStore.ts
import { create } from 'zustand';

interface DeliveryState {
    deliveryList: any[]; 
    fetchDeliveries: () => void;
    addDelivery: (delivery: any) => void;
    
}

export const useDeliveryStore = create<DeliveryState>((set) => ({
    deliveryList: [],
    fetchDeliveries: async () => {
        // Pilas aca colocamos la logica para obtener las entregas desde una API
        // const response = await fetch('your-api-endpoint');
        // const data = await response.json();
        // set({ deliveryList: data });
    },
    addDelivery: (delivery) => {
        set((state) => ({ deliveryList: [...state.deliveryList, delivery] }));
    },
}));