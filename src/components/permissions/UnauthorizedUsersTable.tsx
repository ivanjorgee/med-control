
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";
import { User, Location } from "@/types";

interface UnauthorizedUsersTableProps {
  users: User[];
  locations: Location[];
  onGrantAccess: (userId: string) => void;
  getRoleName: (role: string) => string;
  getLocationName: (locationId: string) => string;
}

const UnauthorizedUsersTable: React.FC<UnauthorizedUsersTableProps> = ({
  users,
  locations,
  onGrantAccess,
  getRoleName,
  getLocationName,
}) => {
  if (users.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center py-10">
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <ShieldX className="h-12 w-12 mb-2" />
            <h3 className="text-lg font-medium">Nenhum usuário sem autorização encontrado</h3>
            <p>Todos os usuários já possuem permissões necessárias</p>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {users.map((user) => {
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
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onGrantAccess(user.id)}
                className="text-green-500 border-green-200 hover:bg-green-50 hover:text-green-600"
              >
                Conceder Acesso
              </Button>
            </TableCell>
          </TableRow>
        )}
      )}
    </>
  );
};

export default UnauthorizedUsersTable;
