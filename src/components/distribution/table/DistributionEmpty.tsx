
import { PackageCheck } from "lucide-react";

export const DistributionEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center text-muted-foreground py-10">
      <PackageCheck className="h-12 w-12 mb-2" />
      <h3 className="text-lg font-medium">Nenhuma distribuição encontrada</h3>
      <p>Tente ajustar os filtros ou crie uma nova distribuição</p>
    </div>
  );
};
