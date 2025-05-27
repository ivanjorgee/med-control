
import { DEFAULT_USERS, DEFAULT_LOCATIONS } from "./defaultData";

export const initializeDefaultData = () => {
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

export const resetDefaultData = () => {
  console.log("=== RESETANDO DADOS PADRÃO ===");
  localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
  localStorage.setItem("medcontrol_locations", JSON.stringify(DEFAULT_LOCATIONS));
  localStorage.setItem("medcontrol-setup-complete", "true");
  console.log("✅ Dados resetados com sucesso");
};

export const forceUpdateUserData = () => {
  console.log("=== FORÇANDO ATUALIZAÇÃO DOS DADOS DE USUÁRIO ===");
  localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
  console.log("✅ Dados de usuário atualizados com a versão mais recente");
};

export const forceUpdateLocationData = () => {
  console.log("=== FORÇANDO ATUALIZAÇÃO DOS DADOS DE LOCALIZAÇÃO ===");
  localStorage.setItem("medcontrol_locations", JSON.stringify(DEFAULT_LOCATIONS));
  console.log("✅ Dados de localização atualizados com a versão mais recente");
};

export const getLocationName = (locationId: string): string => {
  const storedLocations = localStorage.getItem("medcontrol_locations");
  let locationName = "Unidade Central de Saúde";
  
  if (storedLocations) {
    try {
      const locations = JSON.parse(storedLocations);
      const location = locations.find((loc: any) => loc.id === locationId);
      if (location) {
        locationName = location.name;
      }
      console.log("Localização encontrada:", locationName);
    } catch (error) {
      console.error("Erro ao buscar localização:", error);
    }
  }
  
  return locationName;
};
