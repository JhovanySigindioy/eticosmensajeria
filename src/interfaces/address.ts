// src/types/address.types.ts
export interface Address {
  tipoVia: string;          // Calle, Carrera, etc.
  numeroPrincipal: string;  // Ej: 32A
  numeroSecundario: string; // Ej: 10
  numeroFinal: string;      // Ej: 25
  barrio: string;
  municipio: string;
  departamento: string;
  detallesAdicionales?: string;
}