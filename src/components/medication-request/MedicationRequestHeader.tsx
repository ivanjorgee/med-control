
import { Package } from "lucide-react";

interface MedicationRequestHeaderProps {
  title?: string;
  description?: string;
}

export const MedicationRequestHeader = ({ 
  title = "Solicitar Medicamento", 
  description = "Preencha o formulário para solicitar medicamentos ao administrador."
}: MedicationRequestHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight text-[#1C1C1C]">{title}</h1>
      <p className="text-[#1C1C1C]/70">
        {description}
      </p>
    </div>
  );
};
