
import { AuthUserData } from "./types";
import { UserRole } from "@/types";
import { initializeDefaultData, getLocationName } from "./authUtils";

export class AuthService {
  static async authenticateUser(email: string, password: string): Promise<{ success: boolean; user?: AuthUserData; error?: string }> {
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
        return { success: false, error: "Erro ao inicializar usuários do sistema." };
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
      return { success: false, error: "Erro ao carregar dados de usuários." };
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
      return { success: false, error: "Email ou senha incorretos." };
    }
    
    console.log("✅ Usuário encontrado:", user);
    
    if (user.status === "inactive") {
      console.log("❌ Usuário inativo");
      return { success: false, error: "Este usuário está desativado. Contate um administrador." };
    }
    
    // Buscar nome da unidade
    const locationName = getLocationName(user.locationId);
    
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
      return { success: false, error: "Erro ao salvar dados de autenticação." };
    }
    
    console.log("=== LOGIN CONCLUÍDO COM SUCESSO ===");
    return { success: true, user: authUserData };
  }

  static logout(): void {
    console.log("Fazendo logout...");
    localStorage.removeItem("medcontrol-auth");
    localStorage.removeItem("medcontrol-user");
    console.log("Logout concluído");
  }

  static getStoredAuth(): { isAuthenticated: boolean; user: AuthUserData | null } {
    const auth = localStorage.getItem("medcontrol-auth");
    const userData = localStorage.getItem("medcontrol-user");
    
    console.log("Verificando autenticação existente...", { auth, userData });
    
    if (auth === "true" && userData) {
      try {
        const user = JSON.parse(userData) as AuthUserData;
        console.log("Usuário autenticado recuperado:", user);
        return { isAuthenticated: true, user };
      } catch (error) {
        console.error("Erro ao recuperar dados do usuário:", error);
        AuthService.logout(); // Se os dados forem inválidos, faz logout
        return { isAuthenticated: false, user: null };
      }
    }
    
    return { isAuthenticated: false, user: null };
  }
}
