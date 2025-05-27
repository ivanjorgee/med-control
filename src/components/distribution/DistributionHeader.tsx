
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface DistributionHeaderProps {
  onAddClick: () => void;
}

export const DistributionHeader = ({ 
  onAddClick 
}: DistributionHeaderProps) => {
  const { toast } = useToast();
  const { authUser, isAdmin, isPharmacist } = useAuth();
  
  // Determina se o usuário pode adicionar distribuições
  const canAddDistribution = isAdmin || isPharmacist;

  const handleAddClick = () => {
    if (canAddDistribution) {
      onAddClick();
    } else {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para adicionar distribuições."
      });
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Distribuição de Medicamentos</h1>
        <p className="text-muted-foreground">
          {isAdmin 
            ? "Gerencie a distribuição de medicamentos para unidades de saúde."
            : isPharmacist 
            ? "Aprove e gerencie distribuições de medicamentos."
            : "Acompanhe o status das distribuições de medicamentos."}
        </p>
      </div>
      <Button onClick={handleAddClick}>
        <Plus className="mr-2 h-4 w-4" /> Nova Distribuição
      </Button>
    </div>
  );
};
