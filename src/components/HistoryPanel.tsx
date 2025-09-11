// src/components/EntregasPendientesPanel.tsx
import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Loader2, Package } from "lucide-react";
import { useEntregasPendientesStore } from "@/store/useEntregasPendientesStore";
import { EntregaCard } from "./EntregaCard";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";
import { useAuthStore } from "@/auth/store/auth.store"; // 👈 para obtener token
import { useEntrega } from "@/hooks/useEntrega";

export function HistoryPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const { entregas, setEntregas } = useEntregasPendientesStore();

  const { token } = useAuthStore();
  const { refetch, isLoading, isError, data } = useEntrega(token || "");

  // 🔄 traer las entregas al montar el componente
  useEffect(() => {
    if (token) {
      refetch().then((res: any) => {
        if (res.data?.success && res.data.data) {
          setEntregas(res.data.data as SavedEntregaRes[]);
        }
      });
    }
  }, [token, refetch, setEntregas]);

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
      </Card>


      {/* 📋 Listado de entregas */}
      <AnimatePresence>
        {isLoading ? (
          <div className="flex flex-col gap-2 mt-10">
            <Loader2 className="h-8 w-8 animate-spin text-[#0082FF]" />
            <p className="mt-2 text-sm text-[#0A1C41] font-semibold">
              Cargando entregas...
            </p>
          </div>

        ) : isError ? (
          <p className="text-center text-red-500 mt-5 p-4 bg-red-200 rounded-md">
            Error al cargar las entregas.
          </p>
        ) : filteredEntregas.length > 0 ? (
          <div className="space-y-3 border-gray-200 px-5 py-1 overflow-y-auto rounded-md scroll-hidden h-[71vh]">
            {filteredEntregas.map((e: SavedEntregaRes) => (
              <EntregaCard key={e.managementId} entrega={e} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-10">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-center text-gray-500">
              No se encontraron entregas...
            </p>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
