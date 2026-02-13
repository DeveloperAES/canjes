import { createContext, useContext, useState, useCallback } from "react";
import LoadingScreen from "../components/ui/LoadingScreen";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = useCallback(() => setIsLoading(true), []);
    const hideLoading = useCallback(() => setIsLoading(false), []);

    return (
        <LoadingContext.Provider value={{ showLoading, hideLoading, isLoading }}>
            {children}
            <LoadingScreen isVisible={isLoading} />
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading debe ser usado dentro de un LoadingProvider");
    }
    return context;
};
