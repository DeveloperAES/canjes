import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useBranding } from "../../context/BrandingContext";
import logoHome from "../../assets/logo-home.png";

export default function MainLayout() {
  const { branding } = useBranding();
  const location = useLocation();

  const NO_NAV = ["/bienvenido", "/mi-cuenta"];

  // No mostramos el Navbar en la página de bienvenida
  const showNavbar = !NO_NAV.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col relative">
      {showNavbar && <Navbar />}

      <main className="flex-1 overflow-hidden bg-[var(--color-background,#fff)] text-[var(--color-text,#111827)]">
        {/* Aquí se cargan las páginas internas */}
        <Outlet />
      </main>

      {/* Floating Back Link */}
      {showNavbar && (
        <a
          className="fixed bottom-8 right-8 z-50 cursor-pointer flex flex-col items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
          href="https://grupodanec.com.ec/danec-linea-experto/"
        >
          <span className="text-[10px] md:text-[11px] uppercase tracking-wider text-gray-600 font-bold">
            volver a
          </span>
          <div className="bg-white rounded-full shadow-md">
             <img
                src={logoHome}
                alt="Danec Línea Experto"
                className="h-10 md:h-12 object-contain"
            />
          </div>
        </a>
      )}
    </div>
  );
}
