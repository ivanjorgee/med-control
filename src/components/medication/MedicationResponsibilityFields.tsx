
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocations } from "@/hooks/use-locations";
import { User, MapPin } from "lucide-react";
import { MedicationFormValues } from "./MedicationForm";

interface MedicationResponsibilityFieldsProps {
  control: Control<MedicationFormValues>;
}

export const MedicationResponsibilityFields = ({ control }: MedicationResponsibilityFieldsProps) => {
  const { locations } = useLocations();
  
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um responsável" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="admin">Admin (Você)</SelectItem>
                <SelectItem value="joao">João Silva - Farmacêutico</SelectItem>
                <SelectItem value="maria">Maria Santos - Enfermeira</SelectItem>
                <SelectItem value="pedro">Pedro Costa - Técnico</SelectItem>
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
