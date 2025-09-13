// src/pages/AuthLoginPage.tsx
import { AuthLoginForm } from "./AuthLoginForm";
import { useLoginMutation } from "../hooks/useLoginMutation";
import { useAuth } from "../hooks/useAuth";
import { getContractService } from "@/api/contract.service";
import type { AuthSuccessResponse } from "@/auth/interfaces/authResponse";

export function AuthLoginPage() {
    const loginMutation = useLoginMutation();
    const { login } = useAuth();

    const handleSubmit = (idUsers: string, password: string) => {
        loginMutation.mutate(
            { idUsers, password },
            {
                onSuccess: async (data: AuthSuccessResponse) => {
                    if (data?.tokenjwt) {
                        try {
                            const contractData = await getContractService(
                                data.nit,
                                data.iduser,
                                data.tokenjwt
                            );

                            login(data, contractData);
                        } catch (error) {
                            console.error("❌ Error cargando contrato:", error);
                        }
                    } else {
                        console.error("⚠️ La respuesta de la API no contiene un token JWT.");
                    }
                },
            }
        );
    };

    return (
        <AuthLoginForm
            onLogin={handleSubmit}
            isLoading={loginMutation.isPending}
            error={loginMutation.isError ? loginMutation.error.message : null}
        />
    );
}
