import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginApi, getProfileApi } from "../api/authApi";
import { getUserDetailsApi, getUserPointsApi, getUserCartApi } from "../api/userApi";
import { useBranding } from "./BrandingContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { refreshBranding } = useBranding();
  const [user, setUser] = useState(null); // respuesta completa del /user
  const [userDetails, setUserDetails] = useState(null); // respuesta completa del /user/form_detail
  const [userPoints, setUserPoints] = useState(null); // respuesta completa del /user/form_detail
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Normaliza el perfil real
  const profile = useMemo(() => user?.Response?.oResponse ?? null, [user]);

  // Token persistido
  const token = useMemo(() => localStorage.getItem("token"), [user]);
  // (nota: el memo aquí no es crítico; si prefieres, usa const token = localStorage.getItem("token");)

  // Autenticado si hay token
  const isAuthenticated = !!localStorage.getItem("token");

  // Flag: si updated !== true => debe completar datos
  const needsProfileUpdate = useMemo(() => {
    const updated = profile?.ExtraInfo?.updated;

    return updated !== true; // null/undefined/false => true (necesita actualizar)
  }, [profile]);

  // Validar token al cargar la app (rehidratación en F5)
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const me = await getProfileApi(); // interceptor manda Bearer
        const userDetails = await getUserDetailsApi();
        const userPoints = await getUserPointsApi();
        setUser(me);
        setUserDetails(userDetails);
        setUserPoints(userPoints);

        // Cargar carrito
        let currentCart = [];
        try {
          const cartData = await getUserCartApi();
          // Adjust based on actual API response structure (assuming it might be the array or wrapped)
          currentCart = Array.isArray(cartData) ? cartData : (cartData?.Response?.oResponse || []);
        } catch (e) {
          console.error("Error loading cart", e);
        }

        const total = currentCart.reduce((acc, item) => acc + (item.Total || 0), 0);

        setCart(currentCart);
        setCartTotal(total);

      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Función para refrescar datos del usuario (llamada manual)
  const refreshSession = async (newToken = null) => {
    try {
      if (newToken) {
        localStorage.setItem("token", newToken);
      }

      const me = await getProfileApi();
      const userDetails = await getUserDetailsApi();
      const userPoints = await getUserPointsApi();
      setUser(me);
      setUserDetails(userDetails);
      setUserPoints(userPoints);

      // Recargar carrito
      let currentCart = [];
      try {
        const cartData = await getUserCartApi();
        currentCart = Array.isArray(cartData) ? cartData : (cartData?.Response?.oResponse || []);
      } catch (e) {
        console.error("Error reloading cart", e);
      }
      const total = currentCart.reduce((acc, item) => acc + (item.Total || 0), 0);

      setUser(me);
      setUserDetails(userDetails);
      setUserPoints(userPoints);
      setCart(currentCart);
      setCartTotal(total);
      return true;
    } catch (error) {
      console.error("Error refreshing session:", error);
      return false;
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const { token } = await loginApi({ username, password });

      localStorage.setItem("token", token);

      const me = await getProfileApi();
      const userDetails = await getUserDetailsApi();
      const userPoints = await getUserPointsApi();
      
      setUser(me);
      setUserDetails(userDetails);
      setUserPoints(userPoints);

      // Cargar carrito al login
      let currentCart = [];
      try {
        const cartData = await getUserCartApi();
        currentCart = Array.isArray(cartData) ? cartData : (cartData?.Response?.oResponse || []);
      } catch (e) {
        console.error("Error loading cart on login", e);
      }
      const total = currentCart.reduce((acc, item) => acc + (item.Total || 0), 0);

      setCart(currentCart);
      setCartTotal(total);

      // Seteamos el branding al iniciar sesión satisfactoriamente
      await refreshBranding();

      return true;
    } catch (err) {
      console.error(err);

      const msg =
        err?.message ||
        err?.response?.data?.response?.sRetorno ||
        err?.response?.data?.errors?.[0]?.message ||
        "Credenciales inválidas";

      setError(msg);

      localStorage.removeItem("token");
      setUser(null);

      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setError(null);
  };

  // ---- Mantengo tus campos aunque tu API real no devuelve compras ----
  const compras = user?.compras || [];

  const resumenMensual = useMemo(() => {
    return compras.reduce((acc, item) => {
      acc[item.mes] = (acc[item.mes] || 0) + item.puntos;
      return acc;
    }, {});
  }, [compras]);

  const totalPuntos = useMemo(
    () => Object.values(resumenMensual).reduce((a, b) => a + b, 0),
    [resumenMensual]
  );

  return (
    <AuthContext.Provider
      value={{
        user,              // respuesta completa /user
        profile,
        userDetails,       // user.response.oResponse (normalizado)
        userPoints,
        cart,
        cartTotal,
        isAuthenticated,   // por token (fix F5)
        needsProfileUpdate,// updated !== true
        loading,
        error,
        login,
        logout,

        // legacy (si lo sigues usando en otras vistas)
        compras,
        resumenMensual,
        totalPuntos,
        refreshSession,    // Exponer función de refresco
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
