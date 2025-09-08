import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "../hooks/useAuth";
import { AuthLoginPage } from "./AuthLoginPage";
import { Dashboard } from "@/components/Dashboard";
import { LoadingOverlay } from "@/components/ui/LoadingOverlay";

export function AuthGate() {
    const { user } = useAuth();
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
    }, []);


    if (!hydrated) {
        return <LoadingOverlay show={true} message="Verificando sesión..." />;
    }

    return (
        <>
            <AnimatePresence mode="wait">
                {!user ? (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <AuthLoginPage />
                    </motion.div>
                ) : (
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Dashboard />
                    </motion.div>
                )}
            </AnimatePresence>
            <Toaster />
        </>
    );
}
