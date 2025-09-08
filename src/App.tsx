//src/App.tsx
import { AuthGate } from "@/auth/components/AuthGate";
import { AuthLoginPage } from "@/auth/components/AuthLoginPage"; // si quieres ruta directa de login
import { Dashboard } from "@/components/Dashboard";
import { Route, Routes } from "react-router";

function App() {
  return (
    <Routes>
      {/* Ruta raíz: AuthGate decide si mostrar Login o Dashboard */}
      <Route path="/" element={<AuthGate />} />

      {/* Ruta de login manual (opcional) */}
      <Route path="/login" element={<AuthLoginPage />} />

      {/* Ruta protegida del dashboard (opcional si quieres forzar acceso directo) */}
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
