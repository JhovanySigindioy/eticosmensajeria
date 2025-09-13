import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Building2,
    MapPin,
    Truck,
    Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import type { SavedEntregaRes } from "@/interfaces/entregaResponse";
import { ConfirmActionModal } from "../confirmActionModal";

interface TransferFormProps {
    origen: {
        codigo: string;
        nombre: string;
        direccion: string;
    };
}

// Lista de destinos de ejemplo para el selector
const destinosDisponibles = [
    { codigo: "FARM-001", nombre: "Farmacia Principal", direccion: "Calle 10 # 5-20, Medellín" },
    { codigo: "FARM-002", nombre: "Farmacia Central", direccion: "Carrera 45 # 10-20, Bogotá" },
    { codigo: "FARM-003", nombre: "Droguería San Marcos", direccion: "Avenida 30 # 8-50, Cali" },
    { codigo: "CEDI-001", nombre: "Centro de Distribución Norte", direccion: "Autopista Norte KM 15, Bogotá" },
];

export function TransferForm({ origen }: TransferFormProps) {
    const [destino, setDestino] = useState<{
        codigo: string;
        nombre: string;
        direccion: string;
    } | null>(null);

    const [phones, setPhones] = useState<string>("");
    const [observations, setObservations] = useState<string>("");

    const [modalOpen, setModalOpen] = useState(false);
    const [modalState, setModalState] = useState<
        "confirm" | "loading" | "success" | "error"
    >("confirm");
    const [modalMessage, setModalMessage] = useState<string>("");

    // Función para manejar la selección del destino
    const handleSelectDestino = (value: string) => {
        const selected = destinosDisponibles.find(d => d.codigo === value);
        if (selected) {
            setDestino(selected);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!destino) {
            setModalState("error");
            setModalMessage("Debe seleccionar un destino antes de enviar.");
            setModalOpen(true);
            return;
        }

        setModalState("confirm");
        setModalMessage("¿Confirmar traslado?");
        setModalOpen(true);
    };

    const confirmSave = async () => {
        setModalState("loading");

        try {
            await new Promise((res) => setTimeout(res, 1200));

            setModalState("success");
            setModalMessage("Traslado registrado con éxito.");
            setDestino(null);
            setPhones("");
            setObservations("");
        } catch (err) {
            setModalState("error");
            setModalMessage("No se pudo registrar el traslado.");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto mt-4">
                {/* Sección de Origen */}
                <div>
                    <div className="flex flex-col mb-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 leading-none">
                            <Building2 className="h-5 w-5 text-gray-500" />
                            <span>Origen</span>
                        </div>
                        <hr className="border-gray-300 mt-2" />
                    </div>
                    <div className="text-sm text-gray-600 mt-2 bg-blue-300/10 border-blue-200 border rounded-md p-2">
                        <p><span className="font-semibold">Código:</span> {origen.codigo}</p>
                        <p><span className="font-semibold">Nombre:</span> {origen.nombre}</p>
                        <p><span className="font-semibold">Dirección:</span> {origen.direccion}</p>
                    </div>
                </div>

                {/* Sección de Destino (Selector) */}
                <div>
                    <div className="flex flex-col mb-1">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 leading-none">
                            <MapPin className="h-5 w-5 text-gray-500" />
                            <span>Seleccionar Destino</span>
                        </div>
                        <hr className="border-gray-300 mt-2" />
                    </div>
                    <div className="mt-2">
                        <Select onValueChange={handleSelectDestino} value={destino?.codigo || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Seleccione un destino" />
                            </SelectTrigger>
                            <SelectContent>
                                {destinosDisponibles.map((d) => (
                                    <SelectItem key={d.codigo} value={d.codigo}>
                                        {d.nombre} ({d.codigo})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Mostrar información de destino si se selecciona */}
                <AnimatePresence>
                    {destino && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-sm text-gray-600 mt-2 bg-blue-300/10 border-blue-200 border rounded-md p-2"
                        >
                            <p className="flex items-center gap-2"><span className="font-semibold">Código:</span> {destino.codigo}</p>
                            <p className="flex items-center gap-2"><span className="font-semibold">Nombre:</span> {destino.nombre}</p>
                            <p className="flex items-center gap-2"><span className="font-semibold">Dirección:</span> {destino.direccion}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sección de Detalles del Traslado */}
                <div>

                    <div className="space-y-4 mt-2">
                        <div className="flex gap-4">
                            <div className="space-y-1 w-full">
                                <Label htmlFor="phones">Contacto principal</Label>
                                <Input
                                    id="phones"
                                    placeholder="Ej: 3101234567, 3159876543"
                                    value={phones}
                                    onChange={(e) => setPhones(e.target.value)}
                                    className="focus:ring-0 focus:outline-none focus:border-blue-200 "
                                />
                            </div>
                            <div className="space-y-1 w-full">
                                <Label htmlFor="phones">Contacto secundario</Label>
                                <Input
                                    id="phones"
                                    placeholder="Ej: 3101234567, 3159876543"
                                    value={phones}
                                    onChange={(e) => setPhones(e.target.value)}
                                    className="focus:ring-0 focus:outline-none focus:border-blue-200 ]"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="observations">Observaciones</Label>
                            <textarea
                                id="observations"
                                rows={3}
                                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A1C41]"
                                placeholder="Comentarios o instrucciones del traslado"
                                value={observations}
                                onChange={(e) => setObservations(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button type="submit" className="flex-1 bg-[#0A1C41] hover:bg-[#0082FF]">
                        <Truck className="mr-2 h-4 w-4" /> Enviar Traslado
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setDestino(null);
                            setPhones("");
                            setObservations("");
                        }}
                        className="flex-1"
                    >
                        <X className="mr-2 h-4 w-4" /> Limpiar
                    </Button>
                </div>
            </form>

            <ConfirmActionModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmSave}
                state={modalState}
                title="Confirmar traslado"
                message={modalMessage}
            />
        </>
    );
}
