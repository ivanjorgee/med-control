
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RequestFormData } from "../MedicationRequestForm";

interface UrgencyFieldProps {
  control: Control<RequestFormData>;
}

export const UrgencyField = ({ control }: UrgencyFieldProps) => {
  return (
    <FormField
      control={control}
      name="urgency"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nível de Urgência</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="border-[#C4C4C4]">
                <SelectValue placeholder="Selecione o nível de urgência" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
