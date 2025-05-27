
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, ShieldX } from "lucide-react";
import AuthorizedUsersTable from "./AuthorizedUsersTable";
import UnauthorizedUsersTable from "./UnauthorizedUsersTable";
import { User, Location } from "@/types";

interface UserTabsProps {
  authorizedUsers: User[];
  unauthorizedUsers: User[];
  locations: Location[];
  onGrantAccess: (userId: string) => void;
  onRevokeAccess: (userId: string) => void;
  onTogglePermission: (userId: string, permissionType: 'distribution' | 'release' | 'stock', value: boolean) => void;
  getRoleName: (role: string) => string;
  getLocationName: (locationId: string) => string;
}

const UserTabs: React.FC<UserTabsProps> = ({
  authorizedUsers,
  unauthorizedUsers,
  locations,
  onGrantAccess,
  onRevokeAccess,
  onTogglePermission,
  getRoleName,
  getLocationName,
}) => {
  return (
    <Tabs defaultValue="authorized">
      <TabsList className="mb-4 bg-muted/50">
        <TabsTrigger value="authorized" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center">
          <ShieldCheck className="h-4 w-4 mr-2" /> 
          Autorizados ({authorizedUsers.length})
        </TabsTrigger>
        <TabsTrigger value="unauthorized" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center">
          <ShieldX className="h-4 w-4 mr-2" /> 
          Não Autorizados ({unauthorizedUsers.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="authorized">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Usuário</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Distribuição</TableHead>
              <TableHead>Liberação</TableHead>
              <TableHead>Ajuste de Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AuthorizedUsersTable
              users={authorizedUsers}
              locations={locations}
              onRevokeAccess={onRevokeAccess}
              onTogglePermission={onTogglePermission}
              getRoleName={getRoleName}
              getLocationName={getLocationName}
            />
          </TableBody>
        </Table>
      </TabsContent>
      
      <TabsContent value="unauthorized">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Usuário</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <UnauthorizedUsersTable
              users={unauthorizedUsers}
              locations={locations}
              onGrantAccess={onGrantAccess}
              getRoleName={getRoleName}
              getLocationName={getLocationName}
            />
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  );
};

export default UserTabs;
