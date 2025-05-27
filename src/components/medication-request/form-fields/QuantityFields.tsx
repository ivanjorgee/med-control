
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RequestFormData } from "../MedicationRequestForm";

interface QuantityFieldsProps {
  control: Control<RequestFormData>;
}

export const QuantityFields = ({ control }: QuantityFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantidade</FormLabel>
            <FormControl>
              <Input type="number" className="border-[#C4C4C4]" {...field} />
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
            <FormLabel>Unidade</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="border-[#C4C4C4]">
                  <SelectValue placeholder="Unidade" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="unidades">Unidades</SelectItem>
                <SelectItem value="caixas">Caixas</SelectItem>
                <SelectItem value="frascos">Frascos</SelectItem>
                <SelectItem value="ampolas">Ampolas</SelectItem>
                <SelectItem value="comprimidos">Comprimidos</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
