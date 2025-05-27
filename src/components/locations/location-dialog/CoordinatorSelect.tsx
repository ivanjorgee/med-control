
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/types";

interface CoordinatorSelectProps {
  value: string;
  onChange: (value: string) => void;
  activeUsers: User[];
}

export function CoordinatorSelect({ value, onChange, activeUsers }: CoordinatorSelectProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      <Label htmlFor="coordinator">Responsável</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
      >
        <SelectTrigger id="coordinator">
          <SelectValue placeholder="Selecione um usuário" />
        </SelectTrigger>
        <SelectContent>
          {activeUsers.map((user) => (
            <SelectItem key={user.id} value={user.name}>
              {user.name} ({user.role === "admin" ? "Administrador" : 
                user.role === "pharmacist" ? "Farmacêutico" : 
                user.role === "distributor" ? "Distribuidor" : "Unidade de Saúde"})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
