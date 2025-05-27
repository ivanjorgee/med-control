
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, UserIcon, UsersIcon } from "lucide-react";
import { EditUserDialog } from "@/components/users/EditUserDialog";
import { ResetPasswordDialog } from "@/components/users/ResetPasswordDialog";
import { User, UserRole, Location } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";

interface UsersTableProps {
  users: User[];
  locations: Location[];
  onDeleteUser: (userId: string) => void;
  onUpdateUser: (updatedUser: User) => void;
}

export function UsersTable({ users, locations, onDeleteUser, onUpdateUser }: UsersTableProps) {
  const { isAdmin } = useAuth();

  // Helper functions
  const getLocationName = (locationId: string): string => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      return location.name;
    }
    return "Não associado";
  };
  
  const getRoleName = (role: UserRole) => {
    switch(role) {
      case "admin": return "Administração";
      case "pharmacist": return "Farmácia";
      case "distributor": return "Distribuição";
      case "health_unit": return "Unidade de Saúde";
      default: return "Usuário";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handlePasswordReset = (userId: string, newPassword: string) => {
    const userToUpdate = users.find(user => user.id === userId);
    if (userToUpdate) {
      const updatedUser = { ...userToUpdate, password: newPassword };
      onUpdateUser(updatedUser);
    }
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuário</TableHead>
          <TableHead>Função</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead>Contato</TableHead>
          <TableHead>Permissão de Aprovação</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-10">
              <div className="flex flex-col items-center justify-center text-muted-foreground">
                <UsersIcon className="h-12 w-12 mb-2" />
                <h3 className="text-lg font-medium">Nenhum usuário cadastrado</h3>
                <p>Use o botão "Novo Usuário" para adicionar usuários ao sistema</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="bg-muted h-9 w-9 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getRoleName(user.role)}</Badge>
              </TableCell>
              <TableCell>{getLocationName(user.locationId)}</TableCell>
              <TableCell>{user.phone || "Não informado"}</TableCell>
              <TableCell>{user.canApprove ? "Sim" : "Não"}</TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell>
                <Badge 
                  variant={user.status === "active" ? "success" : "secondary"}
                >
                  {user.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {isAdmin && (
                    <EditUserDialog user={user} onUserUpdated={onUpdateUser} />
                  )}
                  {isAdmin && (
                    <ResetPasswordDialog user={user} onPasswordReset={handlePasswordReset} />
                  )}
                  {isAdmin && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o usuário <strong>{user.name}</strong>? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => onDeleteUser(user.id)}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
