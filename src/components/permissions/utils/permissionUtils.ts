
export const getRoleName = (role: string): string => {
  switch (role) {
    case "admin": return "Administração";
    case "pharmacist": return "Farmácia";
    case "distributor": return "Distribuição";
    case "health_unit": return "Unidade de Saúde";
    default: return "Usuário";
  }
};

export const getLocationName = (locationId: string, locations: any[]): string => {
  const location = locations.find(loc => loc.id === locationId);
  if (location) {
    return location.name;
  }
  return "Não associado";
};
