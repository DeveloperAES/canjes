import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useBranding } from "../../context/BrandingContext";

export default function MainLayout() {
  const { branding } = useBranding();
  const location = useLocation();

  // No mostramos el Navbar en la página de bienvenida
  const showNavbar = location.pathname !== "/bienvenido";

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}

      <main className="flex-1 overflow-hidden bg-[var(--color-background,#fff)] text-[var(--color-text,#111827)]">
        {/* Aquí se cargan las páginas internas */}
        <Outlet />
      </main>
    </div>
  );
}
