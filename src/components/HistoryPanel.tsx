// src/components/EntregasPendientesPanel.tsx
import { useState, useMemo, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, History, Loader2, Package, RefreshCcw, RefreshCcwDot, RefreshCcwDotIcon, RefreshCcwIcon } from "lucide-react";
import { useEntregasPendientesStore } from "@/store/useEntregasPendientesStore";
import { EntregaCard } from "./EntregaCard";
import type { SavedEntregaRes } from "@/interfaces/entregaResponse";
import { useAuthStore } from "@/auth/store/auth.store"; // 👈 para obtener token
import { useEntrega } from "@/hooks/useEntrega";
import { Button } from "./ui/button";

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
          <CardTitle className="text-[#0A1C41]  flex items-center justify-between gap-2">
            <div className="flex gap-2">
              <History className="h-4 w-4 text-[#0082FF]" />
              Historial de Gestión
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  alert("Coming soon");
                }}
                className="border border-[#005cbf] text-[#005cbf] bg- hover:bg-[#005cbf] hover:text-white"
              >
                INSUMOS <Download />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>


      {/* 📋 Listado de entregas */}
      <AnimatePresence>
        {isLoading ? (
          <div className="flex flex-col gap-2 mt-10 mx-auto">
            <Loader2 className="h-8 w-8 animate-spin text-[#0082FF] mx-auto" />
            <p className="mt-2 text-sm text-[#0A1C41] font-semibold">
              Cargando entregas...
            </p>
          </div>

        ) : isError ? (
          <div className="flex flex-col gap-2  mx-auto w-full">
            <p className="text-center text-red-500 mt-5 p-2 bg-red-50 rounded-md border border-red-200 font-semibold text-[14px] flex items-center gap-4 justify-center" >
              Error al cargar las entregas.
              <button onClick={() => refetch()} >
                <RefreshCcwIcon className="h-5 w-5 text-red-500 hover:text-red-700 border border-red-500 rounded p" />
              </button>
            </p>

          </div>
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
