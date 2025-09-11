//src/types/EntregaPendiente.types.ts
export type CallResult =
    | "confirmado"
    | "rechazado"
    | "no-contesta"
    | "reprogramar"
    | "numero-equivocado"
    | "no-volver-a-llamar";

export type PackageType =
    | "generico"
    | "nevera";

export interface EntregaRequest {
    registeredTypeNumber: string;
    patientName: string;
    identification: string;
    primaryPhone: string;
    secondaryPhone?: string | null;
    email?: string | null;
    address: string;

    managementDate: string;
    managementTime: string;

    deliveryDate?: string | null;
    deliveryTime?: string | null;

    packageType: string;
    callResult: string;
    notes?: string | null;
    isUrgent?: boolean;

    pharmacyCode: string;
}