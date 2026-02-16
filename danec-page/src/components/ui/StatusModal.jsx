import React from 'react';

const StatusModal = ({ isOpen, onClose, onConfirm, type = 'success', title, message }) => {
    if (!isOpen) return null;

    const isSuccess = type === 'success';
    const isError = type === 'error';
    const isConfirm = type === 'confirm';

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-100 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all animate-in zoom-in-95 duration-300">
                <div className={`h-2 ${isSuccess ? 'bg-green-500' : isConfirm ? 'bg-yellow-500' : 'bg-red-500'}`} />

                <div className="p-8 text-center">
                    <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 ${
                        isSuccess ? 'bg-green-100 text-green-600' : 
                        isConfirm ? 'bg-yellow-100 text-yellow-600' : 
                        'bg-red-100 text-red-600'
                    }`}>
                        {isSuccess && (
                            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {isConfirm && (
                            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                        )}
                        {isError && (
                            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-tight">
                        {title || (isSuccess ? '¡Éxito!' : isConfirm ? '¿Confirmar?' : '¡Error!')}
                    </h3>

                    <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                        {message}
                    </p>

                    <div className="flex gap-3">
                        {isConfirm ? (
                            <>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-[#f70030] hover:brightness-110 shadow-md transition-all active:scale-95"
                                >
                                    SÍ, VACIAR
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 ${isSuccess
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-red-500 hover:bg-red-600'
                                    }`}
                            >
                                {isSuccess ? 'CONTINUAR' : 'CERRAR'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatusModal;
