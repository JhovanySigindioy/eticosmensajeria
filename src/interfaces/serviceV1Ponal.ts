// src/interfaces/serviceV1Ponal.ts
export interface ServiceV1PonalSuccessResponse {
    success: boolean;
    data: string | null;
    error: string | null;
}

export interface ServiceV1PonalErrorResponse {
    success: boolean;
    data: null;
    error: string;
}

export interface ServiceV1PonalRequest {
    Datos: {
        numRadicado: string;
    };
    Servicio: string;
}

export type ServiceV1PonalResponse = ServiceV1PonalSuccessResponse | ServiceV1PonalErrorResponse;

export interface FormulaData {
    formula: string;
    evento: string;
    evolucion: number;
    idPaciente: string;
    llavePaciente: string;
    tipoAmbito: string;
    ambito: string;
    observacion: string;
    fechaEvolucion: string;
    loginProfesional: string;
    codigoPlanAf: string;
    cantidad: number;
    descripcionInsumos: string;
    detalleDosis: string;
    codigoMolecula: string;
}