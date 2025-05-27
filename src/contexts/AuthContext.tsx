
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

// Usuários padrão do sistema
const DEFAULT_USERS = [
  {
    id: "admin-001",
    name: "Administrador do Sistema",
    email: "sms.sjapa@gmail.com",
    password: "smss@2025",
    role: "admin",
    locationId: "loc-001",
    status: "active"
  },
  {
    id: "pharmacist-001", 
    name: "Farmacêutico Responsável",
    email: "ivanjfm15@gmail.com",
    password: "Adbc102030",
    role: "pharmacist",
    locationId: "loc-001",
    status: "active"
  },
  {
    id: "user-001",
    name: "Usuário Teste",
    email: "usuario@medcontrol.com",
    password: "user123",
    role: "user",
    locationId: "loc-001", 
    status: "active"
  }
];

// Localizações padrão
const DEFAULT_LOCATIONS = [
  {
    id: "loc-001",
    name: "Unidade Central de Saúde",
    type: "hospital",
    address: "Rua Principal, 123",
    phone: "(11) 99999-9999",
    status: "active",
    coordinatorId: "admin-001"
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState<AuthUserData | null>(null);
  const { toast } = useToast();

  // Função para inicializar dados padrão
  const initializeDefaultData = () => {
    console.log("=== INICIALIZANDO DADOS PADRÃO ===");
    
    // Verificar se já existem usuários
    const existingUsers = localStorage.getItem("users");
    if (!existingUsers || JSON.parse(existingUsers).length === 0) {
      console.log("Criando usuários padrão...");
      localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
      console.log("✅ Usuários padrão criados:", DEFAULT_USERS);
    }
    
    // Verificar se já existem localizações
    const existingLocations = localStorage.getItem("medcontrol_locations");
    if (!existingLocations || JSON.parse(existingLocations).length === 0) {
      console.log("Criando localizações padrão...");
      localStorage.setItem("medcontrol_locations", JSON.stringify(DEFAULT_LOCATIONS));
      console.log("✅ Localizações padrão criadas:", DEFAULT_LOCATIONS);
    }
    
    // Marcar sistema como configurado
    localStorage.setItem("medcontrol-setup-complete", "true");
    console.log("✅ Sistema marcado como configurado");
  };

  useEffect(() => {
    // Inicializar dados padrão primeiro
    initializeDefaultData();
    
    // Check if user is authenticated when component mounts
    const auth = localStorage.getItem("medcontrol-auth");
    const userData = localStorage.getItem("medcontrol-user");
    
    console.log("Verificando autenticação existente...", { auth, userData });
    
    if (auth === "true" && userData) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(userData) as AuthUserData;
        setAuthUser(user);
        console.log("Usuário autenticado recuperado:", user);
      } catch (error) {
        console.error("Erro ao recuperar dados do usuário:", error);
        logout(); // Se os dados forem inválidos, faz logout
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("=== INICIANDO PROCESSO DE LOGIN ===");
    console.log("Email informado:", email);
    console.log("Senha informada:", password);
    
    // Buscar usuários cadastrados no localStorage
    const storedUsers = localStorage.getItem("users");
    console.log("Dados brutos de usuários:", storedUsers);
    
    if (!storedUsers) {
      console.log("❌ Nenhum usuário encontrado no localStorage");
      // Inicializar dados padrão se não existirem
      initializeDefaultData();
      const newStoredUsers = localStorage.getItem("users");
      if (!newStoredUsers) {
        toast({
          variant: "destructive",
          title: "Erro ao autenticar",
          description: "Erro ao inicializar usuários do sistema."
        });
        return false;
      }
    }

    let users;
    try {
      const currentUsers = localStorage.getItem("users");
      users = JSON.parse(currentUsers!);
      console.log("✅ Usuários parseados com sucesso:", users);
      console.log("Total de usuários encontrados:", users.length);
    } catch (error) {
      console.error("❌ Erro ao parsear usuários:", error);
      toast({
        variant: "destructive",
        title: "Erro ao autenticar",
        description: "Erro ao carregar dados de usuários."
      });
      return false;
    }

    // Log detalhado de cada usuário
    users.forEach((u: any, index: number) => {
      console.log(`Usuário ${index + 1}:`, {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status
      });
    });

    // Buscar usuário com credenciais fornecidas
    const user = users.find((u: any) => {
      const emailMatch = u.email === email;
      const passwordMatch = u.password === password;
      console.log(`Verificando ${u.email}: email=${emailMatch}, senha=${passwordMatch}`);
      return emailMatch && passwordMatch;
    });
    
    if (!user) {
      console.log("❌ Usuário não encontrado ou senha incorreta");
      console.log("Email procurado:", email);
      console.log("Emails disponíveis:", users.map((u: any) => u.email));
      toast({
        variant: "destructive",
        title: "Erro ao autenticar",
        description: "Email ou senha incorretos."
      });
      return false;
    }
    
    console.log("✅ Usuário encontrado:", user);
    
    if (user.status === "inactive") {
      console.log("❌ Usuário inativo");
      toast({
        variant: "destructive",
        title: "Usuário inativo",
        description: "Este usuário está desativado. Contate um administrador."
      });
      return false;
    }
    
    // Buscar nome da unidade
    const storedLocations = localStorage.getItem("medcontrol_locations");
    let locationName = "Unidade Central de Saúde";
    if (storedLocations) {
      try {
        const locations = JSON.parse(storedLocations);
        const location = locations.find((loc: any) => loc.id === user.locationId);
        if (location) {
          locationName = location.name;
        }
        console.log("Localização encontrada:", locationName);
      } catch (error) {
        console.error("Erro ao buscar localização:", error);
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
    
    console.log("✅ Dados do usuário autenticado:", authUserData);
    
    // Salvar no localStorage com validação
    try {
      localStorage.setItem("medcontrol-auth", "true");
      localStorage.setItem("medcontrol-user", JSON.stringify(authUserData));
      
      // Verificar se foi salvo corretamente
      const savedAuth = localStorage.getItem("medcontrol-auth");
      const savedUser = localStorage.getItem("medcontrol-user");
      console.log("✅ Autenticação salva:", savedAuth);
      console.log("✅ Usuário salvo:", savedUser);
      
    } catch (error) {
      console.error("❌ Erro ao salvar no localStorage:", error);
      toast({
        variant: "destructive",
        title: "Erro de sistema",
        description: "Erro ao salvar dados de autenticação."
      });
      return false;
    }
    
    setAuthUser(authUserData);
    setIsAuthenticated(true);
    
    toast({
      title: "Login bem-sucedido",
      description: `Bem-vindo(a), ${user.name}!`,
    });
    
    console.log("=== LOGIN CONCLUÍDO COM SUCESSO ===");
    return true;
  };

  const logout = () => {
    console.log("Fazendo logout...");
    localStorage.removeItem("medcontrol-auth");
    localStorage.removeItem("medcontrol-user");
    setAuthUser(null);
    setIsAuthenticated(false);
    console.log("Logout concluído");
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
