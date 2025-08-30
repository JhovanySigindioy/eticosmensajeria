import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Calendar as CalendarIcon,
    Clock,
    Phone,
    MapPin,
    MessageSquare,
    Save,
    X,
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
import { useToast } from "@/hooks/use-toast";
import type { Pedido } from "@/types/pedido.types";

// 🔑 Tipo auxiliar para el formulario
interface FormPedido
    extends Omit<Pedido, "fechaEntrega" | "fechaGestion" | "intentos"> {
    fechaEntrega: Date;
    intentos?: number;
    fechaGestion?: string;
}

interface ValidationFormProps {
    pedidos: Pedido[];
    onSave: (pedido: Pedido) => void;
    selectedPedido: Pedido | null;
    clearSelectedPedido: () => void;
    regente: string;
}

const ValidationForm: React.FC<ValidationFormProps> = ({
    pedidos,
    onSave,
    selectedPedido,
    clearSelectedPedido,
    regente,
}) => {
    const [radicado, setRadicado] = useState<string>("");
    const [formData, setFormData] = useState<FormPedido>({
        id: "",
        paciente: "",
        direccion: "",
        telefono: "",
        fechaEntrega: new Date(),
        hora: "",
        resultadoLlamada: "",
        observaciones: "",
        estado: "pendiente",
    });
    const { toast } = useToast();

    useEffect(() => {
        if (selectedPedido) {
            setRadicado(selectedPedido.id);
            setFormData({
                ...selectedPedido,
                fechaEntrega: selectedPedido.fechaEntrega
                    ? new Date(selectedPedido.fechaEntrega)
                    : new Date(),
            });
        } else {
            resetForm();
        }
    }, [selectedPedido]);

    const resetForm = () => {
        setRadicado("");
        setFormData({
            id: "",
            paciente: "",
            direccion: "",
            telefono: "",
            fechaEntrega: new Date(),
            hora: "",
            resultadoLlamada: "",
            observaciones: "",
            estado: "pendiente",
        });
    };

    const handleSearch = () => {
        if (!radicado) {
            toast({
                title: "Campo vacío",
                description: "Por favor, ingresa un radicado para buscar o crear.",
                variant: "destructive",
            });
            return;
        }
        const pedidoEncontrado = pedidos.find(
            (p) => p.id.toLowerCase() === radicado.toLowerCase()
        );
        if (pedidoEncontrado) {
            setFormData({
                ...pedidoEncontrado,
                fechaEntrega: pedidoEncontrado.fechaEntrega
                    ? new Date(pedidoEncontrado.fechaEntrega)
                    : new Date(),
            });
            toast({
                title: "Pedido encontrado",
                description: `Cargando datos para el radicado ${pedidoEncontrado.id}.`,
            });
        } else {
            resetForm();
            setFormData((prev) => ({ ...prev, id: radicado, estado: "pendiente" }));
            toast({
                title: "Nuevo Pedido",
                description: `Creando un nuevo pedido con radicado ${radicado}. Ingresa los datos.`,
            });
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof FormPedido, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date?: Date) => {
        if (!date) return;
        setFormData((prev) => ({ ...prev, fechaEntrega: date }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.id || !formData.paciente || !formData.resultadoLlamada) {
            toast({
                title: "Campos requeridos",
                description:
                    "El radicado, paciente y resultado de llamada son obligatorios.",
                variant: "destructive",
            });
            return;
        }

        let nuevoEstado = formData.estado;
        if (formData.resultadoLlamada === "confirmado") nuevoEstado = "confirmado";
        if (formData.resultadoLlamada === "rechazado") nuevoEstado = "cancelado";
        if (["no-contesta", "reprogramar"].includes(formData.resultadoLlamada)) {
            nuevoEstado = "en-gestion";
        }

        onSave({
            ...formData,
            estado: nuevoEstado,
            regente,
            fechaGestion: new Date().toISOString(),
            intentos: (selectedPedido ? formData.intentos || 0 : 0) + 1,
            fechaEntrega: formData.fechaEntrega.toISOString(),
        });
        resetForm();
        clearSelectedPedido();
    };

    return (
        <Card className="shadow-lg border-t-4 border-[#0082FF]">
            <CardHeader>
                <CardTitle className="text-[#0A1C41] flex items-center">
                    <MessageSquare className="mr-2 text-[#0082FF]" />
                    Formulario Pendientes Entrega
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 🔎 Buscar por radicado */}
                    <div className="space-y-2">
                        <Label htmlFor="radicado" className="font-semibold text-[#0A1C41]">
                            Radicado
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="radicado"
                                name="radicado"
                                placeholder="Ej: F10551-265895"
                                value={radicado}
                                onChange={(e) => setRadicado(e.target.value)}
                                className="focus:border-[#0082FF] focus:ring-[#0082FF]"
                            />
                            <Button
                                type="button"
                                onClick={handleSearch}
                                size="icon"
                                className="bg-[#0082FF] hover:bg-[#005cbf]"
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* resto del formulario animado */}
                    <AnimatePresence>
                        {formData.id && (
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0, y: -20, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -20, height: 0 }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* Nombre del paciente */}
                                <div className="space-y-2">
                                    <Label htmlFor="paciente" className="font-semibold text-[#0A1C41]">
                                        Nombre del Paciente
                                    </Label>
                                    <Input
                                        id="paciente"
                                        name="paciente"
                                        placeholder="Nombre completo"
                                        value={formData.paciente}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                {/* Fecha y hora */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="font-semibold text-[#0A1C41]">Fecha de Domicilio</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {formData.fechaEntrega
                                                        ? format(formData.fechaEntrega, "PPP", { weekStartsOn: 1 })
                                                        : "Seleccionar fecha"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={formData.fechaEntrega}
                                                    onSelect={handleDateChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="hora" className="font-semibold text-[#0A1C41]">
                                            Hora
                                        </Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="hora"
                                                name="hora"
                                                type="time"
                                                value={formData.hora}
                                                onChange={handleInputChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Teléfono y dirección */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="telefono" className="font-semibold text-[#0A1C41]">
                                            Teléfono
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="telefono"
                                                name="telefono"
                                                placeholder="Número de contacto"
                                                value={formData.telefono}
                                                onChange={handleInputChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="direccion" className="font-semibold text-[#0A1C41]">
                                            Dirección
                                        </Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="direccion"
                                                name="direccion"
                                                placeholder="Dirección de entrega"
                                                value={formData.direccion}
                                                onChange={handleInputChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Resultado llamada */}
                                <div className="space-y-2">
                                    <Label className="font-semibold text-[#0A1C41]">Resultado de la Llamada</Label>
                                    <Select
                                        value={formData.resultadoLlamada}
                                        onValueChange={(value) => handleSelectChange("resultadoLlamada", value)}
                                        required
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar resultado..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="confirmado">Confirmado ✅</SelectItem>
                                            <SelectItem value="no-contesta">No contesta ❌</SelectItem>
                                            <SelectItem value="reprogramar">Reprogramar ⏳</SelectItem>
                                            <SelectItem value="rechazado">Rechazado 🚫</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Observaciones */}
                                <div className="space-y-2">
                                    <Label htmlFor="observaciones" className="font-semibold text-[#0A1C41]">
                                        Observaciones
                                    </Label>
                                    <textarea
                                        id="observaciones"
                                        name="observaciones"
                                        value={formData.observaciones}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full rounded-md border border-input p-2 text-sm focus:border-[#0082FF] focus:ring-[#0082FF]"
                                        placeholder="Añadir comentarios o instrucciones"
                                    />
                                </div>

                                {/* Botones */}
                                <div className="flex gap-4 pt-4">
                                    <Button type="submit" className="flex-1 bg-[#0A1C41] hover:bg-[#081633]">
                                        <Save className="mr-2 h-4 w-4" />{" "}
                                        {selectedPedido ? "Actualizar Pedido" : "Registrar Pedido"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            resetForm();
                                            clearSelectedPedido();
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
