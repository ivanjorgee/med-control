
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
