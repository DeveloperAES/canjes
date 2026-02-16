import { useState } from "react";
import { postExchangeApi } from "../../api/userApi";
import { useModal } from "../../context/ModalContext";

export default function ExchangeModal({ isOpen, onClose, onSuccess }) {
    const { showModal } = useModal();
    const [formData, setFormData] = useState({
        Using: null,
        Email: "",
        Name: "",
        Cellphone: "",
        Address: "",
        Neighborhood: "",
        City: "",
        Department: "",
        Telephone: null,
        ContactName: "",
        ContactCedula: "",
        ContactCellphone: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        const requiredFields = ['Email', 'Name', 'Cellphone', 'Address', 'Neighborhood', 'City', 'Department', 'ContactName', 'ContactCedula', 'ContactCellphone'];
        const emptyFields = requiredFields.filter(field => !formData[field]);

        if (emptyFields.length > 0) {
            showModal({
                type: 'error',
                title: 'CAMPOS INCOMPLETOS',
                message: 'Por favor completa todos los campos requeridos para el envío.'
            });
            return;
        }

        setLoading(true);
        try {
            console.log("Sending exchange data:", formData);
            await postExchangeApi(formData);

            showModal({
                type: 'success',
                title: '¡CANJE EXITOSO!',
                message: 'Tu canje se ha procesado correctamente. Pronto recibirás noticias nuestras.',
                onConfirm: () => {
                    onSuccess();
                    onClose();
                }
            });
        } catch (error) {
            console.error("Exchange error:", error);
            const msg = error?.response?.data?.Response?.sRetorno || error?.response?.data?.message || "Error al realizar el canje";

            showModal({
                type: 'error',
                title: 'ERROR EN EL CANJE',
                message: msg
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-red-600 text-white p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">COMPLETAR INFORMACIÓN DE ENVÍO</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Personal Information */}
                        <div className="col-span-2">
                            <h3 className="font-bold text-gray-700 mb-3">Información Personal</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Email <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Nombre <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="Name"
                                value={formData.Name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Celular <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="tel"
                                name="Cellphone"
                                value={formData.Cellphone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                name="Telephone"
                                value={formData.Telephone || ""}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        {/* Address Information */}
                        <div className="col-span-2 mt-4">
                            <h3 className="font-bold text-gray-700 mb-3">Dirección de Envío</h3>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Dirección <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="Address"
                                value={formData.Address}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Barrio <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="Neighborhood"
                                value={formData.Neighborhood}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Ciudad <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="City"
                                value={formData.City}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Departamento <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="Department"
                                value={formData.Department}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        {/* Contact Information */}
                        <div className="col-span-2 mt-4">
                            <h3 className="font-bold text-gray-700 mb-3">Información de Contacto</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Nombre de Contacto <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="ContactName"
                                value={formData.ContactName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Cédula de Contacto <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                name="ContactCedula"
                                value={formData.ContactCedula}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Celular de Contacto <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="tel"
                                name="ContactCellphone"
                                value={formData.ContactCellphone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
                        >
                            CANCELAR
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:bg-gray-400"
                        >
                            {loading ? "PROCESANDO..." : "CONFIRMAR CANJE"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
