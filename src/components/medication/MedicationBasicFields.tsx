
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MedicationFormValues } from "./MedicationForm";

interface MedicationBasicFieldsProps {
  control: Control<MedicationFormValues>;
}

export const MedicationBasicFields = ({ control }: MedicationBasicFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Medicamento</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Dipirona 500mg" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categoria</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="analgesico">Analgésico</SelectItem>
                <SelectItem value="antibiotico">Antibiótico</SelectItem>
                <SelectItem value="antiinflamatorio">Anti-inflamatório</SelectItem>
                <SelectItem value="antialergico">Antialérgico</SelectItem>
                <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="col-span-1 md:col-span-2">
            <FormLabel>Descrição</FormLabel>
            <FormControl>
              <Input placeholder="Descrição ou indicação do medicamento" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
