// src/components/EditInfoPatientModal.tsx
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
import type { EntregaRequest } from "@/types/EntregaRequest.types";
import { usePatient } from "@/hooks/usePatient";
import { useAuth } from "@/auth/hooks/useAuth";
import { ConfirmActionModal } from "./confirmActionModal";
import type { Address } from "@/interfaces/address";
import { formatAddress } from "@/utils/formatAddress";

interface Props {
    formData: EntregaRequest;
    setFormData: React.Dispatch<React.SetStateAction<EntregaRequest>>;
}

export function EditInfoPatientModal({ formData, setFormData }: Props) {
    const [modalState, setModalState] = useState<"confirm" | "loading" | "success" | "error">("confirm");
    const [modalOpen, setModalOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const { token } = useAuth();
    const { mutateAsync: updatePatient } = usePatient(token || "");

    // 🔄 separar los teléfonos si vienen juntos en primaryPhone
    const phones = formData.primaryPhone
        ? formData.primaryPhone.split(",").map((p) => p.trim())
        : [];

    const [tempData, setTempData] = useState({
        identification: formData.identification,
        patientName: formData.patientName,
        primaryPhone: phones[0] || "",
        secondaryPhone: phones[1] || formData.secondaryPhone || "",
        email: formData.email ?? "",
    });

    const [addressObj, setAddressObj] = useState<Address>({
        tipoVia: "",
        numeroVia: "",
        complementoVia: "",
        barrio: "",
        detallesAdicionales: "",
        municipio: "",
        departamento: "",
    });

    const handleSave = () => {
        const formattedAddress = formatAddress(addressObj);

        setOpen(false);
        setModalState("loading");
        setModalOpen(true);

        const payload: Record<string, unknown> = {
            identification: tempData.identification,
        };

        if (tempData.patientName && tempData.patientName.trim() !== "") {
            payload.namePatient = tempData.patientName;
        }
        if (tempData.primaryPhone && tempData.primaryPhone.trim() !== "") {
            payload.primaryPhone = tempData.primaryPhone;
        }
        if (tempData.secondaryPhone && tempData.secondaryPhone.trim() !== "") {
            payload.secondaryPhone = tempData.secondaryPhone;
        }
        if (tempData.email && tempData.email.trim() !== "") {
            payload.email = tempData.email;
        }
        if (formattedAddress && formattedAddress.trim() !== "") {
            payload.address = formattedAddress;
        }

        updatePatient(payload, {
            onSuccess: () => {
                setFormData({
                    ...formData,
                    ...tempData,
                    address: formattedAddress || formData.address,
                });
                setModalState("success");
            },
            onError: () => {
                setModalState("error");
            },
        });
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="bg-[#0082FF] text-white hover:bg-[#005cbf]"
                >
                    Editar Datos Paciente
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Actualizar datos del paciente</DialogTitle>
                    <DialogDescription>
                        Aquí puedes modificar la información de contacto del paciente.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 py-4">
                    {/* Identificación */}
                    <div>
                        <label htmlFor="identification" className="text-sm font-medium">
                            Identificación
                        </label>
                        <Input id="identification" className="bg-blue-300/10 border-blue-500/10" value={tempData.identification} readOnly />
                    </div>

                    {/* Nombre */}
                    <div>
                        <label htmlFor="patientName" className="text-sm font-medium">
                            Nombre del Paciente
                        </label>
                        <Input
                            id="patientName"
                            className="bg-blue-300/10 border-blue-500/10"
                            value={tempData.patientName} readOnly
                           
                        />
                    </div>

                    {/* Teléfono principal */}
                    <div>
                        <label htmlFor="primaryPhone" className="text-sm font-medium">
                            Teléfono principal
                        </label>
                        <Input
                            id="primaryPhone"
                            value={tempData.primaryPhone}
                            onChange={(e) =>
                                setTempData((prev) => ({ ...prev, primaryPhone: e.target.value }))
                            }
                        />
                    </div>

                    {/* Teléfono secundario */}
                    <div>
                        <label htmlFor="secondaryPhone" className="text-sm font-medium">
                            Teléfono secundario
                        </label>
                        <Input
                            id="secondaryPhone"
                            value={tempData.secondaryPhone}
                            onChange={(e) =>
                                setTempData((prev) => ({ ...prev, secondaryPhone: e.target.value }))
                            }
                        />
                    </div>

                    {/* Correo */}
                    <div>
                        <label htmlFor="email" className="text-sm font-medium">
                            Correo
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={tempData.email}
                            onChange={(e) =>
                                setTempData((prev) => ({ ...prev, email: e.target.value }))
                            }
                        />
                    </div>

                    {/* Dirección nueva */}
                    <div className="col-span-2">
                        <AddressForm value={addressObj} onChange={setAddressObj} />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={() => {
                            setModalOpen(true);
                            setModalState("confirm");
                        }}
                        className="bg-[#0082FF] text-white hover:bg-[#152a61]"
                    >
                        Guardar cambios
                    </Button>
                </DialogFooter>
            </DialogContent>

            {/* Modal de confirmación */}
            <ConfirmActionModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={handleSave}
                state={modalState}
            />
        </Dialog>
    );
}
