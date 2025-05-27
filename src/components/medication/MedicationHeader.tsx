
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface MedicationHeaderProps {
  title: string;
  description: string;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export const MedicationHeader = ({ 
  title, 
  description, 
  isSubmitting, 
  onSubmit 
}: MedicationHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1C1C1C]">{title}</h1>
        <p className="text-[#1C1C1C]/70">
          {description}
        </p>
      </div>
      <Button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="bg-[#0052CC] hover:bg-[#0052CC]/90"
      >
        <Save className="mr-2 h-4 w-4" /> 
        {isSubmitting ? "Salvando..." : "Salvar Medicamento"}
      </Button>
    </div>
  );
};
