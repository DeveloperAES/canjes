// src/pages/auth/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../context/ModalContext";
import AuthLayout from "../../components/layout/AuthLayout";
import logoHome from "../../assets/logo-home.png";
import { Eye, EyeOff } from 'lucide-react';
import logo from "../../assets/logo-white.png";

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.username, form.password);
    if (ok) {
      navigate("/bienvenido");
    } else {
      showModal({
        type: 'error',
        title: 'Error de acceso',
        message: 'Credenciales inválidas o usuario no encontrado'
      });
    }
  };

  return (
    <AuthLayout>
      <div className="w-full h-full flex flex-col items-center lg:items-end lg:w-full px-4 lg:px-6 max-w-lg mx-auto lg:mx-0 justify-center lg:justify-end overflow-hidden">

        {/* Logo superior - Ajuste proporcional */}
        <div className="w-full flex justify-center mb-4 transition-all duration-300">
          <img
            src={logo}
            alt="Programa Experto Danec"
            className="w-[200px] md:w-[260px] lg:w-[320px] object-contain max-h-[15vh] lg:max-h-[20vh]"
          />
        </div>

        {/* Cuadro Blanco de Login */}
        <div className="w-full bg-white p-3 md:p-6 lg:p-10 rounded-4xl rounded-b-none shadow-2xl flex flex-col gap-4 lg:gap-6 max-h-[75vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#f70030] text-center mb-1 tracking-tight leading-tight">
            ¡Bienvenido!
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:gap-6">
            {/* Usuario */}
            <div className="flex flex-col gap-1 text-left">
              <label htmlFor="username" className="text-gray-600 font-semibold text-xs md:text-sm ml-1">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={form.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-50 transition-all placeholder:text-gray-400 text-sm md:text-base"
              />
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1 text-left relative">
              <label htmlFor="password" className="text-gray-600 font-semibold text-xs md:text-sm ml-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 md:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-50 transition-all placeholder:text-gray-400 text-sm md:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* {error && (
              <p className="text-red-500 text-xs text-center font-medium -mt-2">{error}</p>
            )} */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f70030] text-white py-3 lg:py-3.5 rounded-full text-lg md:text-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all mt-1"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="flex flex-col items-center mt-2 lg:mt-4">
            <a href="#" className="text-gray-800 font-bold hover:text-black text-xs md:text-sm mb-6 lg:mb-10">
              ¿Olvidaste tu contraseña?
            </a>

            <a
              className="cursor-pointer flex items-center gap-2"
              target="_blank"
              href="https://grupodanec.com.ec/danec-linea-experto/"
            >
              <span className="text-[9px] md:text-[10px] uppercase tracking-wider text-gray-800 font-bold">volver a</span>
              <img src={logoHome} alt="Danec Línea Experto" className="h-8 md:h-10 lg:h-12 object-contain" />
            </a>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
