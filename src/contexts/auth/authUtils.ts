
import { DefaultUser, DefaultLocation } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const initializeDefaultData = async () => {
  console.log("🚀 Inicializando dados padrão do sistema...");
  
  try {
    // Verificar se já temos dados inicializados
    const setupComplete = localStorage.getItem("medcontrol-setup-complete");
    if (setupComplete === "true") {
      console.log("✅ Sistema já inicializado");
      return;
    }

    // Buscar a unidade central do Supabase
    const { data: locations, error: locationsError } = await supabase
      .from('locations')
      .select('*')
      .eq('name', 'Secretaria Municipal de Saúde - Unidade Central')
      .limit(1);

    if (locationsError) {
      console.error("❌ Erro ao buscar unidade central:", locationsError);
      return;
    }

    if (!locations || locations.length === 0) {
      console.warn("⚠️ Unidade central não encontrada no banco");
      return;
    }

    const centralLocation = locations[0];
    console.log("✅ Unidade central encontrada:", centralLocation);

    // Verificar se já existe usuário admin no banco
    const { data: existingUsers, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'smss.sjapa@gmail.com');

    if (usersError) {
      console.error("❌ Erro ao verificar usuários:", usersError);
      return;
    }

    let adminUser;
    if (!existingUsers || existingUsers.length === 0) {
      // Criar usuário administrador no banco
      const { data: newAdmin, error: createError } = await supabase
        .from('users')
        .insert([{
          name: 'Administrador do Sistema',
          email: 'smss.sjapa@gmail.com',
          password: 'admin123',
          role: 'admin',
          location_id: centralLocation.id,
          status: 'active'
        }])
        .select()
        .single();

      if (createError) {
        console.error("❌ Erro ao criar usuário admin:", createError);
        return;
      }

      adminUser = newAdmin;
      console.log("✅ Usuário administrador criado no banco");
    } else {
      adminUser = existingUsers[0];
      console.log("✅ Usuário administrador já existe no banco");
    }

    // Sincronizar com localStorage para compatibilidade
    const defaultUsers: DefaultUser[] = [{
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      password: adminUser.password,
      role: adminUser.role as any,
      locationId: adminUser.location_id,
      status: adminUser.status
    }];

    const defaultLocations: DefaultLocation[] = [{
      id: centralLocation.id,
      name: centralLocation.name,
      type: centralLocation.type,
      address: centralLocation.address || "",
      city: centralLocation.city || "",
      state: centralLocation.state || "",
      phone: centralLocation.phone || "",
      email: centralLocation.email || "",
      coordinator: centralLocation.coordinator || "",
      createdAt: centralLocation.created_at,
      status: centralLocation.status,
      coordinatorId: adminUser.id
    }];

    // Salvar no localStorage
    localStorage.setItem("users", JSON.stringify(defaultUsers));
    localStorage.setItem("medcontrol_locations", JSON.stringify(defaultLocations));
    localStorage.setItem("medcontrol-setup-complete", "true");

    console.log("✅ Dados padrão inicializados com sucesso!");
    
  } catch (error) {
    console.error("❌ Erro ao inicializar dados padrão:", error);
  }
};

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
        phone: user.phone || ""
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

export const getLocationName = (locationId: string): string => {
  try {
    const locationsData = localStorage.getItem("medcontrol_locations");
    if (!locationsData) return "Unidade não encontrada";
    
    const locations = JSON.parse(locationsData);
    const location = locations.find((loc: any) => loc.id === locationId);
    
    return location ? location.name : "Unidade não encontrada";
  } catch (error) {
    console.error("Erro ao buscar nome da unidade:", error);
    return "Erro ao carregar unidade";
  }
};
