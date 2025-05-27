
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { AuthUserData, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  isAuthenticated: boolean;
  authUser: AuthUserData | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isPharmacist: boolean;
  canApproveDistribution: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState<AuthUserData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated when component mounts
    const auth = localStorage.getItem("medcontrol-auth");
    const userData = localStorage.getItem("medcontrol-user");
    
    if (auth === "true" && userData) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(userData) as AuthUserData;
        setAuthUser(user);
      } catch (error) {
        console.error("Erro ao recuperar dados do usuário:", error);
        logout(); // Se os dados forem inválidos, faz logout
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Buscar usuários cadastrados no localStorage
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) {
      toast({
        variant: "destructive",
        title: "Erro ao autenticar",
        description: "Nenhum usuário cadastrado no sistema."
      });
      return false;
    }

    const users = JSON.parse(storedUsers);
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro ao autenticar",
        description: "Email ou senha incorretos."
      });
      return false;
    }
    
    if (user.status === "inactive") {
      toast({
        variant: "destructive",
        title: "Usuário inativo",
        description: "Este usuário está desativado. Contate um administrador."
      });
      return false;
    }
    
    // Buscar nome da unidade
    const storedLocations = localStorage.getItem("medcontrol_locations");
    let locationName = "Não informado";
    if (storedLocations) {
      const locations = JSON.parse(storedLocations);
      const location = locations.find((loc: any) => loc.id === user.locationId);
      if (location) {
        locationName = location.name;
      }
    }
    
    // Criar objeto de usuário autenticado
    const authUserData: AuthUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      locationId: user.locationId,
      locationName: locationName
    };
    
    // Salvar no localStorage
    localStorage.setItem("medcontrol-auth", "true");
    localStorage.setItem("medcontrol-user", JSON.stringify(authUserData));
    
    setAuthUser(authUserData);
    setIsAuthenticated(true);
    
    toast({
      title: "Login bem-sucedido",
      description: `Bem-vindo(a), ${user.name}!`,
    });
    
    return true;
  };

  const logout = () => {
    localStorage.removeItem("medcontrol-auth");
    localStorage.removeItem("medcontrol-user");
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
