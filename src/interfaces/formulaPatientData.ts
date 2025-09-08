// src/interfaces/FormulaPatient.ts
export interface FormulaPatient {
    registeredTypeNumber: string; // radicado tipo número
    identification: string;       // cédula
    name: string;                 // nombre completo del paciente
    phones: string | null;        // puede venir "tel1, tel2"
    email: string | null;
    address: string | null;
    numberFormula: string;        // número de fórmula
}