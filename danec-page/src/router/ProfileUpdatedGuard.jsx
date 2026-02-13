
//No se está uasando de momento, pero servía para proteger las rutas, que si el usuario no actulizo sus datos no pueda acceder a otros rutas
//que no sea mi-cuenta
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import { useEffect } from "react";

export default function ProfileUpdatedGuard() {
  const { loading, needsProfileUpdate } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    if (loading) showLoading();
    else hideLoading();
  }, [loading, showLoading, hideLoading]);

  if (loading) return null;

  const isInMyAccount = location.pathname.startsWith("/mi-cuenta");

  if (needsProfileUpdate && !isInMyAccount) {
    return <Navigate to="/mi-cuenta" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
