
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { User, Location } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import UserSearch from "@/components/permissions/UserSearch";
import UserTabs from "@/components/permissions/UserTabs";
import PermissionTypesSection from "@/components/permissions/PermissionTypesSection";

const PermissionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const { toast } = useToast();
  const { authUser, isAdmin } = useAuth();
  
  // Load users and locations from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    const storedLocations = localStorage.getItem("medcontrol_locations");
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    if (storedLocations) {
      setLocations(JSON.parse(storedLocations));
    }
  }, []);

  // Verificar se o usuário é administrador
  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-600">Acesso Negado</h2>
            <p className="text-gray-500 mt-2">Apenas administradores podem acessar o controle de permissões.</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Filter authorized and unauthorized users
  const authorizedUsers = users.filter((user) => 
    user.canApprove && 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const unauthorizedUsers = users.filter((user) => 
    !user.canApprove && 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleName = (role: string) => {
    switch (role) {
      case "admin": return "Administração";
      case "pharmacist": return "Farmácia";
      case "distributor": return "Distribuição";
      case "health_unit": return "Unidade de Saúde";
      default: return "Usuário";
    }
  };

  // Get location name based on user's locationId
  const getLocationName = (locationId: string): string => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      return location.name;
    }
    return "Não associado";
  };
  
  // Function to update user permissions
  const handleTogglePermission = (userId: string, permissionType: 'distribution' | 'release' | 'stock', value: boolean) => {
    const user = users.find(u => u.id === userId);
    
    // Validações de permissão baseadas no role
    if (permissionType === 'distribution' && value) {
      // Apenas administradores podem ter permissão de distribuição entre unidades
      if (user && user.role !== "admin") {
        toast({
          title: "Permissão restrita",
          description: "Apenas administradores podem distribuir medicamentos entre unidades. Farmacêuticos dispensam para pacientes.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (permissionType === 'stock' && value) {
      // Apenas administradores podem ter permissão de ajuste de estoque
      if (user && user.role !== "admin") {
        toast({
          title: "Permissão restrita",
          description: "Apenas administradores podem ter permissão de ajuste de estoque.",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Update user with new permission
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const updatedUser = { ...user };
        
        if (permissionType === 'distribution') {
          updatedUser.canApprove = value;
        }
        
        return updatedUser;
      }
      return user;
    });
    
    // Update state and localStorage
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    // Show confirmation toast
    toast({
      title: value ? "Permissão concedida" : "Permissão revogada",
      description: `A permissão de ${
        permissionType === 'distribution' ? 'distribuição' : 
        permissionType === 'release' ? 'liberação' : 
        'ajuste de estoque'
      } foi ${value ? 'concedida' : 'revogada'}.`
    });
  };
  
  // Function to grant general access (move from unauthorized to authorized)
  const handleGrantAccess = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, canApprove: true };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    toast({
      title: "Acesso concedido",
      description: "O usuário agora tem permissões de aprovação."
    });
  };
  
  // Function to revoke general access
  const handleRevokeAccess = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, canApprove: false };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    toast({
      title: "Acesso revogado",
      description: "As permissões de aprovação foram removidas."
    });
  };
  
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle de Permissões</h1>
          <p className="text-muted-foreground">
            Gerencie quem pode aprovar e liberar medicamentos.
          </p>
        </div>
      </div>

      <PermissionTypesSection />

      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-primary">Usuários e Permissões</CardTitle>
            <UserSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
        </CardHeader>
        <CardContent>
          <UserTabs
            authorizedUsers={authorizedUsers}
            unauthorizedUsers={unauthorizedUsers}
            locations={locations}
            onGrantAccess={handleGrantAccess}
            onRevokeAccess={handleRevokeAccess}
            onTogglePermission={handleTogglePermission}
            getRoleName={getRoleName}
            getLocationName={getLocationName}
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default PermissionsPage;
