// src/components/EntregasPendientesPanel.tsx
import { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { History, Package, Search } from "lucide-react";
import { useEntregasPendientesStore } from "@/store/useEntregasPendientesStore";
import { EntregaCard } from "./EntregaCard";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";

export function HistoryPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const { entregas } = useEntregasPendientesStore();

  // 🔎 Filtrar entregas por buscador
  const filteredEntregas = useMemo(() => {
    if (!searchTerm.trim()) return entregas;
    const lower = searchTerm.toLowerCase();

    return entregas.filter((e: SavedEntregaRes) =>
      (e.registeredTypeNumber ?? "").toLowerCase().includes(lower) ||
      (e.patientName ?? "").toLowerCase().includes(lower) ||
      (e.address ?? "").toLowerCase().includes(lower) ||
      String(e.primaryPhone ?? "").toLowerCase().includes(lower)
    );
  }, [searchTerm, entregas]);


  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-[#0A1C41] flex items-center gap-2">
            <History className="h-4 w-4 text-[#0082FF]" />
            Historial de Gestión
          </CardTitle>
        </CardHeader>
        {/* <CardContent>
      
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por radicado, paciente, dirección o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent> */}
      </Card>

      {/* 📋 Listado de entregas */}
      <AnimatePresence>
        {filteredEntregas.length > 0 ? (
          <div className="space-y-3 border-gray-200 px-5 py-1 overflow-y-auto h-[650px] rounded-md scroll-hidden">
            {filteredEntregas.map((e: SavedEntregaRes) => (
              <EntregaCard key={e.managementId} entrega={e} />
            ))}
          </div>


        ) : (
          <div className="flex flex-col gap-2 mt-10">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-center text-gray-500">
              No se encontraron entregas pendientes...
            </p>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
