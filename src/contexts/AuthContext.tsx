
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthUserData {
  id: string;
  name: string;
  email: string;
  role: string;
  locationId?: string;
  locationName?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  authUser: AuthUserData | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isPharmacist: boolean;
  canApproveDistribution: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState<AuthUserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);
        setSession(session);
        
        if (session?.user) {
          try {
            // Buscar perfil do usuário na tabela profiles
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profile && !error) {
              // Buscar nome da localização se location_id existir
              let locationName = null;
              if (profile.location_id) {
                const { data: location } = await supabase
                  .from('locations')
                  .select('name')
                  .eq('id', profile.location_id)
                  .maybeSingle();
                locationName = location?.name || null;
              }

              const authUserData: AuthUserData = {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                role: profile.role,
                locationId: profile.location_id,
                locationName: locationName
              };
              
              setAuthUser(authUserData);
              setIsAuthenticated(true);
            } else {
              console.error("Erro ao buscar perfil:", error);
              // Se não encontrar perfil, criar um básico com dados do usuário
              const basicUserData: AuthUserData = {
                id: session.user.id,
                name: session.user.email?.split('@')[0] || 'Usuário',
                email: session.user.email || '',
                role: 'user'
              };
              setAuthUser(basicUserData);
              setIsAuthenticated(true);
            }
          } catch (error) {
            console.error("Erro ao processar dados do usuário:", error);
            setAuthUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setAuthUser(null);
          setIsAuthenticated(false);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      // The onAuthStateChange will handle the session
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Tentando login com:", email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erro no login:", error);
        let errorMessage = "Erro ao autenticar";
        
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou senha incorretos";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
        }
        
        toast({
          variant: "destructive",
          title: "Erro ao autenticar",
          description: errorMessage
        });
        return false;
      }

      if (data.user) {
        console.log("Login bem-sucedido:", data.user);
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo(a)!`,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Exceção no login:", error);
      toast({
        variant: "destructive",
        title: "Erro ao autenticar",
        description: "Erro desconhecido durante o login"
      });
      return false;
    }
  };

  const logout = async () => {
    console.log("Fazendo logout...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro no logout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Erro ao fazer logout"
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Você saiu do sistema com sucesso"
      });
    }
    // The auth state change will handle clearing the state
  };

  // Don't render anything while loading
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
