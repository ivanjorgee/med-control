
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
          // Fetch user profile from database
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !error) {
            // Fetch location name if location_id exists
            let locationName = null;
            if (profile.location_id) {
              const { data: location } = await supabase
                .from('locations')
                .select('name')
                .eq('id', profile.location_id)
                .single();
              locationName = location?.name;
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
            console.error("Error fetching profile:", error);
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
    console.log("Attempting login with:", email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: "Erro ao autenticar",
          description: error.message === "Invalid login credentials" 
            ? "Email ou senha incorretos" 
            : error.message
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Login bem-sucedido",
          description: `Bem-vindo(a)!`,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login exception:", error);
      toast({
        variant: "destructive",
        title: "Erro ao autenticar",
        description: "Erro desconhecido durante o login"
      });
      return false;
    }
  };

  const logout = async () => {
    console.log("Logging out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
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
