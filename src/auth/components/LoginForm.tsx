import { motion } from "framer-motion";
import { LockIcon, User, UserLock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type TLoginSchema } from "@/lib/schemas/login.schema";

interface LoginFormProps {
  onLogin: (user: string, pass: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function LoginForm({ onLogin, isLoading, error }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const submit = (data: TLoginSchema) => {
    onLogin(data.user, data.pass);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F2F2] p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-[#0082FF]">
          <CardHeader className="text-center gap-2">
            <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
            <div className="mx-auto bg-[#0A1C41] p-4 rounded-full w-fit">
              <UserLock className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-[#0A1C41] mt-4">
              Gestión de Domicilios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(submit)} className="space-y-6">
              {/* Usuario */}
              <div className="space-y-2">
                <Label htmlFor="user" className="font-semibold text-[#0A1C41]">
                  Usuario
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="user"
                    type="text"
                    placeholder="Ingrese su usuario"
                    {...register("user")}
                    className="pl-10 focus:border-[#3fa8ff] focus:ring-[#2194ff]"
                  />
                  {errors.user && (
                    <p className="text-red-500 text-sm mt-1">{errors.user.message}</p>
                  )}
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="pass" className="font-semibold text-[#0A1C41]">
                  Contraseña
                </Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="pass"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    {...register("pass")}
                    className="pl-10 focus:border-[#0082FF] focus:ring-[#0082FF]"
                  />
                  {errors.pass && (
                    <p className="text-red-500 text-sm mt-1">{errors.pass.message}</p>
                  )}
                </div>
              </div>

              {/* Error API */}
              {error && <p className="text-red-600 font-semibold text-center">{error}</p>}

              {/* Botón */}
              <Button
                type="submit"
                className="w-full bg-[#0082FF] hover:bg-[#005cbf] text-lg font-semibold py-4"
                disabled={isLoading}
              >
                {isLoading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
