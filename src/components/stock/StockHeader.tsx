
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface StockHeaderProps {
  selectedLocationName: string | null;
}

export function StockHeader({ selectedLocationName }: StockHeaderProps) {
  const { authUser } = useAuth();
  const isPharmacist = authUser?.role === "pharmacist";

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1C1C1C]">
          Estoque de Medicamentos
          {selectedLocationName && <span> - {selectedLocationName}</span>}
        </h1>
        <p className="text-[#1C1C1C]/70">
          {selectedLocationName 
            ? `Gerencie o estoque de medicamentos da unidade ${selectedLocationName}.`
            : "Gerencie o estoque de medicamentos da central."
          }
        </p>
      </div>
      {isPharmacist ? (
        <Button asChild className="bg-[#0052CC] hover:bg-[#0052CC]/90">
          <Link to="/medication-request">
            <Plus className="mr-2 h-4 w-4" /> Solicitar Medicamento
          </Link>
        </Button>
      ) : (
        <Button asChild className="bg-[#0052CC] hover:bg-[#0052CC]/90">
          <Link to="/medication-register">
            <Plus className="mr-2 h-4 w-4" /> Novo Medicamento
          </Link>
        </Button>
      )}
    </div>
  );
}
