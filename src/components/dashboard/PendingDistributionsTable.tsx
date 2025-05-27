
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const PendingDistributionsTable = () => {
  const pendingDistributions = []; // Array vazio - será preenchido com dados reais no futuro

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Distribuições Pendentes</CardTitle>
          <CardDescription>
            Solicitações aguardando aprovação ou entrega
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
            {pendingDistributions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Sem dados disponíveis
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
