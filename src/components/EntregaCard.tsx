// src/components/EntregaCard.tsx
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import {
    MapPin,
    Package,
    Phone,
    StickyNote,
    Calendar as CalendarIcon,
    Clock,
    User,
    Truck,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";

interface EntregaCardProps {
    entrega: SavedEntregaRes;
}

const statusStyles: Record<string, { badge: string; block: string }> = {
    confirmado: {
        badge: "border-green-400 bg-green-50 text-green-700",
        block: "border-green-200",
    },
    rechazado: {
        badge: "border-red-500 bg-red-100 text-red-700",
        block: "border-red-200",
    },
    "no-contesta": {
        badge: "border-yellow-500 bg-yellow-50 text-yellow-700",
        block: "border-yellow-200",
    },
    reprogramar: {
        badge: "border-blue-500 bg-blue-100 text-blue-700",
        block: "border-blue-200",
    },
    "numero-equivocado": {
        badge: "border-orange-500 bg-orange-100 text-orange-700",
        block: "border-orange-200",
    },
    "no-volver-a-llamar": {
        badge: "border-gray-500 bg-gray-100 text-gray-700",
        block: "border-gray-300",
    },
};

export function EntregaCard({ entrega }: EntregaCardProps) {
    const styles = statusStyles[entrega.callResult || ""] || {
        badge: "border-gray-300 bg-gray-100 text-gray-600",
        block: "border-gray-200",
    };

    const deliveryStatus = entrega.sentToHomeDelivery ? <span className="flex gap-1 items-center"><Truck className="h-5 w-5" />Enviado</span> : <span><Truck className="h-5 w-5" />No enviado</span>;

    return (
        <motion.div
            layout
            className="relative border rounded-xl hover:shadow-lg p-4 bg-white hover:border-gray-300 transition-all duration-300 overflow-hidden"
        >
            {/*  Viñeta de estado de envío */}
            <div
                className={` absolute  top-0 right-0 px-4 py-2 flex items-center justify-center text-[11px] font-extrabold text-white uppercase rounded-bl-xl rounded-tr-xl  border ${styles.badge}`}
            >
                <span className="flex items-center">
                    {deliveryStatus}
                </span>
            </div>

            {/* Encabezado */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex gap-1">
                    <Badge
                        variant="outline"
                        className="text-[12px] border border-gray-300 bg-gray-100 text-gray-700 px-2 py-0.5 text-bold"
                    >
                        Radicado: {entrega.registeredTypeNumber}
                    </Badge>
                    {entrega.registeredTypeNumber !== entrega.identification && (
                        <Badge
                            variant="outline"
                            className="text-[12px] border border-gray-300 bg-gray-50 text-gray-600 px-2 py-0.5"
                        >
                            Fórmula: {entrega.identification}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Paciente */}
            <p className="text-sm font-semibold text-gray-900 mb-3">
                {entrega.patientName}
            </p>

            {/* Info principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700">
                {/* Bloque: Domicilio */}
                <div className="md:col-span-2">
                    <Label className="text-sm font-semibold text-gray-900">
                        <p>Domicilio</p>
                    </Label>
                    <div
                        className={`border flex flex-col gap-2 p-2 rounded-md mt-1 ${styles.block} shadow-md`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <div className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-2 text-green-600" />
                                    <span>
                                        {entrega.deliveryDate
                                            ? format(new Date(entrega.deliveryDate), "PPP", {
                                                locale: es,
                                            })
                                            : "Sin fecha programada"}
                                    </span>
                                </div>
                                {entrega.deliveryTime && (
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-green-600" />
                                        <span>{entrega.deliveryTime}</span>
                                    </div>
                                )}
                            </div>
                            <Badge
                                variant="outline"
                                className={`text-[12px] flex gap-1 px-2 py-0.5 capitalize ${styles.badge}`}
                            >
                                <Package className="h-4 w-4" />
                                {entrega.callResult || "Sin resultado"}
                            </Badge>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-[#0082FF]" />
                            <span>{entrega.address}</span>
                        </div>
                        <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-[#0082FF]" />
                            <span>{entrega.primaryPhone}</span>
                        </div>
                        {entrega.notes && (
                            <div className="flex items-start text-gray-700 bg-gray-50 rounded-md p-2 border border-gray-200">
                                <StickyNote className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-[#0082FF]" />
                                <span className="line-clamp-2">{entrega.notes}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bloque: Gestión */}
                <div className="md:col-span-1 ">
                    <Label className="text-sm font-semibold text-gray-900">Gestión</Label>
                    <div className="border flex flex-col gap-2 p-2 rounded-md border-blue-200 mt-1 shadow-md" >
                        <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-2 text-[#0082FF]" />
                            <span>
                                {entrega.managementDate
                                    ? format(new Date(entrega.managementDate), "PPP", {
                                        locale: es,
                                    })
                                    : "No registrada"}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-[#0082FF]" />
                            <span>{entrega.managementTime || "Sin hora registrada"}</span>
                        </div>
                        <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-[#0082FF]" />
                            <span>{entrega.pharmacistId || "Sin regente"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}