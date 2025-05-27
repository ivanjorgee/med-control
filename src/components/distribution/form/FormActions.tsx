
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isAdmin: boolean;
}

export const FormActions = ({
  onCancel,
  onSubmit,
  isAdmin
}: FormActionsProps) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button variant="outline" onClick={onCancel}>Cancelar</Button>
      <Button onClick={onSubmit}>
        {isAdmin ? "Criar e Aprovar Distribuição" : "Solicitar Distribuição"}
      </Button>
    </div>
  );
};
