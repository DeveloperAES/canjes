import React, { useState } from 'react';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';

export default function QuantityModal({ isOpen, onClose, product, onConfirm, availablePoints }) {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !product) return null;

    const totalCost = product.price * quantity;
    const canAfford = availablePoints >= totalCost;
    const maxPossible = Math.min(product.quantity, Math.floor(availablePoints / product.price));

    const handleIncrement = () => {
        if (quantity < product.quantity) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleConfirm = () => {
        if (quantity > 0 && canAfford) {
            onConfirm(product, quantity);
            onClose();
            setQuantity(1);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-110 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[30px] shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-in zoom-in-95 duration-300 border border-gray-100">
                {/* Header */}
                <div className="relative h-32 bg-gray-50 flex items-center justify-center p-6">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-sm text-gray-400 hover:text-black transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-auto object-contain drop-shadow-xl"
                    />
                </div>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <span className="text-[10px] font-black text-[#f70030] bg-red-50 px-2 py-1 rounded-full uppercase tracking-tighter mb-2 inline-block">
                            {product.category}
                        </span>
                        <h3 className="text-xl font-black text-gray-900 uppercase leading-tight mb-2">
                            {product.name}
                        </h3>
                        
                        {product.detail && (
                            <p className="text-xs text-gray-500 leading-relaxed px-4 mb-4 line-clamp-3 italic">
                                "{product.detail}"
                            </p>
                        )}

                        <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl font-black text-[#f70030]">{product.price}</span>
                            <span className="text-xs font-bold text-gray-400">PUNTOS C/U</span>
                        </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-gray-500 uppercase">Cantidad</span>
                            <span className="text-xs font-bold text-gray-400">Disponible: {product.quantity}</span>
                        </div>
                        
                        <div className="flex items-center justify-between gap-4">
                            <button 
                                onClick={handleDecrement}
                                disabled={quantity <= 1}
                                className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#f70030] hover:text-[#f70030] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all active:scale-95 shadow-sm"
                            >
                                <Minus size={20} />
                            </button>
                            
                            <span className="text-3xl font-black text-gray-900 w-12 text-center">
                                {quantity}
                            </span>
                            
                            <button 
                                onClick={handleIncrement}
                                disabled={quantity >= product.quantity}
                                className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#f70030] hover:text-[#f70030] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all active:scale-95 shadow-sm"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="space-y-3 mb-8">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-gray-400">TOTAL A CANJEAR</span>
                            <span className={`text-lg font-black ${canAfford ? 'text-gray-900' : 'text-red-500'}`}>
                                {totalCost} PTS
                            </span>
                        </div>
                        {!canAfford && (
                            <div className="bg-red-50 text-red-600 text-[10px] font-bold p-2 rounded-lg text-center uppercase">
                                Puntos insuficientes (Disponibles: {availablePoints} PTS)
                            </div>
                        )}
                    </div>

                    {/* Action */}
                    <button
                        onClick={handleConfirm}
                        disabled={!canAfford || quantity <= 0}
                        className="w-full py-4 bg-[#f70030] text-white font-black rounded-2xl shadow-lg shadow-red-100 flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed uppercase tracking-wider"
                    >
                        <ShoppingCart size={20} />
                        Confirmar Canje
                    </button>
                </div>
            </div>
        </div>
    );
}
