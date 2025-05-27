
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DistributionsList } from "./DistributionsList";
import { RequestsList } from "./RequestsList";

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

interface DistributionTabsProps {
  distributions: Distribution[];
  onApprove: (id: string) => void;
  onDeliver: (id: string) => void;
  isAdmin: boolean;
  pendingRequests: PendingRequest[];
  onApproveRequest: (id: string) => void;
}

export const DistributionTabs = ({ 
  distributions, 
  onApprove, 
  onDeliver, 
  isAdmin,
  pendingRequests,
  onApproveRequest
}: DistributionTabsProps) => {
  return (
    <Tabs defaultValue="distributions">
      <TabsList className="mb-4">
        <TabsTrigger value="distributions">Distribuições</TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="requests" className="relative">
            Solicitações
            {pendingRequests.length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">{pendingRequests.length}</Badge>
            )}
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="distributions">
        <Card>
          <CardContent className="p-0">
            <DistributionsList 
              distributions={distributions}
              onApprove={onApprove}
              onDeliver={onDeliver}
              isAdmin={isAdmin}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      {isAdmin && (
        <TabsContent value="requests">
          <Card>
            <CardContent className="p-0">
              <RequestsList
                pendingRequests={pendingRequests}
                onApproveRequest={onApproveRequest}
              />
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  );
};
