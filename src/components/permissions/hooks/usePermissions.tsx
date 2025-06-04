
import { useState, useEffect } from "react";
import { User, Location } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const usePermissions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const { toast } = useToast();
  const { authUser } = useAuth();
  
  // Load users and locations from localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    const storedLocations = localStorage.getItem("medcontrol_locations");
    
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      console.log("=== USUÁRIOS CARREGADOS ===");
      console.log("Total de usuários:", parsedUsers.length);
      console.log("Usuários:", parsedUsers);
      setUsers(parsedUsers);
    }
    
    if (storedLocations) {
      const parsedLocations = JSON.parse(storedLocations);
      console.log("=== LOCALIZAÇÕES CARREGADAS ===");
      console.log("Total de localizações:", parsedLocations.length);
      setLocations(parsedLocations);
    }
  }, []);

  // Function to update user permissions
  const handleTogglePermission = (userId: string, permissionType: 'distribution' | 'release' | 'stock', value: boolean) => {
    console.log("=== ALTERANDO PERMISSÃO ===");
    console.log("Usuário ID:", userId);
    console.log("Tipo de permissão:", permissionType);
    console.log("Novo valor:", value);
    
    const user = users.find(u => u.id === userId);
    console.log("Usuário encontrado:", user);
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não encontrado.",
        variant: "destructive"
      });
      return;
    }

    // Para administradores, todas as permissões são permitidas
    if (authUser?.role !== "admin") {
      toast({
        title: "Acesso negado",
        description: "Apenas administradores podem alterar permissões.",
        variant: "destructive"
      });
      return;
    }
    
    // Update user with new permission
    const updatedUsers = users.map(currentUser => {
      if (currentUser.id === userId) {
        const updatedUser = { ...currentUser };
        
        // Criar objeto de permissões se não existir
        if (!updatedUser.permissions) {
          updatedUser.permissions = {
            canDistribute: false,
            canRelease: false,
            canAdjustStock: false
          };
        }
        
        // Atualizar a permissão específica
        switch (permissionType) {
          case 'distribution':
            updatedUser.permissions.canDistribute = value;
            updatedUser.canApprove = value; // Manter compatibilidade
            break;
          case 'release':
            updatedUser.permissions.canRelease = value;
            break;
          case 'stock':
            updatedUser.permissions.canAdjustStock = value;
            break;
        }
        
        console.log("Usuário atualizado:", updatedUser);
        return updatedUser;
      }
      return currentUser;
    });
    
    // Update state and localStorage
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    
    console.log("=== PERMISSÕES SALVAS ===");
    console.log("Usuários atualizados salvos no localStorage");
    
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
    console.log("=== CONCEDENDO ACESSO GERAL ===");
    console.log("Usuário ID:", userId);
    
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const updatedUser = { 
          ...user, 
          canApprove: true,
          permissions: {
            canDistribute: user.role === "admin",
            canRelease: user.role === "pharmacist" || user.role === "admin",
            canAdjustStock: user.role === "admin"
          }
        };
        console.log("Usuário com acesso concedido:", updatedUser);
        return updatedUser;
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
    console.log("=== REVOGANDO ACESSO GERAL ===");
    console.log("Usuário ID:", userId);
    
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        const updatedUser = { 
          ...user, 
          canApprove: false,
          permissions: {
            canDistribute: false,
            canRelease: false,
            canAdjustStock: false
          }
        };
        console.log("Usuário com acesso revogado:", updatedUser);
        return updatedUser;
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

  return {
    users,
    locations,
    handleTogglePermission,
    handleGrantAccess,
    handleRevokeAccess
  };
};
