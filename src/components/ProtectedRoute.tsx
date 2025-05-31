
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
  const { isAuthenticated, authUser } = useAuth();
  const location = useLocation();
  
  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Verificações de permissão baseadas na role do usuário
  if (requiresAdmin && authUser?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  if (requiresPharmacist && authUser?.role !== "pharmacist" && authUser?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  if (requiresDistributor && authUser?.role !== "distributor" && authUser?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  if (requiresHealthUnit && authUser?.role !== "health_unit" && authUser?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
}
