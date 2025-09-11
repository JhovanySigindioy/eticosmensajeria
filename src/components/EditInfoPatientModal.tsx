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
import type { Address } from "@/interfaces/address";
import { formatAddress } from "@/utils/formatAddress";
import { ConfirmActionModal } from "./confirmActionModal";
import { set } from "zod";

interface Props {
    formData: EntregaRequest;
    setFormData: React.Dispatch<React.SetStateAction<EntregaRequest>>;
}

export function EditInfoPatientModal({ formData, setFormData }: Props) {
    const [modalState, setModalState] = useState<"confirm" | "loading" | "success" | "error">("confirm");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState<string>("");
    const [modalMessage, setModalMessage] = useState<string>("");

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
        numeroPrincipal: "",
        numeroSecundario: "",
        numeroFinal: "",
        barrio: "",
        detallesAdicionales: "",
        municipio: "",
        departamento: ""
    });

    const handleSave = () => {
        const formattedAddress = formatAddress(addressObj);

        setModalState("loading");
        setModalTitle("Guardando cambios...");
        setModalMessage("Estamos actualizando la información del paciente.");
        setModalOpen(true);

        const payload: Record<string, unknown> = {
            identification: tempData.identification,
        };

        if (tempData.patientName?.trim()) payload.namePatient = tempData.patientName;
        if (tempData.primaryPhone?.trim()) payload.primaryPhone = tempData.primaryPhone;
        if (tempData.secondaryPhone?.trim()) payload.secondaryPhone = tempData.secondaryPhone;
        if (tempData.email?.trim()) payload.email = tempData.email;


        const addressToSave = formattedAddress?.trim() ? formattedAddress : formData.address;
        if (addressToSave) {
            payload.address = addressToSave;
        }

        updatePatient(payload, {
            onSuccess: () => {
                setFormData({
                    ...formData,
                    ...tempData,
                    address: addressToSave,
                });
                setModalState("success");
                setModalTitle("¡Datos actualizados!");
                setModalMessage("La información del paciente se guardó correctamente.");
                setOpen(false);
            },
            onError: () => {
                setModalState("error");
                setModalTitle("Error al guardar");
                setModalMessage("No fue posible actualizar la información. Intenta de nuevo.");
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
                        <Input
                            id="identification"
                            className="bg-blue-300/10 border-blue-500/10"
                            value={tempData.identification}
                            readOnly
                        />
                    </div>

                    {/* Nombre */}
                    <div>
                        <label htmlFor="patientName" className="text-sm font-medium">
                            Nombre del Paciente
                        </label>
                        <Input
                            id="patientName"
                            className="bg-blue-300/10 border-blue-500/10"
                            value={tempData.patientName}
                            readOnly
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

                    {/* Dirección actual */}
                    <div>
                        <label htmlFor="addressold" className="text-sm font-medium">
                            Dirección Actual
                        </label>
                        <Input
                            id="addressold"
                            type="text"
                            value={formData.address || ""}
                            readOnly
                            className="bg-blue-300/10 border-blue-500/10"
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
                            setModalTitle("¿Confirmar actualización?");
                            setModalMessage("Se guardarán los cambios en la información del paciente.");
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
                title={modalTitle}
                message={modalMessage}
            />
        </Dialog>
    );
}
