import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AddressForm from "./AddressForm";

export function EditarPacienteModal({ formData, setFormData }: any) {
    const [tempData, setTempData] = useState(formData);

    const handleSave = () => {
        setFormData((prev: any) => ({
            ...prev,
            ...tempData,
        }));
    };

    return (
        <Dialog>
            {/* Botón que abre el modal */}
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="bg-[#0082FF] text-white hover:bg-[#005cbf]"
                >
                    Editar Datos Paciente
                </Button>
            </DialogTrigger>

            {/* Contenido del modal */}
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Actualizar datos del paciente</DialogTitle>
                    <DialogDescription>
                        Aquí puedes modificar la información de contacto del paciente.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label htmlFor="paciente" className="text-sm font-medium">
                            Nombre del Paciente
                        </label>
                        <Input
                            id="paciente"
                            value={tempData.paciente}
                            onChange={(e) =>
                                setTempData({ ...tempData, paciente: e.target.value })
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="telefono" className="text-sm font-medium">
                            Teléfono
                        </label>
                        <Input
                            id="telefono"
                            value={tempData.telefono}
                            onChange={(e) =>
                                setTempData({ ...tempData, telefono: e.target.value })
                            }
                        />
                    </div>
                    <AddressForm />
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSave}
                        className="bg-[#0A1C41] text-white hover:bg-[#152a61]"
                    >
                        Guardar cambios
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
