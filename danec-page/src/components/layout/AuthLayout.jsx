
import fondo from "../../assets/login-bg.png";
import { useBranding } from "../../context/BrandingContext";

export default function AuthLayout({ children }) {
  const { branding } = useBranding();


  return (
    <div
      className="min-h-screen p-4 pb-0 flex items-end justify-end bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${fondo})`, backgroundColor: "var(--color-background, #f3f4f6)" }}
    >
      <div className="p-0 w-full flex justify-end md:p-4 md:pb-0">{children}</div>
    </div>
  );
}
