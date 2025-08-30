import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar as CalendarIcon,
    Filter,
    Package,
    Phone,
    MapPin,
    Eye,
    Truck,
    CheckCircle,
    XCircle,
    Send,
    Edit,
    Trash2,
    Search,
    ChevronsLeft,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    format,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    isWithinInterval,
    parseISO,
} from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { EstadoPedido, Pedido } from "@/types/pedido.types";

// 🔑 Config de estados
const statusConfig: Record<
    EstadoPedido,
    { text: string; className: string; icon: React.ReactNode }
> = {
    pendiente: {
        text: "Pendiente",
        className: "status-pendiente",
        icon: <Package className="h-4 w-4" />,
    },
    confirmado: {
        text: "Confirmado",
        className: "status-confirmado",
        icon: <CheckCircle className="h-4 w-4" />,
    },
    "en-camino": {
        text: "En Camino",
        className: "status-en-camino",
        icon: <Truck className="h-4 w-4" />,
    },
    entregado: {
        text: "Entregado",
        className: "status-entregado",
        icon: <CheckCircle className="h-4 w-4" />,
    },
    cancelado: {
        text: "Cancelado",
        className: "status-cancelado",
        icon: <XCircle className="h-4 w-4" />,
    },
    "en-gestion": {
        text: "En Gestión",
        className: "status-en-gestion",
        icon: <Package className="h-4 w-4" />,
    },
    agendado: {
        text: "Agendado",
        className: "status-en-camino",
        icon: <Send className="h-4 w-4" />,
    },
    reintentar: {
        text: "Reintentar",
        className: "status-pendiente",
        icon: <Package className="h-4 w-4" />,
    },
};

interface PedidoCardProps {
    pedido: Pedido;
    onStatusChange: (id: string, newStatus: EstadoPedido) => void;
    onEdit: (pedido: Pedido) => void;
    expanded: string | null;
    setExpanded: React.Dispatch<React.SetStateAction<string | null>>;
}

const PedidoCard: React.FC<PedidoCardProps> = ({
    pedido,
    onStatusChange,
    onEdit,
    expanded,
    setExpanded,
}) => {
    const isExpanded = expanded === pedido.id;
    const config = statusConfig[pedido.estado] || statusConfig.pendiente;

    return (
        <motion.div layout>
            <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#0082FF]/50">
                <CardHeader className="flex flex-row items-start justify-between p-4 bg-white">
                    <div>
                        <CardTitle className="text-base font-bold text-[#0A1C41]">{pedido.id}</CardTitle>
                        <p className="text-sm text-gray-600">{pedido.paciente}</p>
                    </div>
                    <Badge className={`${config.className} flex items-center gap-1`}>
                        {config.icon}
                        {config.text}
                    </Badge>
                </CardHeader>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CardContent className="p-4 border-t">
                                {/* Aquí puedes agregar contenido expandido */}
                            </CardContent>
                        </motion.div>
                    )}
                </AnimatePresence>

                <CardContent className="p-4 space-y-3">
                    <div className="flex items-start text-sm text-gray-700">
                        <MapPin className="h-4 w-4 mr-3 mt-0.5 text-[#0082FF] flex-shrink-0" />
                        <span>{pedido.direccion}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                        <Phone className="h-4 w-4 mr-3 text-[#0082FF]" />
                        <a href={`tel:${pedido.telefono}`} className="hover:underline">
                            {pedido.telefono}
                        </a>
                    </div>
                </CardContent>

                <CardFooter className="p-2 bg-gray-50 flex justify-end gap-1 flex-wrap">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpanded(isExpanded ? null : pedido.id)}
                    >
                        <Eye className="h-4 w-4 mr-1" />
                        Detalles
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onEdit(pedido)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                    </Button>
                    {pedido.estado === "en-camino" && (
                        <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => onStatusChange(pedido.id, "entregado")}
                        >
                            <CheckCircle className="h-4 w-4 mr-1" /> Entregar
                        </Button>
                    )}
                    {pedido.estado !== "cancelado" && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => onStatusChange(pedido.id, "cancelado")}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Cancelar
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
};

// 🔑 Pagination
interface PaginationProps {
    page: number;
    totalPages: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, setPage }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-center space-x-2 py-4">
            <Button variant="outline" size="icon" onClick={() => setPage(1)} disabled={page === 1}>
                <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
                Página {page} de {totalPages}
            </span>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
            >
                <ChevronsRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

// 🔑 PedidosCards
interface PedidosCardsProps {
    pedidos: Pedido[];
    setPedidos: React.Dispatch<React.SetStateAction<Pedido[]>>;
    onEditPedido: (pedido: Pedido) => void;
}

