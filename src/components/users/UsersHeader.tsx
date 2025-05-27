
import { NewUserDialog } from "@/components/users/NewUserDialog";
import { User } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface UsersHeaderProps {
  onUserCreated: (user: User) => void;
}

export function UsersHeader({ onUserCreated }: UsersHeaderProps) {
  const { isAdmin } = useAuth();

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
        <p className="text-muted-foreground">
          Gerencie os usuários do sistema
        </p>
      </div>
      {isAdmin && <NewUserDialog onUserCreated={onUserCreated} />}
    </div>
  );
}
