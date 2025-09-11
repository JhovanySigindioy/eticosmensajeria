// src/components/Dashboard.tsx
import { motion } from "framer-motion";
import { LogOut, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/hooks/useAuth";
import { ValidationForm } from "./ValidationForm";
import { HistoryPanel } from "./HistoryPanel";

export function Dashboard() {
    const { user, logout, contractData } = useAuth();
    return (
        <div className="min-h-screen bg-[#F2F2F2]">
            {/* Header */}
            <header className="bg-gradient-to-tr from-blue-950 to-blue-500 text-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
                    <div>
                        <img
                            src="logo-eticos.webp"
                            alt="Logo Eticos SAS"
                            className="h-10 w-auto mb-1"
                        />
                        <h1 className="text-xl md:text-xl font-bold">
                            Gestión de Entregas Pendientes
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-blue-100">
                            <span className="font-bold">{user?.name ?? "Sin usuario"}</span>
                        </p>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={logout}
                            className="hover:bg-red-500 hover:text-white"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Contract Info */}
            <div className="shadow-md border border-[#0082FF] rounded-3xl max-w-[70rem] mt-3 mx-auto">
                <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-4 text-[#0A1C41] text-sm">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <p className="text-sm sm:text-base font-semibold">
                            {contractData?.contract ?? "Sin contrato"}
                        </p>
                    </div>
                    <span className="hidden sm:inline">|</span>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <p className="text-sm sm:text-base font-medium">
                            {contractData?.pharmacy?.city ?? "Ciudad desconocida"}
                        </p>
                    </div>
                    <span className="hidden sm:inline">|</span>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <p className="text-sm sm:text-base font-medium">
                            {contractData?.pharmacy?.name ?? "Sin farmacia"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className="container mx-auto p-3">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Formulario */}
                    <div className="lg:col-span-2 lg:sticky lg:top-24">
                        <ValidationForm />
                    </div>

                    {/* Lista */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <HistoryPanel />
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
