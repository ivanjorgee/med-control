
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserSearch from "@/components/permissions/UserSearch";
import UserTabs from "@/components/permissions/UserTabs";
import PermissionTypesSection from "@/components/permissions/PermissionTypesSection";
import PermissionsHeader from "@/components/permissions/PermissionsHeader";
import { usePermissions } from "@/components/permissions/hooks/usePermissions";
import { getRoleName, getLocationName } from "@/components/permissions/utils/permissionUtils";

const PermissionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { isAdmin } = useAuth();
  const {
    users,
    locations,
    handleTogglePermission,
    handleGrantAccess,
    handleRevokeAccess
  } = usePermissions();

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

  // Get location name based on user's locationId
  const getLocationNameForUser = (locationId: string): string => {
    return getLocationName(locationId, locations);
  };
  
  return (
    <MainLayout>
      <PermissionsHeader />

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
            getLocationName={getLocationNameForUser}
          />
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default PermissionsPage;
