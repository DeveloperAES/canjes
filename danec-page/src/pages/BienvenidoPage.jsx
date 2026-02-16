import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBranding } from "../context/BrandingContext";
import { ButtonNavigate } from "../components/ui/buttons/ButtonNavigation";

export default function BienvenidoPage() {
  const { profile, needsProfileUpdate } = useAuth();
  const navigate = useNavigate();
  const info = profile?.ExtraInfo;


  const { branding } = useBranding();

  const bgWelcome = branding.bannerWelcome;

  // Si no necesita actualizar perfil, redirigir al inicio
  useEffect(() => {
    if (needsProfileUpdate === false) {
      navigate("/", { replace: true });
    }
  }, [needsProfileUpdate, navigate]);

  return (
    <section className="h-screen relative">
      <span className="absolute w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: bgWelcome ? `url(${bgWelcome})` : "none",
        }}
      ></span>

      {/* Contenido encima */}
      <div className="h-full container mx-auto flex items-center justify-end relative px-6">
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center">

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#f70030] mb-2">
            ¡Hola, {info?.name || "usuario"}!
          </h1>

          <h2 className="text-3xl md:text-5xl font-bold mt-8 text-black mb-10 tracking-tight uppercase">
            "DANEC"
          </h2>

          <p className="text-lg md:text-xl text-gray-800 font-medium mb-10">
            Ayúdanos a completar tus datos
          </p>

          <ButtonNavigate
            linkPage="/mi-cuenta"
            text="CONTINUAR"
            className="rounded-full px-12 py-3 text-2xl bg-[#f70030]"
          />
        </div>
      </div>
    </section>
  );
}

