
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
