
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { MedicationFormValues } from "./MedicationForm";

interface MedicationDetailsFieldsProps {
  control: Control<MedicationFormValues>;
}

export const MedicationDetailsFields = ({ control }: MedicationDetailsFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="batchNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número do Lote</FormLabel>
            <FormControl>
              <Input placeholder="Ex: ABC12345" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="expirationDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Validade</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "dd/MM/yyyy")
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              O sistema irá alertar sobre medicamentos próximos ao vencimento.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="manufacturer"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fabricante</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Laboratório Exemplo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
