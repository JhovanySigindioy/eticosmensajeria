// Define la interfaz para los datos de la farmacia
export interface PharmacyData {
  name: string;
  city: string;
  pharmacyCode: string;
}

// Define la interfaz para los datos de un contrato exitoso
export interface ContractData {
  contract: string;
  pharmacy: PharmacyData;
}

// Define la interfaz genérica para la respuesta de la API
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}