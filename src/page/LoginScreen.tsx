import { LoginForm } from "@/auth/components/LoginForm";
import { useLoginMutation } from "@/hooks/useAuth";
import type { AuthSuccessResponse } from "@/auth/interfaces/authResponse";

interface LoginScreenProps {
    onLogin: (user: AuthSuccessResponse) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
    const loginMutation = useLoginMutation();

    const handleSubmit = (user: string, pass: string) => {
        loginMutation.mutate(
            { idusers: user, password: pass },
            {
                onSuccess: (data) => {
                    onLogin(data);
                },
            }
        );
    };

    return (
        <LoginForm
            onLogin={handleSubmit}
            isLoading={loginMutation.isPending}
            error={loginMutation.isError ? loginMutation.error.message : null}
        />
    );
}
