
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { AuthUserData, AuthContextType } from "./auth/types";
import { AuthService } from "./auth/authService";
import { initializeDefaultData, forceUpdateUserData } from "./auth/authUtils";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState<AuthUserData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Inicializar dados padrão primeiro
    initializeDefaultData();
    
    // Forçar atualização dos dados de usuário para garantir consistência
    forceUpdateUserData();
    
    // Check if user is authenticated when component mounts
    const { isAuthenticated: stored, user } = AuthService.getStoredAuth();
    
    if (stored && user) {
      setIsAuthenticated(true);
      setAuthUser(user);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await AuthService.authenticateUser(email, password);
    
    if (result.success && result.user) {
      setAuthUser(result.user);
      setIsAuthenticated(true);
      
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo(a), ${result.user.name}!`,
      });
      
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Erro ao autenticar",
        description: result.error || "Erro desconhecido"
      });
      return false;
    }
  };

  const logout = () => {
    AuthService.logout();
    setAuthUser(null);
    setIsAuthenticated(false);
  };

  // Não renderize nada enquanto está verificando a autenticação
  if (isLoading) {
    return null;
  }

  // Helpers para verificar roles
  const isAdmin = authUser?.role === "admin";
  const isPharmacist = authUser?.role === "pharmacist" || isAdmin;
  const canApproveDistribution = isAdmin || isPharmacist;

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      authUser, 
      login, 
      logout, 
      isAdmin,
      isPharmacist,
      canApproveDistribution
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
