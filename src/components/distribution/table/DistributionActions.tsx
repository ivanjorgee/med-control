
import { Button } from "@/components/ui/button";
import { Check, Truck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DistributionActionsProps {
  distributionId: string;
  status: "pending" | "approved" | "delivered" | "cancelled";
  isAdmin: boolean;
  onApprove: (id: string) => void;
  onDeliver: (id: string) => void;
  locationId?: string;
}

export const DistributionActions = ({
  distributionId,
  status,
  isAdmin,
  onApprove,
  onDeliver,
  locationId
}: DistributionActionsProps) => {
  const { authUser, isPharmacist } = useAuth();
  
  // Verifica se o farmacêutico pode confirmar entrega desta distribuição
  const canConfirmDelivery = isAdmin || (isPharmacist && locationId === authUser?.locationId);

  return (
    <div className="flex justify-end gap-2">
      {isAdmin && status === "pending" && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onApprove(distributionId)}
        >
          <Check className="h-4 w-4 mr-1" /> Aprovar
        </Button>
      )}
      {canConfirmDelivery && status === "approved" && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDeliver(distributionId)}
        >
          <Truck className="h-4 w-4 mr-1" /> Confirmar Entrega
        </Button>
      )}
      <Button variant="ghost" size="sm">
        Detalhes
      </Button>
    </div>
  );
};
