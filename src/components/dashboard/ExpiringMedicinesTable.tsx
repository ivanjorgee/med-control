
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMedicines } from "@/contexts/MedicineContext";
import { format, addMonths, isBefore } from "date-fns";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export const ExpiringMedicinesTable = () => {
  const { medicines } = useMedicines();
  const [searchParams] = useSearchParams();
  const locationId = searchParams.get('locationId');
  
  // Filtrar medicamentos que expiram nos próximos 3 meses
  const today = new Date();
  const threeMonthsLater = addMonths(today, 3);
  
  const expiringMedicines = medicines
    .filter(med => {
      // Filtrar por localização se houver um locationId nas query params
      if (locationId && med.locationId !== locationId) {
        return false;
      }
      
      const expirationDate = new Date(med.expirationDate);
      return expirationDate > today && expirationDate <= threeMonthsLater;
    })
    .sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Próximos Vencimentos</CardTitle>
          <CardDescription>
            Medicamentos prestes a vencer nos próximos 3 meses
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/expiration">Ver Todos</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicamento</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Vencimento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expiringMedicines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  Nenhum medicamento próximo ao vencimento
                </TableCell>
              </TableRow>
            ) : (
              expiringMedicines.slice(0, 5).map(med => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.batchNumber}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    {format(new Date(med.expirationDate), 'dd/MM/yyyy')}
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
