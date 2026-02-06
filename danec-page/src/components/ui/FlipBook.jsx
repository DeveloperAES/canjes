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
    const numLeaves = useMemo(() => Math.ceil(banners.length / 2), [banners.length]);

    return (
        <div className="flipbook-container">
            <style>{`
                .flipbook-container {
                    position: relative;
                    width: 100%;
                    max-width: ${isMobile ? '90vw' : '1182px'};
                    /* Aspect ratio 2:1 for desktop (2 pages), 1:1 for mobile (1 page) */
                    aspect-ratio: ${isMobile ? '1 / 1' : '2 / 1'};
                    perspective: 2000px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    transition: transform 0.3s ease-out;
                    margin: 1rem 0 0;

                }

                .book {
                    position: relative;
                    width: ${isMobile ? '100%' : '50%'};
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    /* Centering Logic:
                       - Closed (flippedCount=0): Spine at 25%, Page at [25%, 75%] -> translateX(0)
                       - Open: Spine moves to 50%, Book covers [0%, 100%] -> translateX(50%)
                       - Closed Last: Spine moves to 75%, Page at [25%, 75%] -> translateX(100%)
                    */
                    transform: ${!isMobile
                    ? (flippedCount === 0
                        ? 'translateX(0)'
                        : (flippedCount === numLeaves
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
                    transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1);
                    pointer-events: none;
                    cursor: pointer;
                }

                .leaf.flipped {
                    transform: rotateY(-180deg);
                }

                .page-side {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    background: white;
                    box-shadow: inset 0 0 50px rgba(0,0,0,0.05), 0 10px 25px rgba(0,0,0,0.1);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    pointer-events: auto;
                    border: 1px solid rgba(0,0,0,0.05);
                }

                .page-side.back {
                    transform: rotateY(180deg);
                }

                .page-image {
                    max-width: 100%;
                    max-height: 100%;
                    width: auto;
                    height: auto;
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
                        max-height: 80vh;
                        height: auto;
                    }
                }
            `}</style>

            <div className={`book ${flippedCount > 0 ? 'open' : ''}`}>
                {Array.from({ length: numLeaves }).map((_, i) => {
                    const frontBanner = banners[i * 2];
                    const backBanner = banners[i * 2 + 1];
                    const isFlipped = i < flippedCount;
                    const zIndex = isFlipped ? i : numLeaves - i;

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
                                {backBanner ? (
                                    <img
                                        src={backBanner.Src}
                                        alt={backBanner.Alt}
                                        className="page-image"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#f8f9fa] flex items-center justify-center" />
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
