
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import PermissionToggle from "./PermissionToggle";
import { User, Location } from "@/types";

interface AuthorizedUsersTableProps {
  users: User[];
  locations: Location[];
  onRevokeAccess: (userId: string) => void;
  onTogglePermission: (userId: string, permissionType: 'distribution' | 'release' | 'stock', value: boolean) => void;
  getRoleName: (role: string) => string;
  getLocationName: (locationId: string) => string;
}

const AuthorizedUsersTable: React.FC<AuthorizedUsersTableProps> = ({
  users,
  locations,
  onRevokeAccess,
  onTogglePermission,
  getRoleName,
  getLocationName,
}) => {
  if (users.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={8} className="text-center py-10">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <ShieldCheck className="h-12 w-12 mb-2" />
            <h3 className="text-lg font-medium">Nenhum usuário autorizado encontrado</h3>
            <p>Autorize usuários para permitir acesso às funcionalidades restritas</p>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {users.map((user) => {
        const isAdmin = user.role === "admin";
        const isPharmacist = user.role === "pharmacist";
        const locationName = getLocationName(user.locationId);
        
        return (
          <TableRow key={user.id} className="hover:bg-muted/20">
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>{locationName}</TableCell>
            <TableCell>{getRoleName(user.role)}</TableCell>
            <TableCell>
              <Badge variant={user.status === "active" ? "default" : "secondary"}>
                {user.status === "active" ? "Ativo" : "Inativo"}
              </Badge>
            </TableCell>
            <TableCell>
              <PermissionToggle
                id={`dist-${user.id}`}
                defaultChecked={isAdmin}
                onToggle={(checked) => onTogglePermission(user.id, 'distribution', checked)}
                disabled={false}
              />
            </TableCell>
            <TableCell>
              <PermissionToggle
                id={`release-${user.id}`}
                defaultChecked={isPharmacist || isAdmin}
                onToggle={(checked) => onTogglePermission(user.id, 'release', checked)}
                disabled={false}
              />
            </TableCell>
            <TableCell>
              <PermissionToggle
                id={`stock-${user.id}`}
                defaultChecked={isAdmin}
                onToggle={(checked) => onTogglePermission(user.id, 'stock', checked)}
                disabled={false}
              />
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRevokeAccess(user.id)}
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Revogar Acesso
              </Button>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default AuthorizedUsersTable;