const PedidosCards: React.FC<PedidosCardsProps> = ({
    pedidos,
    setPedidos,
    onEditPedido,
}) => {
    const [activeTab, setActiveTab] = useState<string>("todos");
    const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
        from: null,
        to: null,
    });
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ITEMS_PER_PAGE = 5;
    const { toast } = useToast();

    const handleStatusChange = (pedidoId: string, newStatus: EstadoPedido) => {
        setPedidos((prev) =>
            prev.map((p) =>
                p.id === pedidoId
                    ? { ...p, estado: newStatus, fechaGestion: new Date().toISOString() }
                    : p
            )
        );
        toast({
            title: "Estado Actualizado",
            description: `Pedido ${pedidoId} ahora está en estado: ${statusConfig[newStatus].text}.`,
        });
    };

    const handleAgendarDomicilios = () => {
        let agendadosCount = 0;
        setPedidos((prev) =>
            prev.map((p) => {
                if (p.estado === "confirmado") {
                    const endOfDayTo = dateRange.to ? new Date(dateRange.to) : null;
                    if (endOfDayTo) endOfDayTo.setHours(23, 59, 59, 999);

                    const isInRange =
                        dateRange.from && endOfDayTo
                            ? isWithinInterval(parseISO(p.fechaEntrega), {
                                start: dateRange.from,
                                end: endOfDayTo,
                            })
                            : true;
                    if (isInRange) {
                        agendadosCount++;
                        return { ...p, estado: "agendado" };
                    }
                }
                return p;
            })
        );

        if (agendadosCount > 0) {
            toast({
                title: "Domicilios Agendados",
                description: `${agendadosCount} Pendientes entrega confirmados, han sido enviados al operador logístico.`,
            });
        } else {
            toast({
                title: "No hay pedidos para agendar",
                description:
                    "No se encontraron resultados",
                variant: "destructive",
            });
        }
    };

    const setDateFilter = (preset: "hoy" | "semana" | "mes") => {
        const today = new Date();
        let from: Date | null = null;
        let to: Date | null = null;

        if (preset === "hoy") {
            from = today;
            to = today;
        } else if (preset === "semana") {
            from = startOfWeek(today, { weekStartsOn: 1 });
            to = endOfWeek(today, { weekStartsOn: 1 });
        } else if (preset === "mes") {
            from = startOfMonth(today);
            to = endOfMonth(today);
        }

        setDateRange({ from, to });
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setDateRange({ from: null, to: null });
        setSearchTerm("");
        setCurrentPage(1);
    };

    const filteredPedidos = useMemo(() => {
        let filtered = [...pedidos];

        if (dateRange.from && dateRange.to) {
            const endOfDayTo = new Date(dateRange.to);
            endOfDayTo.setHours(23, 59, 59, 999);
            filtered = filtered.filter((p) => {
                try {
                    const pedidoDate = parseISO(p.fechaEntrega);
                    return isWithinInterval(pedidoDate, {
                        start: dateRange.from!,
                        end: endOfDayTo,
                    });
                } catch {
                    return false;
                }
            });
        }

        if (activeTab !== "todos") {
            if (activeTab === "en-gestion") {
                filtered = filtered.filter(
                    (p) =>
                        p.estado === "en-gestion" ||
                        p.resultadoLlamada === "reprogramar" ||
                        p.resultadoLlamada === "no-contesta"
                );
            } else if (activeTab === "confirmados") {
                filtered = filtered.filter((p) =>
                    ["confirmado", "agendado", "en-camino"].includes(p.estado)
                );
            } else {
                filtered = filtered.filter((p) => p.estado === activeTab);
            }
        }

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    (p.id && p.id.toLowerCase().includes(lowercasedTerm)) ||
                    (p.paciente && p.paciente.toLowerCase().includes(lowercasedTerm)) ||
                    (p.direccion && p.direccion.toLowerCase().includes(lowercasedTerm)) ||
                    (p.telefono && p.telefono.includes(lowercasedTerm))
            );
        }

        return filtered;
    }, [pedidos, activeTab, dateRange, searchTerm]);

    const totalPages = Math.ceil(filteredPedidos.length / ITEMS_PER_PAGE);
    const paginatedPedidos = filteredPedidos.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );


    return (
        <div className="space-y-6">
            {/* Filtros y acciones */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center text-[#0A1C41]">
                        <Filter className="mr-2 text-[#0082FF]" />
                        Filtros y Acciones
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Buscar por radicado, paciente, dirección..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-[140px] justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange.from
                                            ? format(dateRange.from, "d LLL y")
                                            : "Fecha Inicial"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={dateRange.from || undefined}
                                        onSelect={(d) => {
                                            setDateRange((prev) => ({ ...prev, from: d || null }));
                                            setCurrentPage(1);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-[140px] justify-start text-left font-normal"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange.to
                                            ? format(dateRange.to, "d LLL y")
                                            : "Fecha Final"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={dateRange.to || undefined}
                                        onSelect={(d) => {
                                            setDateRange((prev) => ({ ...prev, to: d || null }));
                                            setCurrentPage(1);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button variant="outline" size="sm" onClick={() => setDateFilter("hoy")}>
                                Hoy
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setDateFilter("semana")}>
                                Semana
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setDateFilter("mes")}>
                                Mes
                            </Button>
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                Limpiar filtros
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-4 bg-gray-50 border-t">
                    <Button
                        className="w-full bg-[#0A1C41] hover:bg-[#005cbf]"
                        onClick={handleAgendarDomicilios}
                    >
                        <Send className="mr-2 h-4 w-4" />
                        Agendar Domicilios Confirmados
                    </Button>
                </CardFooter>
            </Card>

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={(tab) => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                }}
            >
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="todos">Todos</TabsTrigger>
                    <TabsTrigger value="confirmados">Confirmados</TabsTrigger>
                    <TabsTrigger value="en-gestion">En Gestión</TabsTrigger>
                    <TabsTrigger value="cancelados">Cancelados</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                    {paginatedPedidos.length > 0 ? (
                        paginatedPedidos.map(pedido => (
                            <PedidoCard key={pedido.id} pedido={pedido} onStatusChange={handleStatusChange} onEdit={onEditPedido} expanded={expandedCard} setExpanded={setExpandedCard} />
                        ))
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-gray-500 col-span-full">
                            <Package className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium">No se encontraron pedidos</h3>
                            <p className="mt-1 text-sm">Intenta ajustar los filtros o crea un nuevo pedido.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Pagination page={currentPage} totalPages={totalPages} setPage={setCurrentPage} />
        </div>
    );
};

export default PedidosCards;
