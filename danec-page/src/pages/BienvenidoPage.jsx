
import { useAuth } from "../context/AuthContext";
import { useBranding } from "../context/BrandingContext";
import { ButtonNavigate } from "../components/ui/buttons/ButtonNavigation";




export default function BienvenidoPage() {
  const { user, profile } = useAuth();
  const info = profile?.ExtraInfo;
  // console.log("ver info", info);

  const { branding } = useBranding();
  console.log("ver branding", branding);


  const bgWelcome = branding.bannerWelcome;
  // console.log("ver branding", bgWelcome);

  return (
    <section
      className="h-[calc(100vh-96px)]  relative"
    >

      <span className="absolute w-full h-full  bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: bgWelcome ? `url(${bgWelcome})` : "none",
        }}
      >

      </span>
      {/* Contenido encima */}
      <div className="h-full container mx-auto flex  items-center justify-end relative z-[2]">
        <div className="w-1/2 flex  flex-col justify-center items-center">
          <p className="text-7xl uppercase font-bold py-8 mt-16">¡Hola!</p>

          {info?.name ? (
            <p className="text-4xl text-center uppercase pt-5 pb-2">
              {info.name}
            </p>
          ) : (
            <p className="text-4xl text-center uppercase pt-5 pb-2">
              Usuario Danec
            </p>
          )}

          <p className="text-xl uppercase font-bold py-2">"Danec"</p>

          {/* <button
            onClick={() => navigate("/mi-cuenta")}
            className="px-4 py-2 bg-main rounded-2xl text-white w-fit text-xl font-[700]"
          >
            CONTINUAR
          </button> */}
          <ButtonNavigate linkPage="/mi-cuenta" text="CONTINUAR" />


        </div>


      </div>
    </section>
  );
}

