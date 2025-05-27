
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MedicationFormValues } from "./MedicationForm";

interface MedicationQuantityFieldsProps {
  control: Control<MedicationFormValues>;
}

export const MedicationQuantityFields = ({ control }: MedicationQuantityFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantidade</FormLabel>
            <FormControl>
              <Input type="number" min="0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="measureUnit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unidade de Medida</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma unidade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="comprimido">Comprimido</SelectItem>
                <SelectItem value="caixa">Caixa</SelectItem>
                <SelectItem value="ampola">Ampola</SelectItem>
                <SelectItem value="frasco">Frasco</SelectItem>
                <SelectItem value="ml">ML</SelectItem>
                <SelectItem value="g">Gramas</SelectItem>
                <SelectItem value="unidade">Unidade</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="minQuantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantidade Mínima</FormLabel>
            <FormControl>
              <Input type="number" min="0" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
