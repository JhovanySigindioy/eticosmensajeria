//src/types/pedido.types.ts
export type EstadoPedido =
    | "pendiente"
    | "confirmado"
    | "cancelado"
    | "en-gestion"
    | "entregado"
    | "reintentar"
    | "agendado"
    | "en-camino";

export type ResultadoLlamada =
    | "confirmado"
    | "rechazado"
    | "no-contesta"
    | "reprogramar"
    | "";

export interface Pedido {
    id: string;
    paciente: string;
    direccion: string;
    telefono: string;
    hora: string;
    estado: EstadoPedido;
    resultadoLlamada: ResultadoLlamada;
    observaciones: string;
    intentos: number;
    fechaGestion: string;     // ISO string
    fechaEntrega: string;     // también ISO string
    regente?: string;
}
