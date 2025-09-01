//src/auth/schemas/login.schema.ts
import * as z from "zod";

export const loginSchema = z.object({
    idusers: z.string().min(3, { message: "El usuario es obligatorio (mínimo 3 caracteres)" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
