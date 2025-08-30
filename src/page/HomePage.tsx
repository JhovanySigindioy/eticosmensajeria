import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Dashboard from "@/components/Dashboard";
import { LoginScreen } from "./LoginScreen";
import type { AuthSuccessResponse } from "@/auth/interfaces/authResponse";

function HomePage() {
    const [regente, setRegente] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const storedRegente = localStorage.getItem("regente-domicilios");
        if (storedRegente) {
            setRegente(storedRegente);
        }
    }, []);

    const handleLogin = (user: AuthSuccessResponse) => {
        if (user.name.trim()) {
            localStorage.setItem("regente-domicilios", user.name.trim());
            setRegente(user.name.trim());
            toast({
                title: `¡Bienvenido, ${user.name.trim()}!`,
                description: "Listo para gestionar los domicilios.",
            });
        } else {
            toast({
                title: "Error",
                description: "No se recibió un nombre válido.",
                variant: "destructive",
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("regente-domicilios");
        setRegente(null);
        toast({
            title: "Sesión cerrada",
            description: "Has salido del sistema de gestión.",
        });
    };

    return (
        <>
            <Helmet>
                <title>Gestión de Domicilios</title>
                <meta
                    name="description"
                    content="Interfaz moderna para la gestión de domicilios de medicamentos."
                />
                <meta property="og:title" content="Gestión de Domicilios" />
                <meta
                    property="og:description"
                    content="Interfaz moderna para la gestión de domicilios de medicamentos."
                />
            </Helmet>

            <AnimatePresence mode="wait">
                {!regente ? (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <LoginScreen onLogin={handleLogin} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Dashboard regente={regente} onLogout={handleLogout} />
                    </motion.div>
                )}
            </AnimatePresence>
            <Toaster />
        </>
    );
}

export default HomePage;
