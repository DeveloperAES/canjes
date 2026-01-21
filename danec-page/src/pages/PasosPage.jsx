import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { useBranding } from "../context/BrandingContext";
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useRef, useState, useEffect } from "react";

export default function PasosPage() {
    const { branding } = useBranding();
    const rawBanners = branding?.caruselSteps || [];
    const splideRef = useRef(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [zoom, setZoom] = useState(100);

    // Detect mobile for conditional spacer
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Create a new array with a spacer at the beginning for Desktop "Book View"
    const displayBanners = isMobile
        ? rawBanners
        : [{ Id: 'spacer', _isSpacer: true }, ...rawBanners];

    const handleMove = (splide, newIndex) => {
        setActiveIndex(newIndex);
    };

    const handlePrev = () => {
        splideRef.current?.splide?.go('<');
    };

    const handleNext = () => {
        splideRef.current?.splide?.go('>');
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 10, 150));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 10, 50));
    };

    // Calculate display numbers
    // Desktop: Index 0 is [Spacer, P1]. Index 2 is [P2, P3].
    // Mobile: Index 0 is [P1]. Index 1 is [P2].
    const currentDisplay = isMobile 
        ? `${activeIndex + 1}`
        : `${activeIndex === 0 ? 1 : activeIndex}-${Math.min(activeIndex + 1, rawBanners.length)}`;

    return (
        <section className="w-full h-full min-h-[calc(100vh-96px)] flex flex-col justify-center items-center bg-[#f0f0f0] relative overflow-hidden">
            
            {/* Area de visualización con Zoom */}
            <div 
                className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
                style={{ transform: `scale(${zoom / 100})` }}
            >
                <Splide
                    ref={splideRef}
                    hasTrack={false}
                    onMove={handleMove}
                    options={{
                        pagination: false,
                        arrows: false,
                        perPage: 2,
                        perMove: 2, // Move 2 pages at a time for book feel
                        gap: "0rem", // No gap for book spread
                        focus: 0, // Left align
                        trimSpace: false, // Allow empty space at end if odd
                        breakpoints: {
                            640: { 
                                perPage: 1,
                                perMove: 1,
                                gap: "1rem",
                                padding: "1rem"
                            }
                        }
                    }}
                    className="w-full max-w-7xl px-4"
                >
                    <SplideTrack className="py-8">
                        {displayBanners.map((banner, index) => {
                            if (banner._isSpacer) {
                                return (
                                    <SplideSlide key="spacer">
                                        <div className="h-[70vh] w-full" />
                                    </SplideSlide>
                                );
                            }
                            return (
                                <SplideSlide key={banner.Id || index}>
                                    <div className="flex justify-center items-center h-[70vh] shadow-xl bg-white overflow-hidden transition-all duration-300">
                                        <img 
                                            src={banner.Src} 
                                            alt={banner.Alt} 
                                            className="w-full h-full object-contain" 
                                        />
                                    </div>
                                </SplideSlide>
                            );
                        })}
                    </SplideTrack>
                </Splide>
            </div>

            {/* Barra de Controles Flotante */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#6c757d] text-white rounded-full flex items-center z-50 px-7 py-2 gap-2">
                
                {/* Contador */}
                <span className="text-sm h-full-fill content-center font-medium pr-3 border-r border-white whitespace-nowrap">
                    {currentDisplay} / {rawBanners.length}
                </span>

                {/* Zoom */}
                <div className="flex items-center content-center h-full-fill border-r border-white px-2 gap-2">
                    <button 
                         onClick={handleZoomIn}
                         className="p-1 hover:text-white disabled:opacity-50 scale-75"
                         disabled={zoom >= 150}
                    >
                        <Plus size={16} />
                    </button>
                    <span className="text-xs w-[4ch] text-center bg-[#282828] flex justify-center py-1 px-6">{zoom}%</span>
                    <button 
                         onClick={handleZoomOut}
                         className="p-1 hover:text-white disabled:opacity-50 scale-75"
                         disabled={zoom <= 50}
                    >
                        <Minus size={16} />
                    </button>
                </div>

                {/* Navegación */}
                <div className="flex items-center gap-2.5 pl-1 [&>button]:border [&>button]:border-white [&>button]:rounded-lg">
                    <button 
                        onClick={handlePrev}
                        className="p-1 hover:bg-gray-600 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={handleNext}
                        className="p-1 hover:bg-gray-600 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

            </div>
        </section>
    )
}
