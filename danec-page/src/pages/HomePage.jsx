// src/pages/HomePage.jsx
import { CircleArrowRight } from "lucide-react";
import { useBranding } from "../context/BrandingContext";
import { getUserPointsApi } from "../api/userApi";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { useEffect, useState } from "react";
import TablePuntos from "../components/ui/TablePuntos";

import PointsCards from "../components/ui/PointsCards";

export default function HomePage() {
  const { branding } = useBranding();
  const banners = branding?.Banners ?? [];

  const [pointsData, setPointsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUserPointsApi();
        if (mounted) setPointsData(data);
      } catch (e) {
        console.error(e);
        if (mounted) setError("No se pudieron cargar los puntos.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="w-full flex flex-col gap-6 md:gap-12 p-4 md:py-12 md:px-28">
      {/* Tarjetas de Puntos y Saludo */}
      <PointsCards loading={loading} error={error} data={pointsData} />

      {/* Carrusel (Banner) */}
      <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm">
        <Splide
          hasTrack={false}
          aria-label="Carrusel de banners"
          options={{
            type: "loop",
            autoplay: true,
            interval: 3000,
            pauseOnHover: true,
            arrows: true,
            pagination: true,
            gap: "1rem",
          }}
        >
          <SplideTrack className="w-full h-full">
            {banners.map((banner) => (
              <SplideSlide key={banner.Id}>
                <img
                  src={banner.Src}
                  alt={banner.Alt}
                  className="w-full h-auto object-cover rounded-2xl"
                />
              </SplideSlide>
            ))}
          </SplideTrack>

          <div className="splide__arrows">
            <button className="splide__arrow splide__arrow--prev">
              <CircleArrowRight size={35} className="text-white" />
            </button>
            <button className="splide__arrow splide__arrow--next">
              <CircleArrowRight size={35} className="text-white" />
            </button>
          </div>
        </Splide>
      </div>

       {/* Tabla visual */}
      {/* <TablePuntos loading={loading} error={error} data={pointsData} /> */}
    </section>
  );
}
