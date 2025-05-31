
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  requiresAdmin?: boolean;
  requiresPharmacist?: boolean;
  requiresDistributor?: boolean;
  requiresHealthUnit?: boolean;
}

export function ProtectedRoute({ 
  requiresAdmin = false, 
  requiresPharmacist = false,
  requiresDistributor = false,
  requiresHealthUnit = false
}: ProtectedRouteProps) {
  const { isAuthenticated, profile, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  
  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Verificações de permissão baseadas na role do usuário
  if (requiresAdmin && profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  if (requiresPharmacist && profile?.role !== "pharmacist" && profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  if (requiresDistributor && profile?.role !== "distributor" && profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  if (requiresHealthUnit && profile?.role !== "health_unit" && profile?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
}
