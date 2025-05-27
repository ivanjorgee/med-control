
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RequestFormData } from "../MedicationRequestForm";

interface MedicationNameFieldProps {
  control: Control<RequestFormData>;
  medicationOptions: string[];
}

export const MedicationNameField = ({ control, medicationOptions }: MedicationNameFieldProps) => {
  return (
    <FormField
      control={control}
      name="medicationName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome do Medicamento</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="border-[#C4C4C4]">
                <SelectValue placeholder="Selecione o medicamento" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {medicationOptions.map((med) => (
                <SelectItem key={med} value={med}>
                  {med}
                </SelectItem>
              ))}
              <SelectItem value="other">Outro (não listado)</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
