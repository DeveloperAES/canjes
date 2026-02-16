
import { Eye, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProductCard({ product, onAdd, onView }) {
    if (!product) return null;
    const { user } = useAuth();



    return (
        <div className="border border-gray-200 shadow-sm w-full rounded-2xl flex flex-col bg-white text-gray-900 overflow-hidden group hover:shadow-xl transition-all duration-300">

            {
                product.quantity === 0 ? (
                    <div className="h-48 flex items-center justify-center relative bg-white p-4 overflow-hidden">
                        <img src={product.image} alt={product.name} className="max-h-full h-auto max-w-full object-contain grayscale opacity-50 transition-all group-hover:scale-110 duration-500" />
                        <div className="bg-[#f70030] absolute text-white font-black w-[280px] text-center uppercase -rotate-35 left-[-20%] top-[30%] z-10 py-1.5 shadow-xl text-xs tracking-widest" >
                            Agotado
                        </div>
                    </div>
                ) : (
                    <div className="h-48 flex items-center justify-center bg-white p-4 overflow-hidden">
                        <img src={product.image} alt={product.name} className="max-h-full h-auto max-w-full object-contain transition-all group-hover:scale-110 duration-500" />
                    </div>
                )
            }
            <div className="flex flex-col items-center justify-center bg-gray-50/50 p-5 gap-3">
                <div className="flex flex-col items-center text-center gap-1">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.category}</span>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight line-clamp-1">{product.name}</h3>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                    <div className="text-xl font-black text-[#f70030] leading-none">{product.price}</div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Puntos</span>
                </div>

                <div className="text-[10px] font-bold text-gray-500 bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">
                    Stock: {product.quantity}
                </div>

                <div className="flex flex-col gap-3 w-full mt-2">
                    <button
                        disabled={product.quantity <= 0}
                        onClick={() => onAdd?.(product)}
                        className={`w-full flex items-center gap-2 justify-center py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition-all
                            ${product.quantity <= 0
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-gray-900 text-white hover:bg-black active:scale-95 shadow-lg shadow-gray-200"}`}
                    >
                        <ShoppingCart size={16} />
                        {product.quantity <= 0 ? "Sin stock" : "Canjear"}
                    </button>
                </div>
            </div>

        </div>
    );
}
