
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DistributionEmpty } from "./DistributionEmpty";
import { DistributionRow } from "./DistributionRow";

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
          <DistributionRow
            key={distribution.id}
            distribution={distribution}
            onApprove={onApprove}
            onDeliver={onDeliver}
            isAdmin={isAdmin}
          />
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
