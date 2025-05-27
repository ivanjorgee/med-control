
import { Badge } from "@/components/ui/badge";

interface Distribution {
  id: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  sourceLocation: string;
  destinationLocation: string;
  requestedBy: string;
  date: string;
  status: "pending" | "approved" | "delivered" | "cancelled";
}

interface DistributionStatsProps {
  distributions: Distribution[];
}

export const DistributionStats = ({ distributions }: DistributionStatsProps) => {
  const pendingCount = distributions.filter(d => d.status === "pending").length;
  const approvedCount = distributions.filter(d => d.status === "approved").length;
  const deliveredCount = distributions.filter(d => d.status === "delivered").length;

  return (
    <div className="flex gap-4 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Pendentes:</span>
        <Badge variant="secondary">{pendingCount}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Aprovadas:</span>
        <Badge variant="outline">{approvedCount}</Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Entregues:</span>
        <Badge variant="default">{deliveredCount}</Badge>
      </div>
    </div>
  );
};
