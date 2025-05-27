
import { NewUserDialog } from "@/components/users/NewUserDialog";
import { User } from "@/types";

interface UsersHeaderProps {
  onUserCreated: (newUser: User) => void;
}

export function UsersHeader({ onUserCreated }: UsersHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuários do Sistema</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários e permissões de acesso ao sistema.
        </p>
      </div>
      <NewUserDialog onUserCreated={onUserCreated} />
    </div>
  );
}
