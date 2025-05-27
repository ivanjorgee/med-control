
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import { useEffect, useState } from "react";

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

export const PendingDistributionsTable = () => {
  const { authUser, isAdmin } = useAuth();
  const [pendingDistributions, setPendingDistributions] = useState<Distribution[]>([]);

  useEffect(() => {
    // Carregar distribuições do localStorage
    const savedDistributions = localStorage.getItem('medcontrol_distributions');
    if (savedDistributions) {
      const allDistributions: Distribution[] = JSON.parse(savedDistributions);
      
      // Filtrar distribuições baseado no perfil do usuário
      let filteredDistributions = allDistributions.filter(dist => 
        dist.status === "pending" || dist.status === "approved"
      );
      
      // Se não for admin, mostrar apenas distribuições da unidade do usuário
      if (!isAdmin && authUser?.locationId) {
        filteredDistributions = filteredDistributions.filter(dist => 
          dist.locationId === authUser.locationId
        );
      }
      
      setPendingDistributions(filteredDistributions.slice(0, 5)); // Mostrar apenas as 5 mais recentes
    }
  }, [authUser, isAdmin]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Distribuições Pendentes</CardTitle>
          <CardDescription>
            Solicitações aguardando aprovação ou entrega
            {!isAdmin && authUser?.locationId && " da sua unidade"}
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          Ver Todas
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicamento</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingDistributions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Sem distribuições pendentes
                </TableCell>
              </TableRow>
            ) : (
              pendingDistributions.map((distribution) => (
                <TableRow key={distribution.id}>
                  <TableCell className="font-medium">{distribution.medicineName}</TableCell>
                  <TableCell>{distribution.quantity}</TableCell>
                  <TableCell>{distribution.destinationLocation}</TableCell>
                  <TableCell>{distribution.requestedBy}</TableCell>
                  <TableCell>{format(new Date(distribution.date), "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <StatusBadge status={distribution.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
