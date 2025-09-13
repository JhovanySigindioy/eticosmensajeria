// src/components/FormLayout.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare, Package, Truck } from "lucide-react";
import { useState } from "react";
import { TransferForm } from "./TransfermForm";


interface FormLayoutProps {
    children: React.ReactNode;
}

export function LayoutForm({ children }: FormLayoutProps) {
    const [active, setActive] = useState<"entregas" | "traslados">("entregas");

    return (
        <Card className="shadow-lg border border-t-4 border-[#0082FF]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[#0A1C41] flex items-center font-semibold text-base">
                    <MessageSquare className="mr-2 text-[#0082FF]" />
                    {active === "entregas"
                        ? "Gestión Entregas Pendientes"
                        : "Gestión Traslados"}
                </CardTitle>

                {/* Switch Tabs */}
                <div className="flex rounded-md overflow-hidden border border-gray-200">
                    <button
                        role="tab"
                        aria-pressed={active === "entregas"}
                        onClick={() => setActive("entregas")}
                        className={`flex items-center gap-1 px-3 py-1 text-sm font-medium transition-colors
              ${active === "entregas"
                                ? "bg-[#0082FF] text-white shadow"
                                : "text-[#0A1C41] hover:bg-[#0082FF]/10"}`}
                    >
                        <Truck className="w-4 h-4" />
                        Entregas
                    </button>

                    <button
                        role="tab"
                        aria-pressed={active === "traslados"}
                        onClick={() => setActive("traslados")}
                        className={`flex items-center gap-1 px-3 py-1 text-sm font-medium transition-colors
              ${active === "traslados"
                                ? "bg-[#0082FF] text-white shadow"
                                : "text-[#0A1C41] hover:bg-[#0082FF]/10"}`}
                    >
                        <Package className="h-4 w-4" />
                        Traslados
                    </button>
                </div>
            </CardHeader>

            <CardContent>
                {active === "entregas" && children}

                {active === "traslados" && (

                    <TransferForm origen={{ codigo: "1234", nombre: "Farmacia Central", direccion: "Carrera 45 # 10 - 20, Bogotá" }} />

                )}
            </CardContent>
        </Card>
    );
}
