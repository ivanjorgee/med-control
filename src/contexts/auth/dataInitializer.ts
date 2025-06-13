
import { DefaultUser, DefaultLocation } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const initializeDefaultData = async () => {
  console.log("🚀 Verificando inicialização do sistema...");
  
  try {
    // Verificar se já temos dados inicializados
    const setupComplete = localStorage.getItem("medcontrol-setup-complete");
    if (setupComplete === "true") {
      console.log("✅ Sistema já inicializado - verificando consistência dos dados");
      
      // Verificar se temos usuários no localStorage
      const localUsers = localStorage.getItem("users");
      const localLocations = localStorage.getItem("medcontrol_locations");
      
      if (localUsers && localLocations) {
        const users = JSON.parse(localUsers);
        const locations = JSON.parse(localLocations);
        
        if (users.length > 0 && locations.length > 0) {
          console.log("✅ Dados locais consistentes, sistema já configurado");
          return;
        }
      }
      
      console.log("⚠️ Setup marcado como completo mas dados inconsistentes, recarregando do banco...");
    }

    // Buscar dados do banco de dados para verificar se já existe configuração
    const { data: locations, error: locationsError } = await supabase
      .from('locations')
      .select('*')
      .limit(1);

    if (locationsError) {
      console.error("❌ Erro ao verificar unidades:", locationsError);
      return;
    }

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin')
      .limit(1);

    if (usersError) {
      console.error("❌ Erro ao verificar usuários admin:", usersError);
      return;
    }

    // Se temos dados no banco, sincronizar e marcar como configurado
    if (locations && locations.length > 0 && users && users.length > 0) {
      console.log("✅ Sistema já configurado no banco, sincronizando dados locais...");
      
      // Sincronizar todos os usuários
      const { data: allUsers, error: allUsersError } = await supabase
        .from('users')
        .select('*');

      if (!allUsersError && allUsers) {
        const formattedUsers = allUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          locationId: user.location_id,
          healthUnit: "Unidade Central",
          canApprove: user.role === "admin" || user.role === "pharmacist",
          createdAt: user.created_at || new Date().toISOString(),
          status: user.status,
          phone: ""
        }));

        localStorage.setItem("users", JSON.stringify(formattedUsers));
      }

      // Sincronizar todas as unidades
      const { data: allLocations, error: allLocationsError } = await supabase
        .from('locations')
        .select('*');

      if (!allLocationsError && allLocations) {
        const formattedLocations = allLocations.map(location => ({
          id: location.id,
          name: location.name,
          type: location.type,
          address: location.address || "",
          city: location.city || "",
          state: location.state || "",
          phone: location.phone || "",
          email: location.email || "",
          coordinator: location.coordinator || "",
          createdAt: location.created_at,
          status: location.status,
          coordinatorId: ""
        }));

        localStorage.setItem("medcontrol_locations", JSON.stringify(formattedLocations));
      }

      // Marcar como configurado
      localStorage.setItem("medcontrol-setup-complete", "true");
      console.log("✅ Sincronização concluída, sistema configurado");
      return;
    }

    console.log("⚠️ Sistema ainda não foi configurado");
    
  } catch (error) {
    console.error("❌ Erro ao verificar inicialização:", error);
  }
};
