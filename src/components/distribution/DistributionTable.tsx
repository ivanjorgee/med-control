
import { DistributionTabs } from "./table/DistributionTabs";

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

interface PendingRequest {
  id: string;
  medicationName: string;
  quantity: string;
  unitName: string;
  requesterName: string;
  urgency: string;
  reason: string;
  date: string;
}

interface DistributionTableProps {
  distributions: Distribution[];
  onApprove: (id: string) => void;
  onDeliver: (id: string) => void;
  isAdmin: boolean;
  pendingRequests: PendingRequest[];
  onApproveRequest: (id: string) => void;
}

export const DistributionTable = (props: DistributionTableProps) => {
  return <DistributionTabs {...props} />;
};
