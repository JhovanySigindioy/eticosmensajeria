import { AuthLoginForm } from "./AuthLoginForm";
import { useLoginMutation } from "../hooks/useLoginMutation";
import { useAuth } from "../hooks/useAuth";

export function AuthLoginPage() {
    const loginMutation = useLoginMutation();
    const { login } = useAuth();

    const handleSubmit = (idusers: string, password: string) => {
        loginMutation.mutate(
            { idusers, password },
            {
                onSuccess: (data) => {
                    login(data); // Guarda usuario + token en Zustand
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
