// src/components/ValidationForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    X,
    MessageSquare,
    Calendar as CalendarIcon,
    Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { useFormulaPatient } from "@/hooks/useFormulaPatient";
import { useAuthStore } from "@/auth/store/auth.store";
import { useEntregasPendientesStore } from "@/store/useEntregasPendientesStore";
import type {
    CallResult,
    EntregaRequest,
    PackageType,
} from "@/types/EntregaRequest.types";

import { useEntrega } from "@/hooks/useEntrega";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";
import { EditarPacienteModal } from "./EditarPacienteModal";

const ValidationForm: React.FC<{ regente: string }> = ({ regente }) => {
    const { contractData, token } = useAuthStore();

    // Zustand
    const selectedEntrega = useEntregasPendientesStore((s) => s.selectedEntrega);
    const addOrUpdateEntrega = useEntregasPendientesStore(
        (s) => s.addOrUpdateEntrega
    );
    const setSelectedEntrega = useEntregasPendientesStore(
        (s) => s.setSelectedEntrega
    );

    // Mutation para enviar al backend
    const { mutateAsync: saveEntrega, isPending } = useEntrega(token || "");

    const [searchValue, setSearchValue] = useState<string>("");

    const [formData, setFormData] = useState<EntregaRequest>({
        registeredTypeNumber: "",
        patientName: "",
        identification: "",
        primaryContact: "",
        secondaryContact: null,
        email: null,
        address: "",
        managementDate: "",
        managementTime: "",
        deliveryDate: null,
        deliveryTime: null,
        packageType: "generico",
        callResult: "",
        notes: null,
        pharmacistId: regente,
        isUrgent: false,
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { isLoading, refetch } = useFormulaPatient(
        searchValue,
        contractData?.pharmacy.pharmacyCode || "",
        token || ""
    );

    // 🔄 Cuando seleccionamos una entrega desde el store
    useEffect(() => {
        if (selectedEntrega) {
            setSearchValue(selectedEntrega.registeredTypeNumber);
            setFormData({
                registeredTypeNumber: selectedEntrega.registeredTypeNumber,
                patientName: selectedEntrega.patientName,
                identification: selectedEntrega.identification,
                primaryContact: selectedEntrega.primaryPhone,
                secondaryContact: selectedEntrega.secondaryPhone,
                email: selectedEntrega.email,
                address: selectedEntrega.address,
                managementDate: selectedEntrega.managementDate,
                managementTime: selectedEntrega.managementTime,
                deliveryDate: selectedEntrega.deliveryDate,
                deliveryTime: selectedEntrega.deliveryTime,
                packageType: selectedEntrega.packageType,
                callResult: selectedEntrega.callResult,
                notes: selectedEntrega.notes,
                pharmacistId: selectedEntrega.pharmacistId,
                isUrgent: selectedEntrega.isUrgent,
            });
            setErrorMessage(null);
        } else {
            resetForm();
        }
    }, [selectedEntrega]);

    // 🔄 Resetear campos cuando el resultado de la llamada no sea confirmado
    useEffect(() => {
        if (formData.callResult !== "confirmado") {
            setFormData((prev) => ({
                ...prev,
                deliveryDate: null,
                deliveryTime: null,
                packageType: "generico",
                isUrgent: false,
            }));
        }
    }, [formData.callResult]);

    const resetForm = () => {
        setSearchValue("");
        setFormData({
            registeredTypeNumber: "",
            patientName: "",
            identification: "",
            primaryContact: "",
            secondaryContact: null,
            email: null,
            address: "",
            managementDate: "",
            managementTime: "",
            deliveryDate: null,
            deliveryTime: null,
            packageType: "generico",
            callResult: "",
            notes: null,
            pharmacistId: regente,
            isUrgent: false,
        });
        setErrorMessage(null);
    };

    const handleSearch = async () => {
        if (!searchValue.trim()) {
            setErrorMessage("Por favor, ingresa un radicado o tipo-número.");
            return;
        }

        try {
            const { data } = await refetch();
            if (data?.success && data.data) {
                const paciente = data.data;
                setFormData((prev) => ({
                    ...prev,
                    registeredTypeNumber: paciente.registeredTypeNumber || "",
                    patientName: paciente.name || "",
                    address: paciente.address || "",
                    primaryContact: paciente.phones || "",
                    email: paciente.email || null,
                    identification: paciente.identification || "",
                }));
                setErrorMessage(null);
            } else {
                setErrorMessage(`No se encontraron datos para ${searchValue}.`);
                resetForm();
            }
        } catch {
            setErrorMessage("Hubo un problema al consultar el servicio.");
            resetForm();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.registeredTypeNumber || !formData.patientName) {
            setErrorMessage("El radicado y el paciente son obligatorios.");
            return;
        }

        if (formData.callResult === "confirmado" && !formData.deliveryDate) {
            setErrorMessage(
                "Debe seleccionar una fecha de domicilio para entregas confirmadas."
            );
            return;
        }

        const payload: EntregaRequest = {
            ...formData,
            managementDate: new Date().toISOString().split("T")[0], // yyyy-mm-dd
            managementTime: new Date().toISOString().substring(11, 19), // hh:mm:ss
        };

        try {
            const response = await saveEntrega(payload);
            console.log("✅ Envío exitoso:", payload);

            if (response.data) {
                addOrUpdateEntrega(response.data as SavedEntregaRes);
            }

            resetForm();
            setSelectedEntrega(null);
        } catch (err) {
            const error = err as Error;
            console.error("❌ Error al enviar entrega:", error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <Card className="shadow-lg border-t-2 border-[#0082FF]">
            <CardHeader>
                <CardTitle className="text-[#0A1C41] flex items-center">
                    <MessageSquare className="mr-2 text-[#0082FF]" />
                    Formulario Entregas Pendientes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-2">
                    {/* 🔎 Buscador */}
                    <div className="space-y-1">
                        <Label htmlFor="search" className="font-semibold text-[#0A1C41]">
                            Buscar Radicado o Tipo-Número
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="search"
                                placeholder="Ej: 1124853578 o F10551-265895"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value.trim())}
                                className="focus:border-[#0082FF] focus:ring-[#0082FF]"
                            />
                            <Button
                                type="button"
                                onClick={handleSearch}
                                size="icon"
                                className="bg-[#0082FF] hover:bg-[#005cbf] "
                                disabled={isLoading}
                            >
                                {isLoading ? "..." : <Search className="h-4 w-4" />}
                            </Button>
                        </div>
                        {errorMessage && (
                            <p className="text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded-md p-2 mt-2">
                                {errorMessage}
                            </p>
                        )}
                    </div>

                    {/* Formulario con data */}
                    <AnimatePresence>
                        {formData.registeredTypeNumber && !errorMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {/* Número de fórmula */}
                                <div className="space-y-1">
                                    <Label htmlFor="formula">Número de Fórmula</Label>
                                    <Input id="formula" value={formData.registeredTypeNumber} readOnly />
                                </div>

                                {/* Cédula */}
                                <div className="space-y-1">
                                    <Label htmlFor="identificacion">Número de Cédula</Label>
                                    <Input id="identificacion" value={formData.identification} readOnly />
                                </div>

                                {/* Paciente */}
                                <div className="space-y-1">
                                    <Label htmlFor="paciente">Nombre del Paciente</Label>
                                    <Input id="paciente" value={formData.patientName} readOnly />
                                </div>

                                {/* Teléfono */}
                                <div className="space-y-1">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <Input id="telefono" value={formData.primaryContact} readOnly />
                                </div>

                                {/* Dirección actual */}
                                <div className="space-y-1">
                                    <Label htmlFor="direccion">Dirección Actual</Label>
                                    <Input id="direccion" value={formData.address} readOnly />
                                </div>

                                {/* Correo */}
                                <div className="space-y-1">
                                    <Label htmlFor="correo">Correo Electrónico</Label>
                                    <Input
                                        id="correo"
                                        value={formData.email || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, email: e.target.value }))
                                        }
                                    />
                                </div>

                                {/* Modal para editar dirección */}
                                <div className="md:col-span-2">
                                    <EditarPacienteModal formData={formData} setFormData={setFormData} />
                                </div>

                                {/* Resultado llamada */}
                                <div className="space-y-1">
                                    <Label>Resultado de la Llamada</Label>
                                    <Select
                                        value={formData.callResult || ""}
                                        onValueChange={(value: CallResult) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                callResult: value,
                                            }))
                                        }
                                        required
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar resultado..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="confirmado">Confirmado ✅</SelectItem>
                                            <SelectItem value="no-contesta">No contesta ❌</SelectItem>
                                            <SelectItem value="rechazado">Rechazado 🚫</SelectItem>
                                            <SelectItem value="numero-equivocado">Número equivocado 🚫</SelectItem>
                                            <SelectItem value="no-volver-a-llamar">No volver a llamar 🚫</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Bloque Condicional SOLO si confirmado */}
                                {formData.callResult === "confirmado" && (
                                    <>
                                        {/* Fecha de Domicilio */}
                                        <div className="space-y-1">
                                            <Label>Fecha de Domicilio</Label>
                                            <div className="flex gap-2">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="flex-1 text-left">
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {formData.deliveryDate
                                                                ? format(new Date(formData.deliveryDate), "PPP", { locale: es })
                                                                : "Seleccionar fecha"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <Calendar
                                                            mode="single"
                                                            selected={formData.deliveryDate ? new Date(formData.deliveryDate) : undefined}
                                                            onSelect={(date) =>
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    deliveryDate: date ? date.toISOString().split("T")[0] : null,
                                                                }))
                                                            }
                                                            locale={es}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                {formData.deliveryDate && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                deliveryDate: null,
                                                            }))
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Hora + Empaque + Urgente en la misma fila */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                                            {/* Hora */}
                                            <div className="space-y-1">
                                                <Label>Hora de Entrega</Label>
                                                <Input
                                                    type="time"
                                                    value={formData.deliveryTime || ""}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            deliveryTime: e.target.value || null,
                                                        }))
                                                    }
                                                    className="w-full"
                                                />
                                            </div>

                                            {/* Tipo de Empaque */}
                                            <div className="space-y-1">
                                                <Label>Tipo de empaque</Label>
                                                <Select
                                                    value={formData.packageType}
                                                    onValueChange={(val) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            packageType: val as PackageType,
                                                        }))
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="generico">Genérico</SelectItem>
                                                        <SelectItem value="nevera">Nevera</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Urgente */}
                                            <div className="space-y-1">
                                                <Label>¿Es urgente?</Label>
                                                <Select
                                                    value={formData.isUrgent ? "si" : "no"}
                                                    onValueChange={(val) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            isUrgent: val === "si",
                                                        }))
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="no">No</SelectItem>
                                                        <SelectItem value="si">Sí</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Observaciones */}
                                <div className="md:col-span-2">
                                    <Label htmlFor="observaciones">Observaciones</Label>
                                    <textarea
                                        id="observaciones"
                                        value={formData.notes || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                notes: e.target.value,
                                            }))
                                        }
                                        rows={3}
                                        className="w-full rounded-md border border-input p-2 text-sm"
                                        placeholder="Comentarios o instrucciones"
                                    />
                                </div>

                                {/* Botones */}
                                <div className="flex gap-4 md:col-span-2">
                                    <Button
                                        type="submit"
                                        className="flex-1 bg-[#0A1C41]"
                                        disabled={isPending}
                                    >
                                        <Truck className="mr-2 h-4 w-4" />{" "}
                                        {isPending ? "Enviando..." : "Enviar a Domicilio"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            resetForm();
                                            setSelectedEntrega(null);
                                        }}
                                        className="flex-1"
                                    >
                                        <X className="mr-2 h-4 w-4" /> Limpiar
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </CardContent>
        </Card>
    );
};

export default ValidationForm;
