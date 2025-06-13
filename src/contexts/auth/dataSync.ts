
import { supabase } from "@/integrations/supabase/client";

export const forceUpdateUserData = async () => {
  console.log("🔄 Atualizando dados de usuários...");
  
  try {
    // Buscar usuários do banco
    const { data: dbUsers, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error("❌ Erro ao buscar usuários do banco:", error);
      return;
    }

    if (dbUsers && dbUsers.length > 0) {
      const formattedUsers = dbUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        locationId: user.location_id,
        healthUnit: "Unidade Central", // Será atualizado pela função getLocationName
        canApprove: user.role === "admin" || user.role === "pharmacist",
        createdAt: user.created_at || new Date().toISOString(),
        status: user.status,
        phone: "" // Campo phone não existe na tabela users do banco, definindo como string vazia
      }));

      localStorage.setItem("users", JSON.stringify(formattedUsers));
      console.log("✅ Dados de usuários atualizados:", formattedUsers);
    }
  } catch (error) {
    console.error("❌ Erro ao atualizar dados de usuários:", error);
  }
};

export const forceUpdateLocationData = async () => {
  console.log("🔄 Atualizando dados de unidades...");
  
  try {
    // Buscar unidades do banco
    const { data: dbLocations, error } = await supabase
      .from('locations')
      .select('*');

    if (error) {
      console.error("❌ Erro ao buscar unidades do banco:", error);
      return;
    }

    if (dbLocations && dbLocations.length > 0) {
      const formattedLocations = dbLocations.map(location => ({
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
        coordinatorId: "" // Será definido conforme necessário
      }));

      localStorage.setItem("medcontrol_locations", JSON.stringify(formattedLocations));
      console.log("✅ Dados de unidades atualizados:", formattedLocations);
    }
  } catch (error) {
    console.error("❌ Erro ao atualizar dados de unidades:", error);
  }
};
