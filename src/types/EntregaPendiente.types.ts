//src/types/EntregaPendiente.types.ts

// export type ResultadoLlamada =
//     | "confirmado"
//     | "rechazado"
//     | "no-contesta"
//     | "reprogramar"
//     | "numero-equivocado"
//     | "no-volver-a-llamar";

// export interface EntregaPendiente {
//     id: string;
//     paciente: string;
//     direccion: string;
//     telefono: string;
//     hora: string;
//     resultadoLlamada: ResultadoLlamada;
//     observaciones: string;
//     fechaGestion: string;     // ISO string
//     fechaEntrega: string;     // ISO string (null si no se ha enviado)
//     regente?: string;
// }


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

export interface EntregaPendiente {
    radicadoTipoNumero: string;      // GestionesEntregasPendientes.radicado_tipo_numero
    nombrePaciente: string;          // DatosPacientesDomicilios.nombre_paciente
    identificacion: string;          // DatosPacientesDomicilios.identificacion
    contacto1: string;               // DatosPacientesDomicilios.contacto1
    contacto2?: string | null;       // DatosPacientesDomicilios.contacto2
    correo?: string | null;          // DatosPacientesDomicilios.correo
    direccion: string;               // DatosPacientesDomicilios.direccion

    fechaGestion: string;            // ISO string (DATE en SQL)
    horaGestion: string;             // HH:mm:ss (TIME en SQL)

    fechaDomicilio?: string | null;  // DATE opcional (puede no seleccionarse)
    horaDomicilio?: string | null;   // TIME opcional (puede no seleccionarse)

    tipoEmpaque: PackageType;             // GestionesEntregasPendientes.tipo_empaque
    resultadoLlamada: CallResult | null;  // GestionesEntregasPendientes.resultado_llamada
    observaciones?: string | null;   // GestionesEntregasPendientes.observaciones
    regenteId: string;               // GestionesEntregasPendientes.regente_id (NOT NULL en SQL)
    esUrgente?: boolean;             // Indica si la entrega es urgente
}

