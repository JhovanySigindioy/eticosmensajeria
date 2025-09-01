// src/components/ui/LoadingOverlay.tsx
"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
  show: boolean;
}

export function LoadingOverlay({ message = "Cargando...", show }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-4 bg-white/10 p-6 rounded-2xl shadow-xl border border-white/20"
      >
        <Loader2 className="h-10 w-10 animate-spin text-white" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-white font-semibold"
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
}
