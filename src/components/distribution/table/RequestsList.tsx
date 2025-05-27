
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { format } from "date-fns";
import { RequestsEmpty } from "./RequestsEmpty";
import { UrgencyBadge } from "./UrgencyBadge";

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

interface RequestsListProps {
  pendingRequests: PendingRequest[];
  onApproveRequest: (id: string) => void;
}

export const RequestsList = ({ 
  pendingRequests, 
  onApproveRequest 
}: RequestsListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Medicamento</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead>Unidade</TableHead>
          <TableHead>Solicitante</TableHead>
          <TableHead>Urgência</TableHead>
          <TableHead>Justificativa</TableHead>
          <TableHead>Data</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingRequests.length > 0 ? pendingRequests.map((request) => (
          <TableRow key={request.id}>
            <TableCell className="font-medium">{request.medicationName}</TableCell>
            <TableCell>{request.quantity}</TableCell>
            <TableCell>{request.unitName}</TableCell>
            <TableCell>{request.requesterName}</TableCell>
            <TableCell>
              <UrgencyBadge urgency={request.urgency} />
            </TableCell>
            <TableCell className="max-w-[200px] truncate" title={request.reason}>
              {request.reason}
            </TableCell>
            <TableCell>{format(new Date(request.date), "dd/MM/yyyy")}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onApproveRequest(request.id)}
                >
                  <Check className="h-4 w-4 mr-1" /> Aprovar
                </Button>
                <Button variant="ghost" size="sm">
                  Detalhes
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              <RequestsEmpty />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
