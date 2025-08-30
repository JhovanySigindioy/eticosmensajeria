import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  FileCheck2,
  History,
  XCircle,
  RefreshCcw,
  Check,
  Ban,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { EstadoPedido, Pedido } from "@/types/pedido.types";


// 🔑 Funciones de estado tipadas
const getStatusClass = (estado: EstadoPedido): string => {
  const classes: Record<EstadoPedido, string> = {
    pendiente: "status-pendiente",
    confirmado: "status-confirmado",
    agendado: "status-agendado",
    entregado: "status-entregado",
    cancelado: "status-cancelado",
    reintentar: "status-reintentar",
    "en-gestion": "status-en-gestion",
    "en-camino": "status-en-camino",
  };
  return classes[estado] || "status-pendiente";
};

const getStatusText = (estado: EstadoPedido): string => {
  const texts: Record<EstadoPedido, string> = {
    pendiente: "Pendiente",
    confirmado: "Confirmado",
    agendado: "Agendado",
    entregado: "Entregado",
    cancelado: "Cancelado",
    reintentar: "Reintentar",
    "en-gestion": "En Gestión",
    "en-camino": "En Camino",
  };
  return texts[estado] || "Pendiente";
};

interface PedidosPanelProps {
  pedidos: Pedido[];
  setPedidos: React.Dispatch<React.SetStateAction<Pedido[]>>;
  onSelectPedido: (pedido: Pedido) => void;
}

const PedidosPanel: React.FC<PedidosPanelProps> = ({
  pedidos,
  setPedidos,
  onSelectPedido,
}) => {
  const [activeTab, setActiveTab] = useState("confirmados");
  const { toast } = useToast();

  const handleStatusChange = (pedidoId: string, newStatus: EstadoPedido) => {
    setPedidos((prev) =>
      prev.map((p) =>
        p.id === pedidoId ? { ...p, estado: newStatus } : p
      )
    );
    toast({
      title: "Estado Actualizado",
      description: `Pedido ${pedidoId} ahora está ${getStatusText(newStatus)}.`,
    });
  };

  const handleAction = (
    pedidoId: string,
    action: "reintentar" | "confirmar" | "cancelar"
  ) => {
    if (action === "reintentar") {
      const pedido = pedidos.find((p) => p.id === pedidoId);
      if (pedido) {
        onSelectPedido(pedido);
        toast({
          title: "Reintentando Pedido",
          description: `Cargando datos del pedido ${pedidoId} para nuevo intento.`,
        });
      }
    } else if (action === "confirmar") {
      handleStatusChange(pedidoId, "confirmado");
    } else if (action === "cancelar") {
      handleStatusChange(pedidoId, "cancelado");
    }
  };

  const renderTable = (data: Pedido[], isConfirmedTab = false) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Radicado</TableHead>
          <TableHead>Paciente</TableHead>
          <TableHead>Dirección</TableHead>
          <TableHead>Hora</TableHead>
          <TableHead className="text-center">Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <AnimatePresence>
          {data.map((pedido) => (
            <motion.tr
              key={pedido.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectPedido(pedido)}
            >
              <TableCell className="font-medium">{pedido.id}</TableCell>
              <TableCell>{pedido.paciente}</TableCell>
              <TableCell>{pedido.direccion}</TableCell>
              <TableCell>{pedido.hora}</TableCell>
              <TableCell className="text-center">
                {isConfirmedTab ? (
                  <Select
                    value={pedido.estado}
                    onValueChange={(value) =>
                      handleStatusChange(pedido.id, value as EstadoPedido)
                    }
                  >
                    <SelectTrigger
                      className={`w-32 mx-auto text-xs ${getStatusClass(
                        pedido.estado
                      )}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="agendado">Agendado</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={getStatusClass(pedido.estado)}>
                    {getStatusText(pedido.estado)}
                  </Badge>
                )}
              </TableCell>
            </motion.tr>
          ))}
        </AnimatePresence>
      </TableBody>
    </Table>
  );

  const renderGestionTable = (data: Pedido[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Radicado</TableHead>
          <TableHead>Intentos</TableHead>
          <TableHead>Última Gestión</TableHead>
          <TableHead>Observaciones</TableHead>
          <TableHead className="text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <AnimatePresence>
          {data.map((pedido) => (
            <motion.tr
              key={pedido.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TableCell className="font-medium">{pedido.id}</TableCell>
              <TableCell className="text-center">{pedido.intentos}</TableCell>
              <TableCell>
                {pedido.fechaGestion
                  ? new Date(pedido.fechaGestion).toLocaleString()
                  : "-"}
              </TableCell>
              <TableCell>{pedido.observaciones}</TableCell>
              <TableCell className="text-center space-x-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => handleAction(pedido.id, "reintentar")}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-green-500 hover:text-green-700"
                  onClick={() => handleAction(pedido.id, "confirmar")}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleAction(pedido.id, "cancelar")}
                >
                  <Ban className="h-4 w-4" />
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </AnimatePresence>
      </TableBody>
    </Table>
  );

  const NoDataComponent: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-10 text-gray-500">
      <p>{message}</p>
    </div>
  );

  const confirmados = pedidos.filter((p) =>
    ["pendiente", "confirmado", "agendado", "entregado"].includes(p.estado)
  );
  const enGestion = pedidos.filter((p) => p.estado === "reintentar");
  const cancelados = pedidos.filter((p) => p.estado === "cancelado");

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="text-[#0A1C41]">Gestión de Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="confirmados">
              <FileCheck2 className="mr-2 h-4 w-4" />
              Pedidos Confirmados
            </TabsTrigger>
            <TabsTrigger value="gestion">
              <History className="mr-2 h-4 w-4" />
              En Gestión
            </TabsTrigger>
            <TabsTrigger value="cancelados">
              <XCircle className="mr-2 h-4 w-4" />
              Cancelados
            </TabsTrigger>
          </TabsList>
          <TabsContent value="confirmados" className="mt-4">
            {confirmados.length > 0 ? (
              renderTable(confirmados, true)
            ) : (
              <NoDataComponent message="No hay pedidos confirmados o en proceso." />
            )}
          </TabsContent>
          <TabsContent value="gestion" className="mt-4">
            {enGestion.length > 0 ? (
              renderGestionTable(enGestion)
            ) : (
              <NoDataComponent message="No hay pedidos para reintentar." />
            )}
          </TabsContent>
          <TabsContent value="cancelados" className="mt-4">
            {cancelados.length > 0 ? (
              renderTable(cancelados, false)
            ) : (
              <NoDataComponent message="No hay pedidos cancelados." />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PedidosPanel;
