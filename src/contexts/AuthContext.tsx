
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { AuthUserData, AuthContextType } from "./auth/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState<AuthUserData | null>(null);
  const { toast } = useToast();

  // Helper para buscar dados de usuário do localStorage como fallback
  async function fetchUserFromLocalStorage(email: string, password: string): Promise<AuthUserData | null> {
    console.log("🔍 Tentando buscar usuário no localStorage...");
    const storedUsers = localStorage.getItem("users");
    
    if (!storedUsers) {
      console.log("❌ Nenhum usuário encontrado no localStorage");
      return null;
    }

    try {
      const users = JSON.parse(storedUsers);
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user && user.status === "active") {
        console.log("✅ Usuário encontrado no localStorage:", user);
        
        // Buscar nome da localização
        const storedLocations = localStorage.getItem("medcontrol_locations");
        let locationName = "Unidade Central de Saúde";
        
        if (storedLocations) {
          const locations = JSON.parse(storedLocations);
          const location = locations.find((loc: any) => loc.id === user.locationId);
          if (location) {
            locationName = location.name;
          }
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          locationId: user.locationId,
          locationName: locationName
        };
      }
    } catch (error) {
      console.error("❌ Erro ao processar usuários do localStorage:", error);
    }
    
    return null;
  }

  // Helper para buscar dados de perfil no Supabase
  async function fetchProfile(userId: string): Promise<AuthUserData | null> {
    console.log("🔍 Tentando buscar perfil no Supabase para ID:", userId);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
      
    if (error) {
      console.log("❌ Erro ao buscar perfil no Supabase:", error);
      return null;
    }
    
    if (!data) {
      console.log("❌ Nenhum perfil encontrado no Supabase");
      return null;
    }
    
    console.log("✅ Perfil encontrado no Supabase:", data);
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role as import("@/types").UserRole,
      locationId: data.location_id,
      locationName: "" // Pode buscar o nome da unidade se quiser
    };
  }

  useEffect(() => {
    // Ouvinte do estado de autenticação do Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("🔐 Mudança no estado de autenticação:", _event, session?.user?.email);
      
      if (session?.user) {
        const userData = await fetchProfile(session.user.id);
        if (userData) {
          setAuthUser(userData);
          setIsAuthenticated(true);
          console.log("✅ Usuário autenticado via Supabase");
        }
      } else {
        setAuthUser(null);
        setIsAuthenticated(false);
        console.log("❌ Usuário não autenticado");
      }
    });

    // Verificar sessão inicial
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const userData = await fetchProfile(session.user.id);
        if (userData) {
          setAuthUser(userData);
          setIsAuthenticated(true);
          console.log("✅ Sessão restaurada via Supabase");
        }
      }
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("🔑 Tentando fazer login com:", email);
    
    // Primeiro, tentar autenticação via Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.session) {
      console.log("✅ Login bem-sucedido via Supabase");
      const userData = await fetchProfile(data.user.id);
      if (userData) {
        setAuthUser(userData);
        setIsAuthenticated(true);
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo(a), ${userData.name}!`
        });
        return true;
      }
    }

    console.log("⚠️ Falha no login via Supabase, tentando localStorage...");
    
    // Fallback: tentar autenticação via localStorage
    const localUser = await fetchUserFromLocalStorage(email, password);
    if (localUser) {
      setAuthUser(localUser);
      setIsAuthenticated(true);
      
      // Salvar no localStorage para manter sessão
      localStorage.setItem("medcontrol-auth", "true");
      localStorage.setItem("medcontrol-user", JSON.stringify(localUser));
      
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo(a), ${localUser.name}!`
      });
      return true;
    }

    console.log("❌ Login falhou em ambos os métodos");
    toast({
      variant: "destructive",
      title: "Erro ao autenticar",
      description: "Email ou senha incorretos"
    });
    return false;
  };

  const logout = async () => {
    console.log("🚪 Fazendo logout...");
    await supabase.auth.signOut();
    localStorage.removeItem("medcontrol-auth");
    localStorage.removeItem("medcontrol-user");
    setAuthUser(null);
    setIsAuthenticated(false);
    console.log("✅ Logout concluído");
  };

  if (isLoading) return null;

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
