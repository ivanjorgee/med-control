
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
  
  // Determina se o usuário pode solicitar/criar distribuições
  const canAddDistribution = isAdmin || isPharmacist;

  const handleAddClick = () => {
    if (canAddDistribution) {
      onAddClick();
    } else {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para solicitar distribuições."
      });
    }
  };

  const getDescription = () => {
    if (isAdmin) {
      return "Gerencie a distribuição de medicamentos entre unidades de saúde.";
    } else if (isPharmacist) {
      return "Solicite medicamentos para sua unidade e confirme entregas recebidas.";
    } else {
      return "Acompanhe o status das distribuições de medicamentos.";
    }
  };

  const getButtonText = () => {
    if (isAdmin) {
      return "Nova Distribuição";
    } else if (isPharmacist) {
      return "Solicitar Medicamento";
    } else {
      return "Nova Distribuição";
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Distribuição de Medicamentos</h1>
        <p className="text-muted-foreground">
          {getDescription()}
        </p>
      </div>
      <Button onClick={handleAddClick}>
        <Plus className="mr-2 h-4 w-4" /> {getButtonText()}
      </Button>
    </div>
  );
};
