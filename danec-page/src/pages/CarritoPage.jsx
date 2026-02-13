import { ButtonNavigate } from "../components/ui/buttons/ButtonNavigation";
import { postUserCartApi } from "../api/userApi";
import { getCatalog } from "../api/productsApi";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import ExchangeModal from "../components/ui/ExchangeModal";
import { useModal } from "../context/ModalContext";
import { useLoading } from "../context/LoadingContext";

export default function CarritoPage() {
    const { userPoints, refreshSession, cartTotal, cart } = useAuth();
    const { showModal } = useModal();
    const { showLoading, hideLoading } = useLoading();

    const totalPoints = userPoints?.Response?.oResponse[0]?.total || 0;
    const effectivePoints = totalPoints - (cartTotal || 0);

    const [catalog, setCatalog] = useState([]);
    const [loadingCatalog, setLoadingCatalog] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await getCatalog();
                setCatalog(data.Response.oResponse || []);
            } catch (error) {
                console.error("Error fetching catalog", error);
            } finally {
                setLoadingCatalog(false);
            }
        })();
    }, []);

    const enrichedCart = useMemo(() => {
        if (!cart || !catalog.length) return [];
        return cart.map(item => {
            const product = catalog.find(p => p.id === item.ProductId);
            return {
                ...item,
                title: product?.name || "Producto no disponible",
                image: product?.image || "",
                unitPrice: product?.price || 0,
            };
        });
    }, [cart, catalog]);


    const handleUpdateQuantity = async (productId, delta, unitPrice, currentQuantity) => {
        if (delta > 0) {
            if (effectivePoints < unitPrice) {
                showModal({
                    type: 'error',
                    title: 'Puntos Insuficientes',
                    message: `No tienes suficientes puntos para agregar más. Tienes ${effectivePoints} disponibles y necesitas ${unitPrice} puntos.`
                });
                return;
            }
        }

        const newQuantity = currentQuantity + delta;

        if (newQuantity < 0) return;

        showLoading();
        try {
            await postUserCartApi({ product: productId, quantity: newQuantity });
            await refreshSession();

            if (newQuantity === 0) {
                showModal({
                    type: 'success',
                    title: 'PRODUCTO ELIMINADO',
                    message: 'El producto ha sido removido de tu carrito correctamente.'
                });
            }
        } catch (error) {
            const msg = error?.response?.data?.message || error?.response?.data?.response?.sRetorno || "Error al actualizar carrito";
            showModal({
                type: 'error',
                title: 'Error al actualizar',
                message: msg
            });
        } finally {
            hideLoading();
        }
    };


    console.log(cart);

    return (
        <section className="w-full py-4">
            <div className="container mx-auto px-3 bg-white  shadow-xl shadow-blue-200">
                <div className="w-full h-full bg-main flex flex-col gap-4">
                    <p className="text-white text-center text-xl py-4">
                        CARRITO
                    </p>

                </div>
                <div className="w-full h-full">
                    {
                        (effectivePoints !== undefined) ? (
                            <p className="text-black text-center text-xl py-4 font-bold">
                                PUNTOS: {effectivePoints}
                            </p>
                        ) : (
                            <p className="text-black text-center text-xl py-4 font-bold">
                                PUNTOS: ...
                            </p>
                        )
                    }
                </div>

                <div className="flex flex-col gap-4 p-4">
                    {enrichedCart.length === 0 ? (
                        <div className="flex flex-col gap-2 items-center py-3">
                            <p className="text-black text-center text-xl py-4">
                                No tienes articulos en el carrito
                            </p>
                            <ButtonNavigate linkPage="/catalogo" text="VOLVER" />
                        </div>
                    ) : (
                        <>
                            {/* Table Header */}
                            <div className="hidden md:flex justify-between border-b pb-2 font-bold text-gray-700 uppercase tracking-wider">
                                <span className="w-1/3">PRODUCTO</span>
                                <span className="w-1/6 text-center">PUNTOS UNIT.</span>
                                <span className="w-1/4 text-center">CANTIDAD</span>
                                <span className="w-1/6 text-center">TOTAL PUNTOS</span>
                            </div>

                            {/* Cart Items */}
                            <div className="flex flex-col gap-4">
                                {enrichedCart.map((item) => (
                                    <div key={item.Id} className="flex flex-col md:flex-row items-center justify-between border-b py-4 gap-4">

                                        {/* Product Info */}
                                        <div className="flex items-center gap-4 w-full md:w-1/3">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-20 h-20 object-contain border rounded"
                                            />
                                            <span className="font-semibold uppercase text-sm">{item.title}</span>
                                        </div>

                                        {/* Points Unit */}
                                        <div className="w-full md:w-1/6 text-center font-bold text-gray-700">
                                            <span className="md:hidden text-xs text-gray-400 block">UNITARIO</span>
                                            {item.unitPrice}
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="w-full md:w-1/4 flex justify-center items-center gap-3">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.ProductId, -1, item.unitPrice, item.Quantity)}
                                                className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold hover:bg-red-700 transition"
                                            >
                                                -
                                            </button>
                                            <span className="text-lg font-bold w-6 text-center">{item.Quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.ProductId, 1, item.unitPrice, item.Quantity)}
                                                className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold hover:bg-red-700 transition"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Total Points per Item */}
                                        <div className="w-full md:w-1/6 text-center font-black text-red-600">
                                            <span className="md:hidden text-xs text-gray-400 block text-center">TOTAL</span>
                                            {item.unitPrice * item.Quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Continue Button */}
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-red-600 text-white px-8 py-2 rounded font-bold uppercase hover:bg-red-700 transition"
                                >
                                    CONTINUAR
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ExchangeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={async () => {
                    await refreshSession();
                }}
            />

        </section>
    );
}
