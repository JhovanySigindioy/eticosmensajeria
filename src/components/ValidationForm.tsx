// src/components/ValidationForm.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    X,
    MessageSquare,
    Calendar as CalendarIcon,
    Truck,
    Loader2,
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
import { format, parse } from "date-fns";
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
import { EditInfoPatientModal } from "./EditInfoPatientModal";
import { ConfirmActionModal } from "./confirmActionModal";

// const ValidationForm: React.FC<{ regente: string }> = ({ regente }) => {
export function ValidationForm({ regente }: { regente: string }) {
    const { contractData, token } = useAuthStore();

    const selectedEntrega = useEntregasPendientesStore((s) => s.selectedEntrega);
    const addOrUpdateEntrega = useEntregasPendientesStore((s) => s.addOrUpdateEntrega);
    const setSelectedEntrega = useEntregasPendientesStore((s) => s.setSelectedEntrega);

    const { mutateAsync: saveEntrega, isPending } = useEntrega(token || "");

    const [searchValue, setSearchValue] = useState<string>("");

    const [formData, setFormData] = useState<EntregaRequest>({
        registeredTypeNumber: "",
        patientName: "",
        identification: "",
        primaryPhone: "",
        secondaryPhone: null,
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

    const [modalOpen, setModalOpen] = useState(false);
    const [modalState, setModalState] = useState<
        "confirm" | "loading" | "success" | "error"
    >("confirm");
    const [modalMessage, setModalMessage] = useState<string | undefined>(undefined);

    // 🔄 Cuando seleccionamos una entrega desde el store
    useEffect(() => {
        if (selectedEntrega) {
            setSearchValue(selectedEntrega.registeredTypeNumber);
            setFormData({
                registeredTypeNumber: selectedEntrega.registeredTypeNumber,
                patientName: selectedEntrega.patientName,
                identification: selectedEntrega.identification,
                primaryPhone: selectedEntrega.primaryPhone,
                secondaryPhone: selectedEntrega.secondaryPhone,
                email: selectedEntrega.email,
                address: selectedEntrega.address,
                managementDate: selectedEntrega.managementDate,
                managementTime: selectedEntrega.managementTime,
                deliveryDate: selectedEntrega.deliveryDate,
                deliveryTime: selectedEntrega.deliveryTime
                    ? selectedEntrega.deliveryTime.slice(0, 5)
                    : null, // para input type="time"
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
            primaryPhone: "",
            secondaryPhone: null,
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

            if (!data) {
                throw new Error("No hubo respuesta del servidor. Verifica tu conexión o intenta más tarde.");
            }

            if (data.success && data.data) {
                const paciente = data.data;

                setFormData((prev) => ({
                    ...prev,
                    registeredTypeNumber: paciente.registeredTypeNumber || "",
                    patientName: paciente.name || "",
                    address: paciente.address || "",
                    primaryPhone: paciente.phones || "",
                    email: paciente.email || null,
                    identification: paciente.identification || "",
                }));

                setErrorMessage(null); // limpia el mensaje anterior si todo sale bien
            } else if (data.success === false) {
                // Aseguramos que el error sea string
                const errorMsg = typeof data.error === "string"
                    ? data.error
                    : "Error desde el servidor. Verifica los datos ingresados.";

                throw new Error(errorMsg);
            } else {
                throw new Error("Respuesta inesperada del servidor.");
            }
        } catch (err) {
            console.error("❌ Error en búsqueda:", err);

            setErrorMessage(
                err instanceof Error
                    ? err.message
                    : "No se pudo conectar al servidor. Verifica tu conexión o intenta más tarde."
            );
        }
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setModalMessage("");

        if (!formData.registeredTypeNumber || !formData.patientName) {
            setModalMessage("El radicado y el paciente son obligatorios.");
            setModalState("error");
            setModalOpen(true);
            return;
        }

        if (formData.callResult === "confirmado" && !formData.deliveryDate) {
            setModalMessage(
                "Debe seleccionar una fecha de domicilio para entregas confirmadas."
            );
            setModalState("error");
            setModalOpen(true);
            return;
        }

        // 👇 abrir modal en confirmación antes de procesar
        setModalMessage("Enviar entrega a servicio de gestión de domicilios");
        setModalState("confirm");
        setModalOpen(true);
    };

    const confirmSave = async () => {
        setModalState("loading");
        const phones = formData.primaryPhone
            ? formData.primaryPhone.split(",").map((p) => p.trim())
            : [];

        const payload: EntregaRequest = {
            ...formData,
            primaryPhone: phones[0] || "",
            secondaryPhone: phones[1] || formData.secondaryPhone || null,
            managementDate: format(new Date(), "yyyy-MM-dd"), // fecha local
            managementTime: format(new Date(), "HH:mm:ss"), // hora local
            deliveryTime: formData.deliveryTime
                ? `${formData.deliveryTime}:00`
                : null, // normalizar a HH:mm:ss
        };

        try {
            const response = await saveEntrega(payload);
            if (response.data) {
                addOrUpdateEntrega(response.data as SavedEntregaRes);
            }

            setModalState("success");
            resetForm();
            setSelectedEntrega(null);
        } catch (err) {
            const error = err as Error;
            console.error("❌ Error al enviar entrega:", error.message);
            setModalMessage(error.message);
            setModalState("error");
        }
    };

    return (
        <>
            <Card className="shadow-lg border-t-2 border-[#0082FF]">
                <CardHeader>
                    <CardTitle className="text-[#0A1C41] flex items-center">
                        <MessageSquare className="mr-2 text-[#0082FF]" />
                        Formulario Entregas Pendientes
                    </CardTitle>
                </CardHeader>
                <CardContent>

                    {(isLoading) && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-md">
                            <Loader2 className="h-8 w-8 animate-spin text-[#0082FF]" />
                            <p className="mt-2 text-sm text-[#0A1C41] font-semibold">
                                {isLoading
                                    ? "Consultando información del paciente..."
                                    : "Enviando entrega..."}
                            </p>
                        </div>
                    )}
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
                                    onChange={(e) =>
                                        setSearchValue(e.target.value.trim())
                                    }
                                    className="focus:border-[#0082FF] focus:ring-[#0082FF]"
                                />
                                <Button
                                    type="button"
                                    onClick={handleSearch}
                                    size="icon"
                                    className="bg-[#0082FF] hover:bg-[#005cbf]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Search className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            {errorMessage && (
                                <p className="text-red-600 text-sm font-semibold bg-red-50 border border-red-200 rounded-md p-2 mt-2">
                                    {errorMessage}
                                </p>
                            )}
                        </div>

                        <AnimatePresence>
                            {formData.registeredTypeNumber && !errorMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4 "
                                >
                                    <div className="space-y-1">
                                        <Label htmlFor="formula">Fórmula</Label>
                                        <Input
                                            id="formula"
                                            className="bg-blue-300/10 border-blue-500/10"
                                            value={formData.registeredTypeNumber}
                                            readOnly
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="identificacion">
                                            Identificación
                                        </Label>
                                        <Input
                                            id="identificacion"
                                            className="bg-blue-300/10 border-blue-500/10"
                                            value={formData.identification}
                                            readOnly
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="paciente">Nombre</Label>
                                        <Input
                                            id="paciente"
                                            className="bg-blue-300/10 border-blue-500/10"
                                            value={formData.patientName}
                                            readOnly
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="telefono">
                                            Numero(s) de Contacto
                                        </Label>
                                        <Input
                                            id="telefono"
                                            className="bg-blue-300/10 border-blue-500/10"
                                            value={formData.primaryPhone}
                                            readOnly
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="direccion">
                                            Dirección Actual
                                        </Label>
                                        <Input
                                            id="direccion"
                                            className="bg-blue-300/10 border-blue-500/10"
                                            value={formData.address}
                                            readOnly
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="correo">Correo</Label>
                                        <Input
                                            id="correo"
                                            className="bg-blue-300/10 border-blue-500/10"
                                            value={formData.email || ""}
                                            readOnly
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <EditInfoPatientModal
                                            formData={formData}
                                            setFormData={setFormData}
                                        />
                                    </div>

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
                                                <SelectItem value="confirmado">
                                                    Confirmado ✅
                                                </SelectItem>
                                                <SelectItem value="no-contesta">
                                                    No contesta ❌
                                                </SelectItem>
                                                <SelectItem value="rechazado">
                                                    Rechazado 🚫
                                                </SelectItem>
                                                <SelectItem value="numero-equivocado">
                                                    Número equivocado 🚫
                                                </SelectItem>
                                                <SelectItem value="no-volver-a-llamar">
                                                    No volver a llamar 🚫
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {formData.callResult === "confirmado" && (
                                        <>
                                            <div className="space-y-1">
                                                <Label>Fecha de Domicilio</Label>
                                                <div className="flex gap-2">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button variant="outline" className="flex-1 text-left">
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {formData.deliveryDate
                                                                    ? format(parse(formData.deliveryDate, "yyyy-MM-dd", new Date()), "PPP", { locale: es })
                                                                    : "Seleccionar fecha"}
                                                            </Button>
                                                        </PopoverTrigger>

                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar
                                                                mode="single"
                                                                selected={
                                                                    formData.deliveryDate
                                                                        ? parse(formData.deliveryDate, "yyyy-MM-dd", new Date())
                                                                        : undefined
                                                                }
                                                                onSelect={(date) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        deliveryDate: date ? format(date, "yyyy-MM-dd") : null,
                                                                    }))
                                                                }
                                                                locale={es}
                                                                autoFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>

                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                                                <div className="space-y-1">
                                                    <Label>Hora de Entrega</Label>
                                                    <Input
                                                        type="time"
                                                        value={
                                                            formData.deliveryTime ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                deliveryTime:
                                                                    e.target.value ||
                                                                    null,
                                                            }))
                                                        }
                                                        className="w-full"
                                                    />
                                                </div>

                                                <div className="space-y-1">
                                                    <Label>Tipo de empaque</Label>
                                                    <Select
                                                        value={formData.packageType}
                                                        onValueChange={(val) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                packageType:
                                                                    val as PackageType,
                                                            }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="generico">
                                                                Genérico
                                                            </SelectItem>
                                                            <SelectItem value="nevera">
                                                                Nevera
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-1">
                                                    <Label>¿Es urgente?</Label>
                                                    <Select
                                                        value={
                                                            formData.isUrgent
                                                                ? "si"
                                                                : "no"
                                                        }
                                                        onValueChange={(val) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                isUrgent:
                                                                    val === "si",
                                                            }))
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccionar..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="no">
                                                                No
                                                            </SelectItem>
                                                            <SelectItem value="si">
                                                                Sí
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="md:col-span-2">
                                        <Label htmlFor="observaciones">
                                            Observaciones
                                        </Label>
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

                                    <div className="flex gap-4 md:col-span-2">
                                        <Button
                                            type="submit"
                                            className="flex-1 bg-[#0A1C41]"
                                            disabled={isPending}
                                        >
                                            <Truck className="mr-2 h-4 w-4" />{" "}
                                            {isPending
                                                ? "Enviando..."
                                                : "Enviar a Domicilio"}
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
            <ConfirmActionModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmSave}
                state={modalState}
                message={modalMessage}
            />
        </>
    );
};

