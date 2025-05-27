
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import { DistributionActions } from "./DistributionActions";

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
  locationId?: string;
}

interface DistributionRowProps {
  distribution: Distribution;
  onApprove: (id: string) => void;
  onDeliver: (id: string) => void;
  isAdmin: boolean;
}

export const DistributionRow = ({ 
  distribution, 
  onApprove, 
  onDeliver, 
  isAdmin 
}: DistributionRowProps) => {
  return (
    <TableRow key={distribution.id}>
      <TableCell className="font-medium">{distribution.medicineName}</TableCell>
      <TableCell>{distribution.batchNumber}</TableCell>
      <TableCell>{distribution.quantity}</TableCell>
      <TableCell>{distribution.sourceLocation}</TableCell>
      <TableCell>{distribution.destinationLocation}</TableCell>
      <TableCell>{distribution.requestedBy}</TableCell>
      <TableCell>{format(new Date(distribution.date), "dd/MM/yyyy")}</TableCell>
      <TableCell>
        <StatusBadge status={distribution.status} />
      </TableCell>
      <TableCell className="text-right">
        <DistributionActions
          distributionId={distribution.id}
          status={distribution.status}
          isAdmin={isAdmin}
          onApprove={onApprove}
          onDeliver={onDeliver}
          locationId={distribution.locationId}
        />
      </TableCell>
    </TableRow>
  );
};
