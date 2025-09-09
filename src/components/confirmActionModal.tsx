// src/components/ConfirmActionModal.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConfirmActionModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    state: "confirm" | "loading" | "success" | "error";
    message?: string;
}

type ConfirmActionButton = "confirm" | "cancel" | "close";

const stateConfig: {
    [key in ConfirmActionModalProps["state"]]: {
        title: string;
        desc: string;
        icon: React.ElementType;
        color: string;
        bg: string;
        ring: string;
        buttons: ConfirmActionButton[];
    };
} = {
    confirm: {
        title: "¿Estás seguro?",
        desc: "Esta acción actualizará los datos del paciente. ¿Deseas continuar?",
        icon: ShieldCheck,
        color: "text-blue-600",
        bg: "bg-gradient-to-r from-blue-100 to-cyan-100",
        ring: "ring-blue-500/40",
        buttons: ["confirm", "cancel"],
    },
    loading: {
        title: "Procesando...",
        desc: "Estamos actualizando los datos del paciente.",
        icon: Loader2,
        color: "text-indigo-600",
        bg: "bg-gradient-to-r from-indigo-100 to-violet-100",
        ring: "ring-indigo-500/40",
        buttons: [],
    },
    success: {
        title: "¡Actualización exitosa!",
        desc: "Los datos fueron actualizados correctamente.",
        icon: CheckCircle2,
        color: "text-green-600",
        bg: "bg-gradient-to-r from-green-100 to-teal-100",
        ring: "ring-green-500/40",
        buttons: ["close"],
    },
    error: {
        title: "Error al actualizar",
        desc: "No fue posible guardar los cambios. Intenta nuevamente.",
        icon: AlertTriangle,
        color: "text-red-600",
        bg: "bg-gradient-to-r from-red-100 to-orange-100",
        ring: "ring-red-500/40",
        buttons: ["close"],
    },
};

export function ConfirmActionModal({
    open,
    onClose,
    onConfirm,
    state,
    message,
}: ConfirmActionModalProps) {
    const config = stateConfig[state];
    const Icon = config.icon;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className={cn(
                    "sm:max-w-[500px] rounded-2xl p-6 border-2 shadow-md",
                    "bg-white backdrop-blur-xl"
                )}
            >
                {/* Badge con ícono */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={cn(
                        "mx-auto mb-4 w-fit rounded-full p-3 ring-4",
                        config.bg,
                        config.ring
                    )}
                >
                    <Icon
                        className={cn(
                            "w-8 h-8",
                            config.color,
                            state === "loading" && "animate-spin"
                        )}
                    />
                </motion.div>

                {/* Texto principal */}
                <DialogHeader className="text-center">
                    <DialogTitle className={cn("text-lg font-semibold", config.color)}>
                        {config.title}
                    </DialogTitle>
                    <hr className="py-2" />
                    <DialogDescription className="text-[#0A1C41] font-semibold">
                        {message ?? config.desc}
                    </DialogDescription>
                </DialogHeader>

                {/* Botones dinámicos */}
                <DialogFooter className="mt-6 flex justify-center gap-3">
                    {config.buttons.includes("cancel") && (
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="hover:bg-slate-100"
                        >
                            Cancelar
                        </Button>
                    )}

                    {config.buttons.includes("confirm") && (
                        <Button
                            onClick={onConfirm}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Confirmar
                        </Button>
                    )}

                    {config.buttons.includes("close") && (
                        <Button
                            onClick={onClose}
                            className={cn(
                                "text-white",
                                state === "success"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-rose-600 hover:bg-rose-700"
                            )}
                        >
                            Cerrar
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
