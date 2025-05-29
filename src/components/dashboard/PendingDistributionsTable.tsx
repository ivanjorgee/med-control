
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

export const PendingDistributionsTable = () => {
  const { authUser, isAdmin } = useAuth();
  const [pendingDistributions, setPendingDistributions] = useState<Distribution[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const navigate = useNavigate();

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
      
      setPendingDistributions(filteredDistributions.slice(0, 3)); // Mostrar apenas as 3 mais recentes
    }

    // Carregar solicitações pendentes de medicamentos
    if (isAdmin) {
      const savedRequests = localStorage.getItem('medcontrol_medication_requests');
      if (savedRequests) {
        const allRequests: PendingRequest[] = JSON.parse(savedRequests);
        setPendingRequests(allRequests.slice(0, 2)); // Mostrar apenas as 2 mais recentes
      }
    }
  }, [authUser, isAdmin]);

  const handleViewAll = () => {
    navigate('/distribution');
  };

  const totalPendingItems = pendingDistributions.length + pendingRequests.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            Distribuições e Solicitações Pendentes
            {totalPendingItems > 0 && (
              <Badge variant="destructive" className="ml-2">
                {totalPendingItems}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {isAdmin 
              ? "Distribuições e solicitações aguardando sua ação" 
              : `Solicitações aguardando aprovação ou entrega${!isAdmin && authUser?.locationId ? " da sua unidade" : ""}`
            }
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleViewAll}>
          Ver Todas
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Medicamento</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Solicitante/Destino</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status/Urgência</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Mostrar solicitações pendentes primeiro (apenas para admin) */}
            {isAdmin && pendingRequests.map((request) => (
              <TableRow key={`request-${request.id}`} className="bg-yellow-50 border-l-4 border-l-yellow-500">
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    Solicitação
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{request.medicationName}</TableCell>
                <TableCell>{request.quantity}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{request.requesterName}</div>
                    <div className="text-sm text-muted-foreground">{request.unitName}</div>
                  </div>
                </TableCell>
                <TableCell>{format(new Date(request.date), "dd/MM/yyyy")}</TableCell>
                <TableCell>
                  <Badge 
                    variant={request.urgency === "high" ? "destructive" : request.urgency === "medium" ? "default" : "secondary"}
                  >
                    {request.urgency === "high" ? "Alta" : request.urgency === "medium" ? "Média" : "Baixa"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={handleViewAll}>
                    Revisar
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {/* Mostrar distribuições pendentes */}
            {pendingDistributions.map((distribution) => (
              <TableRow key={`distribution-${distribution.id}`}>
                <TableCell>
                  <Badge variant="outline">
                    Distribuição
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{distribution.medicineName}</TableCell>
                <TableCell>{distribution.quantity}</TableCell>
                <TableCell>{distribution.destinationLocation}</TableCell>
                <TableCell>{format(new Date(distribution.date), "dd/MM/yyyy")}</TableCell>
                <TableCell>
                  <StatusBadge status={distribution.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={handleViewAll}>
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {totalPendingItems === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {isAdmin 
                      ? "Nenhuma distribuição ou solicitação pendente" 
                      : "Sem distribuições pendentes"
                    }
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Mostrar aviso se há mais itens */}
        {(pendingDistributions.length === 3 || pendingRequests.length === 2) && (
          <div className="mt-4 text-center">
            <Button variant="link" size="sm" onClick={handleViewAll}>
              Ver todos os itens pendentes →
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
