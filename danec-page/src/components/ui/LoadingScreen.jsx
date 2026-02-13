import React from 'react';

const LoadingScreen = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center">
                {/* Outer Ring */}
                <div className="absolute h-24 w-24 rounded-full border-4 border-gray-100 border-t-[#f70030] animate-spin" />
                
                {/* Middle Ring */}
                <div className="absolute h-16 w-16 rounded-full border-4 border-gray-100 border-b-[#f70030] animate-spin [animation-duration:1.5s]" />
                
                {/* Inner Circle / Logo placeholder */}
                <div className="h-8 w-8 rounded-full bg-[#f70030] animate-pulse shadow-[0_0_15px_rgba(247,0,48,0.5)]" />
            </div>
            
            <div className="mt-8 text-center">
                <h2 className="text-xl font-bold text-gray-800 tracking-widest uppercase animate-pulse">
                    Cargando
                </h2>
                <div className="mt-2 flex gap-1 justify-center">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f70030] animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f70030] animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f70030] animate-bounce" />
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
