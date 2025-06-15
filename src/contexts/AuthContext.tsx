
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

  // Helper para buscar dados de perfil no banco
  async function fetchProfile(userId: string): Promise<AuthUserData | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      locationId: data.location_id,
      locationName: "" // Pode buscar o nome da unidade se quiser
    };
  }

  useEffect(() => {
    // Ouvinte do estado de autenticação do Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const userData = await fetchProfile(session.user.id);
        if (userData) {
          setAuthUser(userData);
          setIsAuthenticated(true);
        }
      } else {
        setAuthUser(null);
        setIsAuthenticated(false);
      }
    });

    // Confirma sessão iniciada ao carregar
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const userData = await fetchProfile(session.user.id);
        if (userData) {
          setAuthUser(userData);
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      toast({
        variant: "destructive",
        title: "Erro ao autenticar",
        description: error?.message ?? "Usuário ou senha inválidos"
      });
      return false;
    }

    // Busca perfil após login
    const userData = await fetchProfile(data.user.id);
    if (!userData) {
      toast({
        variant: "destructive",
        title: "Usuário sem perfil autorizado",
        description: "Seu perfil não está autorizado no sistema."
      });
      await supabase.auth.signOut();
      return false;
    }
    setAuthUser(userData);
    setIsAuthenticated(true);

    toast({
      title: "Login bem-sucedido",
      description: `Bem-vindo(a), ${userData.name}!`
    });

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setIsAuthenticated(false);
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
