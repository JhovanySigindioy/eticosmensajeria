import type { CallResult, PackageType } from "@/types/EntregaRequest.types";

export interface SavedEntregaRes {
   registeredTypeNumber: string;
   patientName: string;
   identification: string;
   primaryPhone: string;
   secondaryPhone: string | null;
   email: string | null;
   address: string;
   managementDate: string;
   managementTime: string;
   deliveryDate: string | null;
   deliveryTime: string | null;
   packageType: PackageType;
   callResult: CallResult;
   notes: string | null;
   pharmacistId: string;
   isUrgent: boolean;
   sentToHome: boolean;
   managementId: number;
}
