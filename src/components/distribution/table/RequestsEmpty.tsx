
import { AlertCircle } from "lucide-react";

export const RequestsEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center text-muted-foreground py-10">
      <AlertCircle className="h-12 w-12 mb-2" />
      <h3 className="text-lg font-medium">Nenhuma solicitação pendente</h3>
      <p>Não há solicitações de medicamentos para aprovar no momento</p>
    </div>
  );
};
