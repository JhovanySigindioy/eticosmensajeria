// src/interfaces/patient.ts
export interface PatientRequest {
    namePatient: string;
    identification: string;
    primaryPhone: string;
    secondaryPhone: string;
    email: string;
    address: string;
}

export interface PatientResponse {
    patientId: string;
    namePatient: string;
    identification: string;
    primaryPhone: string;
    secondaryPhone: string;
    email: string;
    address: string;
}