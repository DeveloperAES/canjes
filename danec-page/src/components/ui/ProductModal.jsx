import React from "react";

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-[min(920px,95%)] bg-white rounded-lg p-6 flex gap-5">
        <div className="flex-none w-80 flex items-center justify-center">
          <img src={product.image} alt={product.title} className="max-w-full max-h-[420px] object-contain" />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-lg font-semibold m-0">{product.title}</h3>
            <button onClick={onClose} className="text-xl leading-none bg-transparent border-0 cursor-pointer">✕</button>
          </div>
          <div className="text-sm text-gray-500 my-2">{product.category}</div>
          <div className="text-2xl font-bold mb-3">{`$${product.price}`}</div>
          <p className="leading-relaxed">{product.detail}</p>
          <div className="mt-auto flex gap-2">
            {/* <button className="py-2 px-4 rounded-md text-white bg-black" >Agregar al carrito</button> */}
            <button onClick={onClose} className="bg-black text-white py-2 px-4 rounded-md border">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
