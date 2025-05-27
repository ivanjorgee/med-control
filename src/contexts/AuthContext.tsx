
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

// Usuários para teste enquanto não tem banco de dados
const testUsers = [
  {
    id: "1",
    name: "Admin do Sistema",
    email: "admin@medcontrol.com",
    password: "admin123",
    role: "admin" as UserRole,
    locationId: "loc-001",
    locationName: "Central de Distribuição",
    status: "active"
  },
  {
    id: "2",
    name: "Farmacêutico",
    email: "farmaceutico@medcontrol.com",
    password: "farma123",
    role: "pharmacist" as UserRole,
    locationId: "loc-001",
    locationName: "Central de Distribuição",
    status: "active"
  },
  {
    id: "3",
    name: "Unidade de Saúde",
    email: "saude@medcontrol.com",
    password: "saude123",
    role: "health_unit" as UserRole,
    locationId: "loc-002",
    locationName: "UBS Centro",
    status: "active"
  },
  {
    id: "4",
    name: "Distribuidor",
    email: "distribuidor@medcontrol.com",
    password: "dist123",
    role: "distributor" as UserRole,
    locationId: "loc-003",
    locationName: "Centro de Distribuição Regional",
    status: "active"
  }
];

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
    // Esta função será substituída pela integração com banco de dados
    // Por enquanto, usa usuários de teste
    const user = testUsers.find(u => u.email === email && u.password === password);
    
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
    
    // Criar objeto de usuário autenticado
    const authUserData: AuthUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRole,
      locationId: user.locationId,
      locationName: user.locationName
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
