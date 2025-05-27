
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocations } from "@/hooks/use-locations";
import { User, MapPin } from "lucide-react";
import { MedicationFormValues } from "./MedicationForm";
import { useState, useEffect } from "react";
import { User as UserType } from "@/types";

interface MedicationResponsibilityFieldsProps {
  control: Control<MedicationFormValues>;
}

export const MedicationResponsibilityFields = ({ control }: MedicationResponsibilityFieldsProps) => {
  const { locations } = useLocations();
  const [users, setUsers] = useState<UserType[]>([]);
  
  // Load users from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      // Filter only active users
      setUsers(parsedUsers.filter((user: UserType) => user.status === "active"));
    }
  }, []);

  // Function to get user role label in Portuguese
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "pharmacist":
        return "Farmacêutico";
      case "distributor":
        return "Distribuidor";
      case "user":
        return "Usuário";
      case "health_unit":
        return "Unidade de Saúde";
      default:
        return role;
    }
  };
  
  return (
    <>
      <FormField
        control={control}
        name="locationId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unidade de Saúde</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma unidade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Unidade onde o medicamento está localizado
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="responsiblePerson"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Responsável</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um responsável" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.name}>
                    {user.name} - {getRoleLabel(user.role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription className="flex items-center gap-1">
              <User className="h-3 w-3" /> Responsável pela entrada do medicamento
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
