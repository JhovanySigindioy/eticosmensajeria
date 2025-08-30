import { z } from "zod";

export const loginSchema = z.object({
  user: z.string().min(1, { message: "El nombre de usuario es obligatorio." }),
  pass: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

export type TLoginSchema = z.infer<typeof loginSchema>;