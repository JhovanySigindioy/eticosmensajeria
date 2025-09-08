// src/schemas/formEntrega.schema.ts
import { z } from "zod";

export const entregaSchema = z
  .object({
    registeredTypeNumber: z.string().min(1, "El radicado es obligatorio"),
    patientName: z.string().min(1, "El paciente es obligatorio"),

    callResult: z.enum([
      "confirmado",
      "rechazado",
      "no-contesta",
      "reprogramar",
      "numero-equivocado",
      "no-volver-a-llamar",
    ] as const),

    deliveryDate: z.string().nullable(),
    deliveryTime: z.string().nullable(),

    packageType: z.enum(["generico", "nevera"] as const),
    isUrgent: z.boolean(),
    notes: z.string().nullable().optional(),
  })
  .refine(
    (data) => data.callResult !== "confirmado" || !!data.deliveryDate,
    {
      message: "Debe seleccionar una fecha de domicilio para confirmados",
      path: ["deliveryDate"],
    }
  );


export type EntregaFormValues = z.infer<typeof entregaSchema>;
