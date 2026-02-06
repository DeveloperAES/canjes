import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBranding } from "../../context/BrandingContext";
import { UserCircle, ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout, needsProfileUpdate } = useAuth();
  const { branding } = useBranding();


  // console.log(branding);
  const [open, setOpen] = useState(false);          // dropdown desktop
  const [mobileOpen, setMobileOpen] = useState(false); // sidebar mobile
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setOpen(false);
  };

  // cerrar dropdown al hacer click fuera (desktop)
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const navBase =
    "text-md px-3 uppercase py-1 rounded-full hover:bg-white/10 transition";

  const handleNavClick = (to) => {
    navigate(to);
    setMobileOpen(false); // cerrar sidebar en mobile al navegar
  };

  return (
    <>

      {
        !needsProfileUpdate ? (


          <header className="after-red-bar h-24 bg-[var(--color-primary)] text-white">
            <div className="container mx-auto px-3 flex items-center [&>*:not(:nth-child(3))]:py-4 justify-between md:px-0">
              {/* LEFT: Logo + Nombre */}
              <div className="flex items-center gap-3">
                {branding?.Logo && (
                  <img src={branding.Logo} alt="" className="main-logo" />
                )}

              </div>

              {/* CENTER: NAV (solo desktop) */}
              <nav className="hidden md:flex items-center gap-2">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `${navBase} ${isActive
                      ? "bg-white/20 font-semibold color-red"
                      : "text-black"
                    }`
                  }
                >
                  Inicio
                </NavLink>

                <NavLink
                  to="/como-funciona"
                  className={({ isActive }) =>
                    `${navBase} ${isActive
                      ? "bg-white/20 font-semibold color-red"
                      : "text-black"
                    }`
                  }
                >
                  ¿Cómo gano?
                </NavLink>

                <NavLink
                  to="/mis-puntos"
                  className={({ isActive }) =>
                    `${navBase} ${isActive
                      ? "bg-white/20 font-semibold color-red"
                      : "text-black"
                    }`
                  }
                >
                  Mis puntos
                </NavLink>

                <NavLink
                  to="/catalogo"
                  className={({ isActive }) =>
                    `${navBase} ${isActive
                      ? "bg-white/20 font-semibold color-red"
                      : "text-black"
                    }`
                  }
                >
                  CATÁLOGO
                </NavLink>
                <NavLink
                  to="/carrito"
                  className={({ isActive }) =>
                    `${navBase} ${isActive
                      ? "bg-white/20 font-semibold color-red"
                      : "text-black"
                    }`
                  }
                >
                  CARRITO
                </NavLink>

                <NavLink
                  to="/canjes"
                  className={({ isActive }) =>
                    `${navBase} ${isActive
                      ? "bg-white/20 font-semibold color-red"
                      : "text-black"
                    }`
                  }
                >
                  Canjes
                </NavLink>
              </nav>

              {/* RIGHT: Perfil (desktop) */}
              <div
                className="hidden h-full-fill md:flex relative bg-main"
                ref={dropdownRef}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(!open);
                  }}
                  className="flex items-center gap-2 justify-center p-4 rounded-full text-black"
                >
                  <UserCircle size={22} className="text-white" />
                  <ChevronDown size={22} className="text-white" />
                </button>

                {open && (
                  <div className="absolute z-20 top-11/12 right-0 mt-2 w-44 bg-white text-black rounded-lg shadow-xl border animate-fade-in">
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate("/mi-cuenta");
                      }}
                      className="flex justify-center items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Mi Cuenta
                    </button>

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Salir
                    </button>
                  </div>
                )}
              </div>

              {/* Botón menú (solo mobile) */}
              <div className="flex justify-center items-center md:hidden">
                <button onClick={() => setMobileOpen(true)}>
                  <Menu size={24} className="text-black" />
                </button>
              </div>
            </div>
          </header>
        ) : (

          <header className="after-red-bar h-24 bg-[var(--color-primary)] text-white">
            <div className="container mx-auto py-4 px-3 flex items-center justify-between md:px-0">
              <nav className="hidden md:flex justify-end w-full  items-center gap-2">
                <div
                  className="hidden md:flex w-fit relative rounded-full bg-main"
                  ref={dropdownRef}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(!open);
                    }}
                    className="flex items-center gap-2 justify-center p-4 rounded-full text-black hover:scale-105 transition"
                  >
                    <UserCircle size={22} className="text-white" />
                    <ChevronDown size={12} className="text-white" />
                  </button>

                  {open && (
                    <div className="absolute z-20 top-11/12 right-0 mt-2 w-44 bg-white text-black rounded-lg shadow-xl border animate-fade-in">
                      <button
                        onClick={() => {
                          setOpen(false);
                          navigate("/mi-cuenta");
                        }}
                        className="flex justify-center items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Mi Cuenta
                      </button>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                      >
                        Salir
                      </button>
                    </div>
                  )}
                </div>

              </nav>
            </div>


          </header>
        )
      }


      {/* SIDEBAR MOBILE */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay oscuro */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* Aside */}
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl flex flex-col">
            {/* Header del aside */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                {branding?.logo && (
                  <img src={branding.logo} alt="" className="h-8" />
                )}
                <span className="font-semibold text-gray-800">
                  {branding?.name || "Mi App"}
                </span>
              </div>
              <button onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Usuario */}
            {user && (
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-800">
                  {user.username || user.nombre || user.email}
                </p>
              </div>
            )}

            {/* Links navegación */}
            <nav className="flex flex-col px-2 py-3 gap-1 text-sm">
              <button
                onClick={() => handleNavClick("/bienvenido")}
                className="text-left px-3 py-2 rounded-md hover:bg-gray-100"
              >
                Inicio
              </button>
              <button
                onClick={() => handleNavClick("/promociones")}
                className="text-left px-3 py-2 rounded-md hover:bg-gray-100"
              >
                Promociones
              </button>
              <button
                onClick={() => handleNavClick("/canjes")}
                className="text-left px-3 py-2 rounded-md hover:bg-gray-100"
              >
                Canjes
              </button>

              <hr className="my-2" />

              <button
                onClick={() => handleNavClick("/mi-cuenta")}
                className="text-left px-3 py-2 rounded-md hover:bg-gray-100"
              >
                Mi Cuenta
              </button>
              <button
                onClick={handleLogout}
                className="text-left px-3 py-2 rounded-md text-red-600 hover:bg-gray-100"
              >
                Salir
              </button>
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
