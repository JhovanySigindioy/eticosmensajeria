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
    EntregaPendiente,
    PackageType,
} from "@/types/EntregaPendiente.types";
import { EditarPacienteModal } from "./EditarPacientemodal";
import { useEntrega } from "@/hooks/useEntrega";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";

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

    const [formData, setFormData] = useState<EntregaPendiente>({
        radicadoTipoNumero: "",
        nombrePaciente: "",
        identificacion: "",
        contacto1: "",
        contacto2: null,
        correo: null,
        direccion: "",
        fechaGestion: "",
        horaGestion: "",
        fechaDomicilio: null,
        horaDomicilio: null,
        tipoEmpaque: "generico",
        resultadoLlamada: null,
        observaciones: null,
        regenteId: regente,
        esUrgente: false,
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
                radicadoTipoNumero: selectedEntrega.registeredTypeNumber,
                nombrePaciente: selectedEntrega.patientName,
                identificacion: selectedEntrega.identification,
                contacto1: selectedEntrega.primaryPhone,
                contacto2: selectedEntrega.secondaryPhone,
                correo: selectedEntrega.email,
                direccion: selectedEntrega.address,
                fechaGestion: selectedEntrega.managementDate,
                horaGestion: selectedEntrega.managementTime,
                fechaDomicilio: selectedEntrega.deliveryDate,
                horaDomicilio: selectedEntrega.deliveryTime,
                tipoEmpaque: selectedEntrega.packageType,
                resultadoLlamada: selectedEntrega.callResult,
                observaciones: selectedEntrega.notes,
                regenteId: selectedEntrega.pharmacistId,
                esUrgente: selectedEntrega.isUrgent,
            });
            setErrorMessage(null);
        } else {
            resetForm();
        }
    }, [selectedEntrega]);

    const resetForm = () => {
        setSearchValue("");
        setFormData({
            radicadoTipoNumero: "",
            nombrePaciente: "",
            identificacion: "",
            contacto1: "",
            contacto2: null,
            correo: null,
            direccion: "",
            fechaGestion: "",
            horaGestion: "",
            fechaDomicilio: null,
            horaDomicilio: null,
            tipoEmpaque: "generico",
            resultadoLlamada: null,
            observaciones: null,
            regenteId: regente,
            esUrgente: false,
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
                    radicadoTipoNumero: paciente.numberFormula || "",
                    nombrePaciente: paciente.name || "",
                    direccion: paciente.address || "",
                    contacto1: paciente.phones || "",
                    correo: paciente.email || null,
                    identificacion: paciente.identification || "",
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

        if (!formData.radicadoTipoNumero || !formData.nombrePaciente) {
            setErrorMessage("El radicado y el paciente son obligatorios.");
            return;
        }

        if (
            formData.resultadoLlamada === "confirmado" &&
            !formData.fechaDomicilio
        ) {
            setErrorMessage(
                "Debe seleccionar una fecha de domicilio para entregas confirmadas."
            );
            return;
        }

        const payload: EntregaPendiente = {
            ...formData,
            fechaGestion: new Date().toISOString().split("T")[0], // yyyy-mm-dd
            horaGestion: new Date().toISOString().substring(11, 19), // hh:mm:ss
        };

        try {
            const response = await saveEntrega(payload);
            console.log("✅ Envío exitosooooooooooooooooooooooo exitoso:", payload);

            // 🔑 Guardar en el store la respuesta oficial del backend
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
                        <Label htmlFor="busqueda" className="font-semibold text-[#0A1C41]">
                            Buscar Radicado o Tipo-Número
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="busqueda"
                                placeholder="Ej: 1124853578 o F10551-265895"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value.trim())}
                                className="focus:border-[#0082FF] focus:ring-[#0082FF]"
                            />
                            <Button
                                type="button"
                                onClick={handleSearch}
                                size="icon"
                                className="bg-[#0082FF] hover:bg-[#005cbf]"
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
                        {formData.radicadoTipoNumero && !errorMessage && (
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
                                    <Input
                                        id="formula"
                                        value={formData.radicadoTipoNumero}
                                        readOnly
                                    />
                                </div>

                                {/* Cédula */}
                                <div className="space-y-1">
                                    <Label htmlFor="identificacion">Número de Cédula</Label>
                                    <Input
                                        id="identificacion"
                                        value={formData.identificacion}
                                        readOnly
                                    />
                                </div>

                                {/* Paciente */}
                                <div className="space-y-1">
                                    <Label htmlFor="paciente">Nombre del Paciente</Label>
                                    <Input
                                        id="paciente"
                                        value={formData.nombrePaciente}
                                        readOnly
                                    />
                                </div>

                                {/* Teléfono */}
                                <div className="space-y-1">
                                    <Label htmlFor="telefono">Teléfono</Label>
                                    <Input id="telefono" value={formData.contacto1} readOnly />
                                </div>

                                {/* Correo */}
                                <div className="space-y-1">
                                    <Label htmlFor="correo">Correo Electrónico</Label>
                                    <Input
                                        id="correo"
                                        value={formData.correo || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, correo: e.target.value }))
                                        }
                                    />
                                </div>

                                {/* Dirección actual */}
                                <div className="space-y-1">
                                    <Label htmlFor="direccion">Dirección Actual</Label>
                                    <Input id="direccion" value={formData.direccion} readOnly />
                                </div>

                                {/* Modal para editar dirección */}
                                <div className="md:col-span-2">
                                    <EditarPacienteModal
                                        formData={formData}
                                        setFormData={setFormData}
                                    />
                                </div>

                                {/* Resultado llamada */}
                                <div className="space-y-1">
                                    <Label>Resultado de la Llamada</Label>
                                    <Select
                                        value={formData.resultadoLlamada || ""}
                                        onValueChange={(value: CallResult) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                resultadoLlamada: value,
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
                                            <SelectItem value="numero-equivocado">
                                                Número equivocado 🚫
                                            </SelectItem>
                                            <SelectItem value="no-volver-a-llamar">
                                                No volver a llamar 🚫
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Fecha */}
                                {formData.resultadoLlamada === "confirmado" && (
                                    <div className="space-y-1">
                                        <Label>Fecha de Domicilio</Label>
                                        <div className="flex gap-2">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="flex-1 text-left">
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {formData.fechaDomicilio
                                                            ? format(new Date(formData.fechaDomicilio), "PPP", {
                                                                locale: es,
                                                            })
                                                            : "Seleccionar fecha"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            formData.fechaDomicilio
                                                                ? new Date(formData.fechaDomicilio)
                                                                : undefined
                                                        }
                                                        onSelect={(date) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                fechaDomicilio: date
                                                                    ? date.toISOString().split("T")[0]
                                                                    : null,
                                                            }))
                                                        }
                                                        locale={es}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {formData.fechaDomicilio && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            fechaDomicilio: null,
                                                        }))
                                                    }
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Hora */}
                                {formData.resultadoLlamada === "confirmado" && (
                                    <div className="space-y-1">
                                        <Label>Hora de Entrega</Label>
                                        <Input
                                            type="time"
                                            value={formData.horaDomicilio || ""}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    horaDomicilio: e.target.value || null,
                                                }))
                                            }
                                            className="w-full"
                                        />
                                    </div>
                                )}

                                {/* Tipo de Empaque */}
                                <div className="space-y-1">
                                    <Label>Tipo de empaque</Label>
                                    <Select
                                        value={formData.tipoEmpaque}
                                        onValueChange={(val) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                tipoEmpaque: val as PackageType,
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
                                        value={formData.esUrgente ? "si" : "no"}
                                        onValueChange={(val) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                esUrgente: val === "si",
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

                                {/* Observaciones */}
                                <div className="md:col-span-2">
                                    <Label htmlFor="observaciones">Observaciones</Label>
                                    <textarea
                                        id="observaciones"
                                        value={formData.observaciones || ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                observaciones: e.target.value,
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
