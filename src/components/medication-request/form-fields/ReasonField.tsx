
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RequestFormData } from "../MedicationRequestForm";

interface ReasonFieldProps {
  control: Control<RequestFormData>;
}

export const ReasonField = ({ control }: ReasonFieldProps) => {
  return (
    <FormField
      control={control}
      name="reason"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Justificativa</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Explique o motivo da solicitação" 
              className="resize-none border-[#C4C4C4] min-h-[120px]"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
