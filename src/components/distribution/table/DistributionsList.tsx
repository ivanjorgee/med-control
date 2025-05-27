
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Check, Truck } from "lucide-react";
import { format } from "date-fns";
import { DistributionEmpty } from "./DistributionEmpty";

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

interface DistributionsListProps {
  distributions: Distribution[];
  onApprove: (id: string) => void;
  onDeliver: (id: string) => void;
  isAdmin: boolean;
}

export const DistributionsList = ({ 
  distributions, 
  onApprove, 
  onDeliver, 
  isAdmin 
}: DistributionsListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Medicamento</TableHead>
          <TableHead>Lote</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead>Origem</TableHead>
          <TableHead>Destino</TableHead>
          <TableHead>Solicitado por</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {distributions.length > 0 ? distributions.map((distribution) => (
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
              <div className="flex justify-end gap-2">
                {isAdmin && distribution.status === "pending" && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onApprove(distribution.id)}
                  >
                    <Check className="h-4 w-4 mr-1" /> Aprovar
                  </Button>
                )}
                {(isAdmin && distribution.status === "approved") && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDeliver(distribution.id)}
                  >
                    <Truck className="h-4 w-4 mr-1" /> Entregar
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  Detalhes
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={9} className="text-center">
              <DistributionEmpty />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
