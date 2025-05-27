
import { Button } from "@/components/ui/button";
import { Check, Truck } from "lucide-react";

interface DistributionActionsProps {
  distributionId: string;
  status: "pending" | "approved" | "delivered" | "cancelled";
  isAdmin: boolean;
  onApprove: (id: string) => void;
  onDeliver: (id: string) => void;
}

export const DistributionActions = ({
  distributionId,
  status,
  isAdmin,
  onApprove,
  onDeliver
}: DistributionActionsProps) => {
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
      {isAdmin && status === "approved" && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDeliver(distributionId)}
        >
          <Truck className="h-4 w-4 mr-1" /> Entregar
        </Button>
      )}
      <Button variant="ghost" size="sm">
        Detalhes
      </Button>
    </div>
  );
};
