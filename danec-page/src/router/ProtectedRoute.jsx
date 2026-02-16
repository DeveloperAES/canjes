import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import { useEffect } from "react";

export default function ProtectedRoute({ redirectTo = "/login" }) {
  const { isAuthenticated, loading } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (loading) showLoading();
    else hideLoading();
  }, [loading, showLoading, hideLoading]);

  if (loading) return null;

  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;

  return <Outlet />;
}
