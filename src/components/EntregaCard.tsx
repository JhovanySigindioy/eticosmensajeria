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
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";

interface EntregaCardProps {
  entrega: SavedEntregaRes;
}

const baseRed = {
  badge: "border-red-500 bg-red-100 text-red-700",
  block: "border-red-300",
};

const statusStyles: Record<string, { badge: string; block: string }> = {
  confirmado: {
    badge: "border-green-500 bg-green-100 text-green-700",
    block: "border-green-300",
  },
  rechazado: baseRed,
  "no-contesta": baseRed,
  reprogramar: baseRed,
  "numero-equivocado": baseRed,
  "no-volver-a-llamar": baseRed,
};

export function EntregaCard({ entrega }: EntregaCardProps) {
  const styles = statusStyles[entrega.callResult || ""] || {
    badge: "border-gray-300 bg-gray-100 text-gray-600",
    block: "border-gray-200",
  };

  const deliveryStatus = entrega.sentToHome
    ? {
      text: "Enviado",
      style: "border-green-500 bg-green-100 text-green-700",
      block: "border-green-200 hover:border-green-400 hover:shadow-xl",
    }
    : {
      text: "No Enviado",
      style: "border-red-500 bg-red-100 text-red-700",
      block: "border-red-200 hover:border-red-400 hover:shadow-xl",
    };

  return (
    <motion.div
      layout
      className={`relative border rounded-xl shadow-md p-4 bg-white transition-all duration-300 ${deliveryStatus.block}`}
    >
      {/*  Viñeta de estado de envío */}
      <div
        className={`absolute top-0 right-0 px-4 py-4 flex items-center justify-center text-[11px] font-bold uppercase rounded-bl-xl rounded-tr-xl border z-20 tranform translate-x-1 -translate-y-1  ${deliveryStatus.style}`}
      >
        <span className="flex items-center gap-1">
          <Truck className="h-5 w-5" />
          {deliveryStatus.text}
        </span>
      </div>

      {/* Encabezado */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-1">
          <div className="text-sm font-semibold text-gray-900">
            {/^\d+$/.test(entrega.registeredTypeNumber)
              ? "Radicado"
              : "Tipo-Número"}
            : {entrega.registeredTypeNumber}
          </div>
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
            <p>Resultado de la gestión</p>
          </Label>
          <div
            className={`border flex flex-col gap-2 p-2 rounded-md mt-1 ${styles.block} shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-green-600" />
                  <span>
                    {entrega.deliveryDate
                      ? format(
                        parse(
                          entrega.deliveryDate,
                          "yyyy-MM-dd",
                          new Date()
                        ),
                        "PPP",
                        { locale: es }
                      )
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
              <span>
                {entrega.primaryPhone}
                {entrega.secondaryPhone ? ", " + entrega.secondaryPhone : ""}
              </span>
            </div>
            {entrega.notes && (
              <div className="flex items-start w-full">
                <StickyNote className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-[#0082FF]" />
                <textarea
                  className={`w-full rounded-md border border-gray-200 bg-gray-50 p-2 text-sm text-gray-700 focus:ring-0 focus:outline-none`}
                  value={entrega.notes}
                  readOnly
                />
              </div>
            )}
          </div>
        </div>

        {/* Bloque: Gestión */}
        <div className="md:col-span-1">
          <Label className="text-sm font-semibold text-gray-900">
            Gestión realizada
          </Label>
          <div className="border border-gray-200 flex flex-col gap-2 p-2 rounded-md mt-1 shadow-md">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-[#0082FF]" />
              <span>
                {entrega.managementDate
                  ? format(
                    parse(entrega.managementDate, "yyyy-MM-dd", new Date()),
                    "PPP",
                    { locale: es }
                  )
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
