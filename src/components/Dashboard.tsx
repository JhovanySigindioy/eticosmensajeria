import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Pedido } from "@/types/pedido.types";
import OrderCard from "./OrderCard";
import ValidationForm from "./ValidationForm";

interface DashboardProps {
    regente: string;
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ regente, onLogout }) => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const savedPedidos = localStorage.getItem("pedidos-v3");
        if (savedPedidos) {
            try {
                setPedidos(JSON.parse(savedPedidos) as Pedido[]);
            } catch (error) {
                console.error("Error parsing pedidos from localStorage", error);
                setPedidos([]);
            }
        } else {
            const initialPedidos: Pedido[] = [
                {
                    id: "F10551-265895",
                    paciente: "Juan Perez",
                    direccion: "Calle Falsa 123, Apto 101",
                    telefono: "3001112233",
                    hora: "10:00",
                    estado: "confirmado",
                    resultadoLlamada: "confirmado",
                    observaciones: "Entregar en portería.",
                    intentos: 1,
                    fechaGestion: new Date().toISOString(),
                    fechaEntrega: new Date().toISOString(),
                },
                {
                    id: "F10551-265896",
                    paciente: "Ana Gomez",
                    direccion: "Av Siempre Viva 456, Casa",
                    telefono: "3004445566",
                    hora: "14:30",
                    estado: "en-camino",
                    resultadoLlamada: "confirmado",
                    observaciones: "Llamar al llegar.",
                    intentos: 1,
                    fechaGestion: new Date().toISOString(),
                    fechaEntrega: new Date().toISOString(),
                },
                {
                    id: "F10551-265897",
                    paciente: "Carlos Ruiz",
                    direccion: "Cra 7 8-90, Interior 5",
                    telefono: "3007778899",
                    hora: "11:00",
                    estado: "en-gestion",
                    resultadoLlamada: "no-contesta",
                    observaciones: "Volver a llamar en la tarde.",
                    intentos: 2,
                    fechaGestion: new Date().toISOString(),
                    fechaEntrega: new Date(
                        new Date().setDate(new Date().getDate() + 1)
                    ).toISOString(),
                },
                {
                    id: "F10551-265898",
                    paciente: "Lucia Fernandez",
                    direccion: "Transversal 5 # 45-12",
                    telefono: "3001234567",
                    hora: "09:00",
                    estado: "entregado",
                    resultadoLlamada: "confirmado",
                    observaciones: "Entregado con éxito.",
                    intentos: 1,
                    fechaGestion: new Date(
                        new Date().setDate(new Date().getDate() - 1)
                    ).toISOString(),
                    fechaEntrega: new Date(
                        new Date().setDate(new Date().getDate() - 1)
                    ).toISOString(),
                },
                {
                    id: "F10551-265899",
                    paciente: "Mario Bro",
                    direccion: "Castillo Bowser, Mundo 8-4",
                    telefono: "3009876543",
                    hora: "16:00",
                    estado: "cancelado",
                    resultadoLlamada: "rechazado",
                    observaciones: "Paciente indica que ya no necesita el medicamento.",
                    intentos: 1,
                    fechaGestion: new Date().toISOString(),
                    fechaEntrega: new Date().toISOString(),
                },
                {
                    id: "F10551-265900",
                    paciente: "Pedro Pascal",
                    direccion: "Calle 100 # 15-20",
                    telefono: "3105556677",
                    hora: "15:00",
                    estado: "confirmado",
                    resultadoLlamada: "confirmado",
                    observaciones: "",
                    intentos: 1,
                    fechaGestion: new Date().toISOString(),
                    fechaEntrega: new Date().toISOString(),
                },
                {
                    id: "F10551-265901",
                    paciente: "Luisa Martinez",
                    direccion: "Diagonal 45 # 23-11",
                    telefono: "3208889900",
                    hora: "18:00",
                    estado: "en-gestion",
                    resultadoLlamada: "reprogramar",
                    observaciones: "Reprogramar para mañana",
                    intentos: 1,
                    fechaGestion: new Date().toISOString(),
                    fechaEntrega: new Date(
                        new Date().setDate(new Date().getDate() + 1)
                    ).toISOString(),
                },
            ];
            setPedidos(initialPedidos);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("pedidos-v3", JSON.stringify(pedidos));
    }, [pedidos]);

    const handleSavePedido = (pedidoData: Pedido) => {
        setPedidos((prev) => {
            const existingIndex = prev.findIndex((p) => p.id === pedidoData.id);
            if (existingIndex !== -1) {
                const updatedPedidos = [...prev];
                updatedPedidos[existingIndex] = {
                    ...updatedPedidos[existingIndex],
                    ...pedidoData,
                };
                return updatedPedidos;
            } else {
                const newPedido: Pedido = {
                    ...pedidoData,
                    intentos: 1,
                    fechaGestion: new Date().toISOString(),
                };
                return [newPedido, ...prev];
            }
        });
        setSelectedPedido(null);
        toast({
            title: "Pedido Guardado",
            description: `El pedido ${pedidoData.id} ha sido actualizado.`,
        });
    };

    const handleSelectPedido = (pedido: Pedido) => {
        setSelectedPedido(pedido);
    };

    const clearSelectedPedido = () => {
        setSelectedPedido(null);
    };

    return (
        <div className="min-h-screen bg-[#F2F2F2]">
            <header className="gradient-bg text-white shadow-md sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold">
                            Panel de Gestión de Domicilios
                        </h1>
                        <p className="text-sm text-blue-200">
                            Regente: <span className="font-semibold">{regente}</span>
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onLogout}
                        className="text-white hover:bg-white/10"
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="lg:col-span-2 lg:sticky lg:top-24">
                        <ValidationForm
                            pedidos={pedidos}
                            onSave={handleSavePedido}
                            selectedPedido={selectedPedido}
                            clearSelectedPedido={clearSelectedPedido}
                            regente={regente}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <OrderCard
                            pedidos={pedidos}
                            setPedidos={setPedidos}
                            onEditPedido={handleSelectPedido}
                        />
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;
