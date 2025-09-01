// src/components/AuthLoginForm.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type TLoginSchema } from "../schemas/login.schema";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface AuthLoginFormProps {
  onLogin: (user: string, password: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function AuthLoginForm({ onLogin, isLoading, error }: AuthLoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const submit = (data: TLoginSchema) => {
    onLogin(data.idusers, data.password);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center">
      {/* Fondo con overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/fondo.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Card animada */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-md px-4"
      >
        <Card className="w-full rounded-2xl shadow-2xl border border-gray-200 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <img src="/logo.png" alt="Logo eticos sas" className="h-12 w-auto" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-950">
              Iniciar sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(submit)} className="space-y-6">
              {/* Usuario */}
              <div className="space-y-1 relative">
                <Label htmlFor="idusers" className="text-blue-950">Usuario</Label>
                <User className="absolute left-3 top-8 h-5 w-5 text-gray-400 group-focus-within:text-blue-400" />
                <Input
                  id="idusers"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  {...register("idusers")}
                  className={`pl-10 border-gray-300 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all 
                    ${errors.idusers ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}`}
                />
                {errors.idusers && (
                  <p className="text-red-500 text-xs mt-1">{errors.idusers.message}</p>
                )}
              </div>

              {/* Contraseña */}
              <div className="space-y-1 relative">
                <Label htmlFor="password" className="text-blue-950">Contraseña</Label>
                <Lock className="absolute left-3 top-8 h-5 w-5 text-gray-400 group-focus-within:text-blue-400" />

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`pl-10 pr-10 border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all 
                      ${errors.password ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Error API */}
              {error && (
                <p className="text-red-600 bg-red-50 border border-red-200 rounded-md text-sm font-medium text-center p-2">
                  {error}
                </p>
              )}

              {/* Botón */}
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesión..." : "Ingresar"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Overlay de carga */}
      <LoadingOverlay show={!!isLoading} message="Iniciando sesión..." />
    </div>
  );
}
