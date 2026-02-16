import { useBranding } from "../context/BrandingContext";
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { useState, useEffect, useMemo } from "react";
import FlipBook from "../components/ui/FlipBook";

export default function PasosPage() {
    const { branding } = useBranding();
    const rawBanners = branding?.caruselSteps || [];

    const [flippedCount, setFlippedCount] = useState(0);
    const [zoom, setZoom] = useState(100);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const numLeaves = isMobile
        ? Math.max(0, rawBanners.length - 1)
        : Math.ceil(rawBanners.length / 2);

    const handlePrev = () => {
        setFlippedCount(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setFlippedCount(prev => Math.min(numLeaves, prev + 1));
    };

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 10, 150));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 10, 50));
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if user is typing in an input or textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key) {
                case 'ArrowRight':
                    handleNext();
                    break;
                case 'ArrowLeft':
                    handlePrev();
                    break;
                case '+':
                case '=':
                    handleZoomIn();
                    break;
                case '-':
                case '_':
                    handleZoomOut();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [flippedCount, numLeaves, zoom]); // Re-bind when state changes to have fresh refs or use functional updates inside handles

    // Calculate display numbers
    const currentDisplay = useMemo(() => {
        if (rawBanners.length === 0) return "0 / 0";
        if (isMobile) {
            return `${Math.min(flippedCount + 1, rawBanners.length)}`;
        }

        if (flippedCount === 0) return "1";

        const leftPageIndex = flippedCount * 2 - 1;
        const rightPageIndex = flippedCount * 2;

        const start = leftPageIndex + 1;
        const end = Math.min(rightPageIndex + 1, rawBanners.length);

        if (start === end) return `${start}`;
        if (start > rawBanners.length) return `${rawBanners.length}`;
        return `${start}-${end}`;
    }, [flippedCount, rawBanners.length, isMobile]);

    return (
        <section className="w-full h-full min-h-[calc(100vh-96px)] flex flex-col justify-center md:justify-center items-center bg-[#f0f0f0] relative overflow-hidden">

            {/* Area de visualización con Zoom */}
            <div
                className="w-full h-full flex items-center justify-center"
                style={{ transform: `scale(${zoom / 100})` }}
            >
                <FlipBook
                    banners={rawBanners}
                    flippedCount={flippedCount}
                    isMobile={isMobile}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            </div>

            {/* Barra de Controles Flotante */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#6c757d] text-white rounded-full flex items-center z-50 px-7 py-2 gap-2 z-[999]">

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
                        disabled={flippedCount === 0}
                        className="p-1 hover:bg-gray-600 transition-colors disabled:opacity-30"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={flippedCount === numLeaves}
                        className="p-1 hover:bg-gray-600 transition-colors disabled:opacity-30"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

            </div>
        </section>
    );
}

