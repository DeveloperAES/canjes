import { createContext, useContext, useState } from "react";
import StatusModal from "../components/ui/StatusModal";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [statusModal, setStatusModal] = useState({
        isOpen: false,
        type: 'success', // 'success' | 'error'
        title: '',
        message: '',
        onConfirm: null
    });

    const showModal = ({ type, title, message, onConfirm = null }) => {
        setStatusModal({
            isOpen: true,
            type,
            title,
            message,
            onConfirm
        });
    };

    const hideModal = () => {
        const { onConfirm, type } = statusModal;
        setStatusModal(prev => ({ ...prev, isOpen: false }));
        
        // Success modals auto-trigger confirm on close.
        if (type === 'success' && onConfirm) {
            onConfirm();
        }
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            <StatusModal
                isOpen={statusModal.isOpen}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={() => statusModal.onConfirm && statusModal.onConfirm()}
            />
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal debe ser usado dentro de un ModalProvider");
    }
    return context;
};
