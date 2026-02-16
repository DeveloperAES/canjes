import React, { useMemo } from 'react';

/**
 * FlipBook Component
 * 
 * @param {Array} banners - Array of banner objects { Src, Alt, ... }
 * @param {number} flippedCount - Current number of flipped leaves
 * @param {boolean} isMobile - Responsive flag
 * @param {Function} onPrev - Callback for previous page
 * @param {Function} onNext - Callback for next page
 */
const FlipBook = ({ banners = [], flippedCount, isMobile, onPrev, onNext }) => {
    const numLeaves = useMemo(() => {
        return isMobile ? banners.length : Math.ceil(banners.length / 2);
    }, [banners.length, isMobile]);

    return (
        <div className="flipbook-container">
            <style>{`
                .flipbook-container {
                    position: relative;
                    width: 100%;
                    max-width: ${isMobile ? '85vw' : '1182px'};
                    /* Aspect ratio 1:1.4 for mobile (portrait-ish), 2:1 for desktop (2 pages) */
                    aspect-ratio: ${isMobile ? '1 / 1.4' : '2 / 1'};
                    perspective: 2500px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: transform 0.3s ease-out;
                    margin: 0;
                }

                .book {
                    position: relative;
                    width: ${isMobile ? '100%' : '50%'};
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    transform: ${!isMobile
                    ? (flippedCount === 0
                        ? 'translateX(0)'
                        : (flippedCount === Math.ceil(banners.length / 2)
                            ? 'translateX(100%)'
                            : 'translateX(50%)'))
                    : 'none'};
                }

                .leaf {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    transform-origin: left;
                    transform-style: preserve-3d;
                    transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.8s ease;
                    pointer-events: none;
                    cursor: pointer;
                    opacity: 1;
                }

                .leaf.flipped {
                    transform: rotateY(-180deg);
                    ${isMobile ? 'opacity: 0;' : ''}
                    pointer-events: none;
                }

                .page-side {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    background: white;
                    box-shadow: ${isMobile ? '0 10px 30px rgba(0,0,0,0.15)' : 'inset 0 0 50px rgba(0,0,0,0.05), 0 10px 25px rgba(0,0,0,0.1)'};
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    pointer-events: auto;
                    border: 1px solid rgba(0,0,0,0.05);
                    border-radius: ${isMobile ? '8px' : '2px'};
                }

                .page-side.back {
                    transform: rotateY(180deg);
                }

                .page-image {
                    max-width: 100%;
                    max-height: 100%;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    user-select: none;
                    background: white;
                }

                @media (max-width: 640px) {
                    .book {
                        width: 100%;
                        transform: none !important;
                    }
                    .flipbook-container {
                        max-height: 70vh;
                        height: auto;
                    }
                }
            `}</style>

            <div className={`book ${flippedCount > 0 ? 'open' : ''}`}>
                {Array.from({ length: numLeaves }).map((_, i) => {
                    const isFlipped = i < flippedCount;
                    const zIndex = isFlipped ? i : numLeaves - i;

                    // Desktop: 2 pages per leaf
                    // Mobile: 1 page per leaf
                    const frontBanner = isMobile ? banners[i] : banners[i * 2];
                    const backBanner = isMobile ? null : banners[i * 2 + 1];

                    if (!frontBanner && isMobile) return null;

                    return (
                        <div
                            key={i}
                            className={`leaf ${isFlipped ? 'flipped' : ''}`}
                            style={{ zIndex }}
                            onClick={() => isFlipped ? onPrev() : onNext()}
                        >
                            <div className="page-side front">
                                {frontBanner && (
                                    <img
                                        src={frontBanner.Src}
                                        alt={frontBanner.Alt}
                                        className="page-image"
                                    />
                                )}
                            </div>
                            <div className="page-side back">
                                {!isMobile && (
                                    backBanner ? (
                                        <img
                                            src={backBanner.Src}
                                            alt={backBanner.Alt}
                                            className="page-image"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#f8f9fa] flex items-center justify-center" />
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


export default FlipBook;
