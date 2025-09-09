// src/types/address.types.ts
export interface Address {
    tipoVia: string;
    numeroVia: string;
    complementoVia: string;
    barrio: string;
    detallesAdicionales?: string;
    municipio: string;
    departamento: string;
}
